/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D4739',
        accent: '#E89F71',
        surface: '#F5F5F5',
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

