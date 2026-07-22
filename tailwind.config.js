/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#000000',
        cardbg: '#0D0D0D',
        cardborder: '#1A1A1A',
        pillbg: '#111111',
        brand: {
          lime: '#C3F53B',
          orange: '#FF8C00',
          white: '#FFFFFF',
          dark: '#000000'
        },
        status: {
          success: '#C3F53B',
          warning: '#FF8C00',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
