import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bento / Soft Fintech Palette
        canvas: '#F4F7FA',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#0D9488', // Teal 600
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#F43F5E', // Rose/Coral
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
        },
        // Modern SaaS Accents
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
        },
        coral: {
          50: '#FFF1F2',
          500: '#F43F5E',
        },
        success: {
          DEFAULT: '#10B981', // Emerald
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        muted: '#64748B', // Slate 500
        dark: '#0F172A', // Slate 900

        // Brand aliases for compatibility
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          900: '#134E4A',
        },
        surface: {
          50: '#F8FAFC', // Slate 50
          100: '#F1F5F9', // Slate 100
          200: '#E2E8F0', // Slate 200
          300: '#CBD5E1', // Slate 300
          500: '#64748B', // Slate 500
          900: '#0F172A', // Slate 900
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'bento': '24px',
        'pill': '9999px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'bento': '0 10px 40px -10px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px -5px rgba(67, 83, 255, 0.1)', // tinted soft shadow
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.04)', // Alias for bento
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

export default config
