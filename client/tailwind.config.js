/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0B1220',
        dusk: '#1B2A4A',
        sky: '#EEF2F7',
        paper: '#FFFFFF',
        ink: '#10192B',
        mist: '#5B6B82',
        amber: {
          DEFAULT: '#F5A524',
          soft: '#FBD599'
        },
        teal: {
          DEFAULT: '#2AA9A0',
          soft: '#BFE7E3'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      fontFeatureSettings: {
        tabular: '"tnum"'
      }
    }
  },
  plugins: []
}
