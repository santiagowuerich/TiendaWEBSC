/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Añadir la fuente Inter usando la variable CSS
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        carousel: 'carousel 30s linear infinite', // Define la animación carousel
      },
      keyframes: {
        carousel: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Mueve hasta el final de la primera mitad
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography')
  ]
}; 