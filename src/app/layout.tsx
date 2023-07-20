import './globals.css'
import type { Metadata } from 'next'
import { Ruda, Kablammo } from 'next/font/google'
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";

const bodyFont = Ruda({ weight: ['400', '700'], subsets: ['latin'] });
// const kablamo = Kablammo({ subsets: ['latin'], variable: '--h-font' });

export const metadata: Metadata = {
  title: 'Travelog',
  description: 'A picoptrocs creative website about travels',
  icons: {
    icon: '/icon.png',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { userId } = auth();
  const user = await currentUser();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={bodyFont.className + " overflow-hidden"}>
          <div className="p-5 float-right flex flex-column justify-start">
              <div>{user?.emailAddresses[0].emailAddress || ""}&nbsp;</div>
              <UserButton afterSignOutUrl="/"/>
          </div>

          {children}

        </body>
      </html>
    </ClerkProvider>
  )
}
