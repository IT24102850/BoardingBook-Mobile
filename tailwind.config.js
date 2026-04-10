/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
    "./backend/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.surface-card': {
          'border-radius': '1.5rem',
          'border': '1px solid rgba(255,255,255,0.1)',
          'background': 'rgba(255,255,255,0.08)',
          'backdrop-filter': 'blur(24px)'
        },
        '.surface-glass': {
          'border-radius': '1.5rem',
          'border': '1px solid rgba(255,255,255,0.1)',
          'background': 'rgba(255,255,255,0.08)',
          'backdrop-filter': 'blur(24px)'
        },
        '.surface-subtle': {
          'border-radius': '1.5rem',
          'border': '1px solid rgba(255,255,255,0.1)',
          'background': 'rgba(255,255,255,0.05)',
          'backdrop-filter': 'blur(8px)'
        },
        '.tag-pill': {
          'border-radius': '9999px',
          'border': '1px solid rgba(255,255,255,0.1)',
          'background': 'rgba(255,255,255,0.06)',
          'padding': '0.25rem 0.75rem',
          'font-size': '0.75rem',
          'font-weight': '500',
          'color': '#f4f4f5'
        },
        '.muted': {
          'color': '#a1a1aa'
        }
      })
    }
  ],
}
