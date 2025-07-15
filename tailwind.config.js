module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        'epilogue': ['Epilogue', 'sans-serif'],
      },
      colors: {
        primary: '#FF6600',
        secondary: '#333333',
        light: '#F5F5F5',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}