/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#334155',
        'main-blue': '#322783',
      },
      gridTemplateRows: {
        layout: '80px repeat(5, minmax(0, 1fr))',
        card: 'min-content min-content',
      },
    },
  },
  plugins: [],
};
