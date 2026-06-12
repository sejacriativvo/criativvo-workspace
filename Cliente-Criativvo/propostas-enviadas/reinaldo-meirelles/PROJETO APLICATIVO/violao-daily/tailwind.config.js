/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta principal — verde "duolingo style" como sucesso/CTA.
        brand: {
          50: '#F1FBE6',
          100: '#DDF4C0',
          200: '#BFEA8B',
          300: '#9EDF55',
          400: '#7CD428',
          500: '#58CC02', // primary green
          600: '#46A302',
          700: '#3A8602',
          800: '#2C6601',
          900: '#1F4900',
        },
        // Cinza neutro com tom mais quente, parecido com apps gamificados.
        ink: {
          50: '#FAFAFA',
          100: '#F7F7F7',
          200: '#E5E5E5',
          300: '#D1D1D1',
          400: '#AFAFAF',
          500: '#777777',
          600: '#5A5A5A',
          700: '#4B4B4B',
          800: '#3C3C3C',
          900: '#2B2B2B',
          950: '#1A1A1A',
        },
        // Amarelo / âmbar para recompensas e XP.
        sun: {
          400: '#FFE066',
          500: '#FFC800',
          600: '#FF9600',
        },
        // Azul vibrante para áudio, info, foco.
        sky: {
          50: '#E6F7FE',
          100: '#BFE9FB',
          400: '#5EC9F8',
          500: '#1CB0F6',
          600: '#0E84BC',
          700: '#08628C',
        },
        // Roxo lúdico.
        grape: {
          400: '#DDA9FF',
          500: '#CE82FF',
          600: '#A95EE6',
        },
        // Vermelho coração / energia.
        rose: {
          50: '#FFE9E9',
          100: '#FFCFCF',
          400: '#FF7C7C',
          500: '#FF4B4B',
          600: '#E03B3B',
        },
        // "Midnight" virou um navy lúdico — usado em headers premium.
        midnight: {
          500: '#3A4A6E',
          600: '#2E3A57',
          700: '#1F2940',
          800: '#161E33',
          900: '#0E1424',
        },
      },
      fontFamily: {
        display: ['Fredoka', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['0.65rem', { lineHeight: '0.85rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      // Sombras inferiores fortes que dão a sensação 3D dos botões gamificados.
      boxShadow: {
        card: '0 1px 0 rgba(15, 23, 42, 0.05), 0 4px 0 0 rgba(15, 23, 42, 0.06)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.08)',
        'btn-green': '0 4px 0 0 #46A302',
        'btn-blue': '0 4px 0 0 #0E84BC',
        'btn-yellow': '0 4px 0 0 #DC9F00',
        'btn-orange': '0 4px 0 0 #C97700',
        'btn-red': '0 4px 0 0 #C53030',
        'btn-grape': '0 4px 0 0 #8444C2',
        'btn-gray': '0 3px 0 0 #C4C4C4',
        'glow-brand': '0 0 0 6px rgba(88, 204, 2, 0.18), 0 14px 30px rgba(88, 204, 2, 0.35)',
        'glow-amber': '0 0 0 6px rgba(255, 200, 0, 0.20), 0 12px 32px rgba(255, 150, 0, 0.35)',
        'glow-blue': '0 0 0 6px rgba(28, 176, 246, 0.18), 0 12px 32px rgba(14, 132, 188, 0.30)',
        'glow-soft': '0 10px 30px rgba(15, 23, 42, 0.10)',
        'inner-soft': 'inset 0 -4px 0 rgba(15, 23, 42, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(180deg, #6BD910 0%, #58CC02 100%)',
        'gradient-night': 'linear-gradient(135deg, #1F2940 0%, #3A4A6E 100%)',
        'gradient-sun': 'linear-gradient(180deg, #FFD64D 0%, #FFC800 100%)',
        'gradient-soft': 'linear-gradient(180deg, #FFFFFF 0%, #F7F7F7 100%)',
        'gradient-sky': 'linear-gradient(180deg, #4ECCFF 0%, #1CB0F6 100%)',
        'gradient-grape': 'linear-gradient(180deg, #E0B7FF 0%, #CE82FF 100%)',
      },
    },
  },
  plugins: [],
}
