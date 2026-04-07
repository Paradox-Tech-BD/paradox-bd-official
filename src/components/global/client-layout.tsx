"use client"
import Navbar from './navbar';
import Footer from './footer';
import localFont from "next/font/local";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { GeneralSettingsQueryResult, NavigationSettingsQueryResult } from '../../../sanity.types';

interface ClientLayoutProps {
  children: React.ReactNode;
  settings: GeneralSettingsQueryResult;
  navigationSettings: NavigationSettingsQueryResult;
}

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
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
    <div className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased grid min-h-[100dvh] grid-rows-[auto_1fr_auto] relative`}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 lab-vignette" />
        <div className="absolute inset-0 lab-grid opacity-75" />
        <div className="absolute inset-0 lab-grid-fine opacity-45" />
        <div className="absolute inset-0 lab-scanlines opacity-25" />
        <div className="absolute inset-0 lab-fiducials opacity-[0.12]" />
        <div className="absolute inset-0 scholar-noise" />
      </div>
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
            color: '#0c0c12',
            fontWeight: '500',
            backgroundColor: '#ededf0'
          }
        }}
      />
    </div>
  )
}
