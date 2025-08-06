// components/FolderSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type Folder = { id: string; name: string };

interface Props {
  onSelect: (folderId: string) => void;
}

export function FolderSelector({ onSelect }: Props) {
  const { user } = useUser();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function load() {
      if (!user?.primaryEmailAddress) return;
      const res = await fetch('/api/drive/folders', {
        headers: { 'x-user-email': user.primaryEmailAddress.emailAddress }
      });
      const json = await res.json();
      if (json.folders && Array.isArray(json.folders)) {
        setFolders(json.folders);
      } else {
        setError(json.error || 'Failed to load folders');
      }
    }
    load();
  }, [user]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!folders.length) return <p>No video folders found.</p>;

  return (
    <div className="mb-4">
      <h2 className="mb-2 font-medium">Select a Video Folder</h2>
      <div className="flex flex-wrap gap-2">
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
