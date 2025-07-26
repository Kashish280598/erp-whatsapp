export const theme = {
  colors: {
    primary: {
      DEFAULT: '#9A4DEF',
      50:  '#F6F2FE',
      100: '#ECE4FD',
      200: '#D8C6FA',
      300: '#C7ABF8',
      400: '#B890F5',
      500: '#A973F3',
      600: '#9A4DEF',
      700: '#8A2BE2',
      800: '#5D1A9B',
      900: '#340B5B',
    },
    neutral: {
      DEFAULT: '#070822',
      50: '#F8F9FF',
      100: '#E4E4E8',
      200: '#D1D1D6',
      300: '#A7A7B3',
      400: '#5E5F6E',
      500: '#070822',
    },
    success: {
      DEFAULT: '#16A34A',
      light: '#F0FDF4',
      50:  '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      DEFAULT: '#FF9500',
      light: '#FFF4E5',
    },
    error: {
      DEFAULT: '#DC2626',
      light: '#FEF2F2',
      50:  '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    info: {
      DEFAULT: '#007AFF',
      light: '#E5F1FF',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
  },
  borderRadius: {
    sm: '0.375rem',   // 6px
    base: '0.625rem', // 10px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
  },
  shadows: {
    sm: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    base: '0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
    md: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0px 8px 16px -4px rgba(16, 24, 40, 0.12)',
    xl: '0px 12px 24px -6px rgba(16, 24, 40, 0.16)',
  },
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
export type ThemeBreakpoint = keyof typeof theme.breakpoints; 