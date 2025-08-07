import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Video Uploader',
  description: 'Schedule and upload videos from Google Drive to YouTube',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
