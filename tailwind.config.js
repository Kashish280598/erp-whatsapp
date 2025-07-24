/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#565ADD',
          50: '#E1E2F9',
          100: '#CCCDF6',
          200: '#A3A4EF',
          300: '#7A7CE8',
          400: '#5153E1',
          500: '#565ADD',
          600: '#3235C4',
          700: '#262994',
          800: '#1A1C64',
          900: '#0E0F34',
        },
        // Neutral Colors
        neutral: {
          DEFAULT: '#070822',
          50: '#F8F9FF',
          100: '#E4E4E8',
          200: '#D1D1D6',
          300: '#A7A7B3',
          400: '#5E5F6E',
          500: '#070822',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#079456',
          light: '#E6F5ED',
        },
        warning: {
          DEFAULT: '#FF9500',
          light: '#FFF4E5',
        },
        error: {
          DEFAULT: '#FF3B30',
          light: '#FFE5E4',
        },
        info: {
          DEFAULT: '#007AFF',
          light: '#E5F1FF',
        },
      },
      ringColor: {
        primary: {
          DEFAULT: '#565ADD',
          50: '#E1E2F9',
          100: '#CCCDF6',
          200: '#A3A4EF',
          300: '#7A7CE8',
          400: '#5153E1',
          500: '#565ADD',
          600: '#3235C4',
          700: '#262994',
          800: '#1A1C64',
          900: '#0E0F34',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.813rem', { lineHeight: '1.25rem' }],  // 13px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '15': '3.75rem',    // 60px
        '16.5': '4.125rem', // 66px
        '18.5': '4.625rem', // 74px
      },
      borderRadius: {
        'sm': '0.375rem',   // 6px
        DEFAULT: '0.625rem', // 10px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
      },
      boxShadow: {
        'sm': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        DEFAULT: '0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'lg': '0px 8px 16px -4px rgba(16, 24, 40, 0.12)',
        'xl': '0px 12px 24px -6px rgba(16, 24, 40, 0.16)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        'infinite-scroll': 'infinite-scroll var(--scroll-speed, 20s) linear infinite',
      }
    },
  },
  plugins: [],
} 