// src/components/AuthButtons.tsx
'use client'

import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'


export function AuthButtons() {


  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Sign Out
          </button>
        </SignOutButton>
      ) : (
        <SignInButton>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  )
}
