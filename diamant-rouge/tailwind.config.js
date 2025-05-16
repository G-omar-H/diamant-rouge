/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class', // Only Ebony in .dark mode

  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './styles/globals.css',
  ],

  safelist: [
    'button-primary',
    'button-secondary',
    'card',
    'alert',
    'hover-scale',
    'hover:scale-102',
    'hover:scale-103',
    'image-luxury',
    'input-field',
    'dropdown-menu',
    'dropdown-menu-active',
    'text-ivory',
    'bg-ivory',
    'text-royalGold',
    'heading-feature',
    'heading-section',
    'heading-bullet',
    'text-shadow-sm',
    'text-shadow-md',
    'text-shadow-dark',
    'text-shadow-strong',
    'mobile-nav-link',
    'product-card-mobile',
    'mobile-optimized-form',
  ],

  theme: {
    extend: {
      colors: {
        brandIvory: '#FAF3E3', // Light Ivory tone from the logo
        brandGold: '#D4AF37',  // Gold from the logo
        burgundy: '#6A0F23',   // For accent & hover
        richEbony: '#0A0A0A',  // For dark mode only
        deepBlack: '#0C0C0C',
        platinumGray: '#B0B0B0',
        diamondWhite: '#FCFCFC',
        ivory: '#FFFFF0',
      },

      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        serif: ['Didot', 'serif'],
      },

      fontSize: {
        '6.5xl': '4rem',
        '7.5xl': '5.25rem',
        '8xl': '6rem',
      },

      boxShadow: {
        luxury: '0 4px 15px rgba(212, 175, 55, 0.4)',
        subtle: '0 2px 8px rgba(255, 255, 255, 0.1)',
        deepGlow: '0px 8px 30px rgba(212, 175, 55, 0.6)',
        regal: '0 0 30px rgba(212, 175, 55, 0.8)',
        'mobile': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'mobile-subtle': '0 1px 5px rgba(212, 175, 55, 0.15)',
        'mobile-elevation': '0 3px 6px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },

      screens: {
        'xs': '480px',
        '2xl': '1440px',
        '3xl': '1600px',
        '4xl': '1920px',
      },

      backgroundImage: {
        'gold-gradient': 'linear-gradient(145deg, #D4AF37 0%, #6A0F23 100%)',
        'gold-mobile-gradient': 'linear-gradient(135deg, #D4AF37 0%, #6A0F23 100%)',
      },

      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out forwards',
        slideIn: 'slideIn 0.5s ease-in-out forwards',
        drift: 'drift 8s ease-in-out infinite',
        'mobile-pulse': 'mobilePulse 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        mobilePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },

      scale: {
        '102': '1.02',
        '103': '1.03',
      },

      transitionDuration: {
        '400': '400ms',
      },

      minHeight: {
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
