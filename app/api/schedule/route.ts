import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, selectedIds, uploadTime, frequency } = body;

  // Save videos to `videos` table
  const videoInserts = selectedIds.map((driveId: string) => ({
    user_id: userId,
    drive_file_id: driveId,
    name: "video", // Optional — update later if needed
  }));

  await supabase.from("videos").upsert(videoInserts);

  // Save schedule to `video_schedules` table
  await supabase.from("video_schedules").upsert({
    user_id: userId,
    upload_time: uploadTime,
    frequency,
  });

  return NextResponse.json({ success: true });
}
