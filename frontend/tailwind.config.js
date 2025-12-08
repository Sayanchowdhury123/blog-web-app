module.exports = {
  content: [
    "./index.html",
    "./src//*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        spaceGrotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
],
}