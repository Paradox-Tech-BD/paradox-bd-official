"use client"
import { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className }: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const DOT_SPACING = 36;
    const DOT_RADIUS = 1;
    const MOUSE_RADIUS = 120;

    interface Dot {
      x: number;
      y: number;
      baseOpacity: number;
      opacity: number;
      phase: number;
    }

    let dots: Dot[] = [];

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      buildDots();
    }

    function buildDots() {
      dots = [];
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * DOT_SPACING,
            y: r * DOT_SPACING,
            baseOpacity: 0.12 + Math.random() * 0.06,
            opacity: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      t += 0.008;

      for (const dot of dots) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 1 - dist / MOUSE_RADIUS);

        const wave = Math.sin(t + dot.phase) * 0.04;
        dot.opacity = dot.baseOpacity + wave + mouseInfluence * 0.5;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS + mouseInfluence * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
