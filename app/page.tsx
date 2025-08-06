'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">YouTube Auto Uploader</h1>
      <p className="mb-6">Connect your Google Drive, select videos, and schedule uploads automatically.</p>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In / Sign Up</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
        <Button className="mt-4" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </SignedIn>
    </main>
  );
}
