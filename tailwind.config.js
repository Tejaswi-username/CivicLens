/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nest: {
          charcoal: '#1E252B',
          'charcoal-hover': '#11171C',
          mint: '#D7EFE2',
          'mint-bg': '#EDF6F1',
          'mint-dark': '#184E34',
          lavender: '#D9CEF3',
          'lavender-light': '#E8E1F7',
          'lavender-dark': '#2C204B',
          peach: '#F6EBEA',
          'peach-dark': '#8B2626',
          celadon: '#E8F3EC',
          border: '#E2E8F0',
          muted: '#64748B',
        },
        navy: {
          50: '#f0f5ff',
          100: '#e0ebfe',
          200: '#bad2fc',
          300: '#7faefa',
          400: '#3b82f6',
          500: '#1d4ed8',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#172554',
          900: '#1E252B',
          950: '#090d16'
        },
        civic: {
          teal: '#1D5A3C',
          'teal-light': '#2E7D52',
          'teal-subtle': '#D7EFE2',
          accent: '#2C204B'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
