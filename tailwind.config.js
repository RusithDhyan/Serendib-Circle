module.exports = {
  darkMode: 'class',
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
    extend: {
      colors: {
        serendib: {
          primary: '#0A4D68',
          secondary: '#088395',
          accent: '#05BFDB',
          light: '#00FFCA',
          gold: '#D4AF37',
          bronze: '#CD7F32',
          silver: '#C0C0C0',
        },
      },
    },
  },
    plugins: [],
  };
  
  