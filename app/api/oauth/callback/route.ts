import { google } from 'googleapis';
import { supabaseServer } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) return redirect('/?error=missing-code');

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);

  const userApi = google.oauth2('v2');
  const ui = await userApi.userinfo.get({ auth: oauth2 });
  const email = ui.data.email;
  if (!email) return redirect('/?error=no-email');

  await supabaseServer.from('google_tokens').upsert({
    email,
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token ?? null,
    expires_at: tokens.expiry_date ?? Date.now() + 3600000,
  });

  return redirect('/dashboard');
}
