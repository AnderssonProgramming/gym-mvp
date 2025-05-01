/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,jsx,ts,tsx}',
      './src/components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        // aquí pones tus colores/customizaciones
        colors: {
          primary: '#1E40AF',
        },
      },
    },
    plugins: [],
  }
  