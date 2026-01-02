/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['var(--font-lora)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        noto: ['var(--font-noto)', 'sans-serif'],
      },
      colors: {
        parchment: '#F9F7F2',
      },
    },
  },
  plugins: [],
}

