import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      borderRadius: {
        '4xl': '2.4rem'
      },
      colors: {
        lab: {
          bg: '#030b18',
          surface: '#07142a',
          card: '#0b1e38',
          border: 'rgba(34,211,238,0.12)',
          'border-mid': 'rgba(34,211,238,0.22)',
          cyan: '#22d3ee',
          blue: '#3b82f6',
          purple: '#a78bfa',
          text: '#e2e8f0',
          muted: '#64748b',
        }
      },
      fontFamily: {
        spaceGrotesk: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        geistSans: ['var(--font-geist-sans)'],
        geistMono: ['var(--font-geist-mono)'],
      },
      keyframes: {
        'logo-marquee-move': {
          to: {
            transform: 'translateX(-50%)'
          }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'logo-marquee': 'logo-marquee-move 60s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ],
  future: {
    hoverOnlyWhenSupported: true
  }
};

export default config;
