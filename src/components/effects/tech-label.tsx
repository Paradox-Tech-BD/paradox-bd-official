import { cn } from '@/lib/utils';

interface TechLabelProps {
  children: React.ReactNode;
  className?: string;
  blink?: boolean;
  dim?: boolean;
}

export default function TechLabel({ children, className, blink = false, dim = false }: TechLabelProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase',
      dim ? 'text-white/25' : 'text-white/40',
      className
    )}>
      {blink && (
        <span
          className='inline-block w-1.5 h-1.5 rounded-full bg-emerald-400'
          style={{ animation: 'blink-dot 2s ease-in-out infinite' }}
        />
      )}
      {children}
    </div>
  );
}
