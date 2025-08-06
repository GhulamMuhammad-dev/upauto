'use client';

import { useEffect, useState } from 'react';
import { useUser, UserButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScheduleForm } from '@/components/ScheduleForm';

type DriveFile = { id: string; name: string; thumbnailLink: string };

export default function DashboardPage() {
  const { user } = useUser();
  const [videos, setVideos] = useState<DriveFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/drive/videos', {
        headers: { 'x-user-email': user?.primaryEmailAddress?.emailAddress || '' },
      });
      if (!res.ok) {
        console.error('Video fetch failed:', res.status);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    }
    if (user) load();
  }, [user]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getIndex = (id: string) => selectedIds.findIndex((x) => x === id) + 1;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Select Videos to Schedule</h1>
        <div className="flex gap-3">
          <UserButton />
          <SignOutButton>
            <Button variant="outline">Sign Out</Button>
          </SignOutButton>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => {
          const sel = selectedIds.includes(v.id);
          const idx = getIndex(v.id);
          return (
            <div
              key={v.id}
              onClick={() => toggle(v.id)}
              className={`relative border rounded-lg p-3 cursor-pointer ${
                sel ? 'border-blue-600 ring-2 ring-blue-300' : 'hover:shadow-md'
              }`}
            >
              <Image
                src={v.thumbnailLink}
                alt={v.name}
                width={300}
                height={180}
                className="rounded-md mb-3 object-cover w-full"
                unoptimized
              />
              <p className="truncate">{v.name}</p>
              {sel && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {idx}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-8">
          <ScheduleForm selectedIds={selectedIds} />
        </div>
      )}
    </div>
  );
}
