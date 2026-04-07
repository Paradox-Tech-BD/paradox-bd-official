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
        dark: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          card: 'rgb(var(--color-card) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-instrument-sans)', 'Instrument Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-geist-sans)', 'var(--font-instrument-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'var(--font-jetbrains-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
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
      },
      animation: {
        'logo-marquee': 'logo-marquee-move 60s linear infinite',
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
