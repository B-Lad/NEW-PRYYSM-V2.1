import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['Geist Mono', 'monospace'],
      },
      colors: {
        base:  '#f5f3ef',
        ink:   '#1a1624',
        brand: {
          vi:  '#5b3fd4',
          viL: '#ede9fd',
          cr:  '#966010',
          crL: '#fdf3e3',
          go:  '#1a7048',
          goL: '#e6f7ef',
          er:  '#b83228',
          erL: '#fdecea',
          wa:  '#a85510',
          waL: '#fef3e2',
          bu:  '#1a5898',
          buL: '#e8f2fc',
        },
        surface: {
          1: '#f0ede8',
          2: '#e8e4dd',
          3: '#d8d3ca',
        },
        text: {
          1: '#1a1624',
          2: '#4a4558',
          3: '#8a8499',
          4: '#b8b3c4',
        },
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '10px',
        xs: '8px',
      },
      boxShadow: {
        card:   '0 1px 3px rgba(26,22,36,.06), 0 4px 14px rgba(26,22,36,.07)',
        'card-hover': '0 4px 14px rgba(26,22,36,.09), 0 16px 44px rgba(26,22,36,.11)',
        btn:    '0 2px 8px rgba(91,63,212,.28)',
      },
      animation: {
        'float-in': 'float-in 0.45s ease both',
        breathe:    'breathe 1.8s ease infinite',
        ping2:      'ping2 2s ease-out infinite',
      },
      keyframes: {
        'float-in': {
          from: { opacity: '0', transform: 'translateY(13px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '1' },
          '55%':      { opacity: '0.22' },
        },
        ping2: {
          '0%':   { transform: 'scale(1)', opacity: '0.6' },
          '70%':  { transform: 'scale(2.3)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
