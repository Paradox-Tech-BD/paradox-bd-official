"use client"
import Navbar from './navbar';
import Footer from './footer';
import localFont from "next/font/local";
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
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
    <div className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${geistSans.variable} ${geistMono.variable} font-spaceGrotesk antialiased grid min-h-[100dvh] grid-rows-[auto_1fr_auto]`}>
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
            color: '#FFFFFF',
            fontWeight: '500',
            backgroundColor: '#000000'
          }
        }}
      />
    </div>
  )
}
