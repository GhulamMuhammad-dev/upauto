import { google } from 'googleapis';
import { supabaseServer } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const email = req.headers.get('x-user-email');
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const { data: tokenData } = await supabaseServer
    .from('google_tokens')
    .select('*')
    .eq('email', email)
    .single();

  if (!tokenData?.access_token) {
    return NextResponse.json({ error: 'No valid token' }, { status: 401 });
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
  oauth2.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || undefined,
  });

  try {
    const drive = google.drive({ version: 'v3', auth: oauth2 });
    const response = await drive.files.list({
      fields: 'files(id, name, mimeType, thumbnailLink)',
      pageSize: 100,
    });

    const all = response.data.files ?? [];
    const videos = all.filter((f) => f.mimeType?.startsWith('video/'));
    console.log(`Fetched ${videos.length} video files`);
    return NextResponse.json(videos);
  } catch (err: any) {
    console.error('Drive API error:', err.toString());
    return NextResponse.json({ error: 'Drive API failed' }, { status: 500 });
  }
}
