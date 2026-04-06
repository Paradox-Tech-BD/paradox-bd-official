"use client"
import { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export default function BlurText({ text, className, delay = 0, stagger = 35 }: BlurTextProps) {
  const [revealed, setRevealed] = useState<boolean[]>([]);

  const chars = text.split('');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    chars.forEach((_, i) => {
      const t = setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, delay + i * stagger);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            transition: `opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease`,
            transitionDelay: `0ms`,
            opacity: revealed[i] ? 1 : 0,
            filter: revealed[i] ? 'blur(0px)' : 'blur(8px)',
            transform: revealed[i] ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
