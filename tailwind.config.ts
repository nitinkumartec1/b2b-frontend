import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E4D8B', light: '#2f6bbd', dark: '#153a6b' },
        secondary: { DEFAULT: '#00BFA6' },
        accent: { DEFAULT: '#F4B400' }
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      boxShadow: { premium: '0 10px 40px -12px rgba(30,77,139,0.25)' },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' }
        }
      },
      animation: {
        'kenburns': 'kenburns 20s ease-in-out infinite alternate'
      }
    }
  },
  plugins: []
};
export default config;
