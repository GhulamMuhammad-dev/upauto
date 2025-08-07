// src/app/dashboard/page.tsx

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AuthButtons } from '@/components/AuthButtons'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🎥 Dashboard</h1>
        <AuthButtons />
      </div>

      <p className="mt-4 text-lg text-gray-700">
        Welcome, <span className="font-semibold">{user?.firstName}</span>!
      </p>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
        <p>This is your private dashboard. You’ll soon be able to:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Connect Google Drive</li>
          <li>Organize & schedule videos</li>
          <li>Auto-upload to YouTube</li>
        </ul>
      </div>
    </main>
  )
}
