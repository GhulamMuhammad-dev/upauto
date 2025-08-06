// app/api/drive/folders/route.ts
import { google } from 'googleapis';
import { supabaseServer } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const email = req.headers.get('x-user-email');
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  const { data: tokenData, error: tokenError } = await supabaseServer
    .from('tokens')
    .select('*')
    .eq('email', email)
    .single();

  if (tokenError || !tokenData) {
    console.error('No token found:', tokenError?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token
  });

  const drive = google.drive({ version: 'v3', auth: oauth2 });

  const folderRes = await drive.files.list({
    q: "name = 'Videos' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name)'
  });

  const videoRoot = folderRes.data.files?.[0];
  if (!videoRoot?.id) return NextResponse.json({ folders: [] });

  const subRes = await drive.files.list({
    q: `'${videoRoot.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)'
  });

  return NextResponse.json({ folders: subRes.data.files || [] });
}
