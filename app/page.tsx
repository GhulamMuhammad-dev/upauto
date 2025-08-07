// src/app/page.tsx

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">🎬 Welcome to AutoTube</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        AutoTube helps you schedule and upload videos from Google Drive to
        YouTube.
      </p>

      <SignedOut>
        <AuthButtons />
      </SignedOut>

      <SignedIn>
        <Link
          href="/dashboard"
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Go to Dashboard →
        </Link>
      </SignedIn>
    </main>
  );
}
