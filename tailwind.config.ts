import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // الهوية البصرية لمعرض الراقي الهندسي
        gold: {
          DEFAULT: '#C59B27',
          50: '#FBF7EC',
          100: '#F5EDD4',
          200: '#EADBA8',
          300: '#DFC87D',
          400: '#D4B451',
          500: '#C59B27',
          600: '#9E7C1F',
          700: '#765D17',
          800: '#4F3E10',
          900: '#271F08',
        },
        navy: {
          DEFAULT: '#1D232A',
          50: '#E9EBED',
          100: '#C8CDD2',
          200: '#9AA3AC',
          300: '#6C7986',
          400: '#454F59',
          500: '#1D232A',
          600: '#171C22',
          700: '#111519',
          800: '#0B0E11',
          900: '#060708',
        },
        cream: '#FDFBF7',
        softgray: '#EFEBE4',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 14px rgba(29, 35, 42, 0.08)',
        'card-hover': '0 10px 30px rgba(29, 35, 42, 0.14)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.45s ease-out',
        toastIn: 'toastIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
