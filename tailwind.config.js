/** @type {import('tailwindcss').Config} */

// Escalas basadas en la guía de estilo de Vítaly. Las paletas por defecto de Tailwind se
// redirigen a ellas para que todas las pantallas compartan los mismos tonos:
//   azul (marca) ← blue, sky, indigo, cyan, teal, purple, violet, fuchsia
//   verde (estado OK, #029968) ← green, emerald, lime
//   amarillo (acento y aviso, #FFB700) ← yellow, amber, orange
//   rojo (error, #DC3545) ← red, rose, pink
const AZUL = {
  50: '#EEF1F8', 100: '#E6EAF3', 200: '#CCD6E6', 300: '#99ACCD', 400: '#6683B4', 500: '#335999',
  600: '#002F82', 700: '#00286F', 800: '#00225F', 900: '#001A49', 950: '#00112F',
};
const VERDE = {
  50: '#E8F7F1', 100: '#D0EFE3', 200: '#A3DFC8', 300: '#6FCBA8', 400: '#38B385', 500: '#029968',
  600: '#02875C', 700: '#027A53', 800: '#025F41', 900: '#014530', 950: '#012A1D',
};
const AMARILLO = {
  50: '#FFF8E6', 100: '#FFF1CC', 200: '#FFE299', 300: '#FFD466', 400: '#FFC533', 500: '#FFB700',
  600: '#E0A100', 700: '#8F6600', 800: '#6B4D00', 900: '#4D3700', 950: '#2E2100',
};
const ROJO = {
  50: '#FDECEE', 100: '#F8D7DA', 200: '#F1AEB5', 300: '#EA868F', 400: '#E35D6A', 500: '#DC3545',
  600: '#C42B3A', 700: '#A52834', 800: '#842029', 900: '#58151C', 950: '#3A0E12',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: AZUL, sky: AZUL, indigo: AZUL, cyan: AZUL, teal: AZUL, purple: AZUL, violet: AZUL, fuchsia: AZUL,
        green: VERDE, emerald: VERDE, lime: VERDE,
        yellow: AMARILLO, amber: AMARILLO, orange: AMARILLO,
        red: ROJO, rose: ROJO, pink: ROJO,
        // Paleta Halo adaptada a la guía de estilo de Vítaly (styleguide.vitaly.es).
        // Los nombres antiguos se mantienen para no tocar cada componente: "cyan" es ahora el
        // azul corporativo y "emerald" el verde de estado (Vigilancia de la Salud).
        halo: {
          dark: '#00225F',
          'dark-secondary': '#0A3A8C',
          'dark-tertiary': '#1A4A99',
          cyan: '#002F82',
          'cyan-glow': '#335999',
          'cyan-dark': '#00286F',
          emerald: '#029968',
          'emerald-glow': '#03B57B',
          'emerald-dark': '#027A53',
          silver: '#6B7280',
          'silver-light': '#4B5563',
          'silver-dark': '#374151',
          accent: '#FFB700',
          'light-gray': '#6B7280',
          'border-dark': '#E5E7EB',
        },
        vitaly: {
          azul: '#002F82',
          'azul-hover': '#00286F',
          'azul-80': '#335999',
          'azul-60': '#6683AD',
          'azul-40': '#99ACC6',
          'azul-20': '#CCD6E0',
          'azul-10': '#E6EAF3',
          amarillo: '#FFB700',
          'amarillo-80': '#FFC533',
          'amarillo-60': '#FFD466',
          'amarillo-40': '#FFE299',
          'amarillo-20': '#FFF1CC',
          'gris-oscuro': '#CCCCCC',
          'gris-claro': '#EFEFEF',
          primary: '#002F82',
          'primary-light': '#335999',
          secondary: '#FFB700',
          success: '#029968',
          warning: '#FFB700',
          danger: '#DC3545',
          info: '#337AB7',
        },
        // Colores de fondo
        bg: {
          light: '#ffffff',
          secondary: '#f8f9fa',
          tertiary: '#efefef',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        // Sombras suaves y neutras, como las tarjetas de Vítaly Workspace
        'card': '0 1px 6px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 14px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'glow-cyan': '0 1px 6px rgba(0, 47, 130, 0.12)',
        'glow-emerald': '0 1px 6px rgba(2, 153, 104, 0.12)',
      },
      backgroundImage: {
        'circuit-pattern': 'none',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
