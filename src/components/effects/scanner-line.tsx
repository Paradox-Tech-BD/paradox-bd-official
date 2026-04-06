"use client"
import { cn } from '@/lib/utils';

interface ScannerLineProps {
  className?: string;
}

export default function ScannerLine({ className }: ScannerLineProps) {
  return (
    <div
      className={cn('absolute inset-x-0 pointer-events-none overflow-hidden', className)}
      style={{ zIndex: 5 }}
    >
      <div
        className='absolute inset-x-0 h-px'
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          animation: 'scanner-scan 6s linear infinite',
          top: 0,
        }}
      />
    </div>
  );
}
