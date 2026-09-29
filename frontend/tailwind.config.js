/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#120c08',
          900: '#1b120c',
          850: '#241810',
          800: '#2d1e15',
          750: '#38261b',
          700: '#453022',
          600: '#563c2b'
        },
        coffee: {
          50: '#f8f9fc',
          100: '#eef0fa',
          150: '#dce0f5',
          200: '#c5cbf0',
          300: '#a6b0e8',
          400: '#8592de',
          500: '#6c6ecd',
          600: '#5255b8',
          700: '#414399',
          800: '#343675',
          900: '#282a57',
          950: '#0c0c16',
        },
        brand: {
          cyan: '#0891b2',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#d97706',
          caramel: '#b45309',
          terracotta: '#e05a36',
          gold: '#eab308',
          espresso: '#26160d',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          blue: '#2563eb'
        },
        accent:"#6c6ecd",
        card:"#3d3e7e"
      },
      fontFamily: {
        heading: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(8, 145, 178, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(217, 119, 6, 0.45)',
        'glow-caramel': '0 0 30px -5px rgba(180, 83, 9, 0.45)',
        'glow-terracotta': '0 0 25px -5px rgba(224, 90, 54, 0.45)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-strong-cyan': '0 0 35px 2px rgba(8, 145, 178, 0.45)',
        'glow-strong-amber': '0 0 35px 2px rgba(217, 119, 6, 0.55)',
        'subtle-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(217, 163, 115, 0.08)',
        'subtle-light': '0 10px 25px -5px rgba(78, 48, 25, 0.06), 0 0 0 1px rgba(198, 178, 156, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'laser-scan': 'laser 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        laser: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
