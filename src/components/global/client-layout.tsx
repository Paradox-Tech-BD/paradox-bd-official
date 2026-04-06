"use client"
import Navbar from './navbar';
import Footer from './footer';
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { GeneralSettingsQueryResult, NavigationSettingsQueryResult } from '../../../sanity.types';

interface ClientLayoutProps {
  children: React.ReactNode;
  settings: GeneralSettingsQueryResult;
  navigationSettings: NavigationSettingsQueryResult;
}

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = localFont({
  src: "../../app/(frontend)/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../app/(frontend)/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientLayout({ 
  children,
  settings,
  navigationSettings,
}: ClientLayoutProps) {

  const pathname = usePathname();
  if (pathname.includes('/studio')) return (children);
  
  return (
    <div className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} font-spaceGrotesk antialiased grid min-h-[100dvh] grid-rows-[auto_1fr_auto] bg-lab-bg text-lab-text`}>
      <Navbar 
        settings={settings}
        navigationSettings={navigationSettings}
      />
      <main className='overflow-hidden'>
        {children}
      </main>
      <Footer 
        settings={settings} 
        navigationSettings={navigationSettings}
      />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'text-sm font-semibold antialiased',
          style: {
            borderRadius: '300px',
            padding: '4px 8px',
            color: '#e2e8f0',
            fontWeight: '500',
            backgroundColor: '#0b1e38',
            border: '1px solid rgba(34,211,238,0.2)',
          }
        }}
      />
    </div>
  )
}
