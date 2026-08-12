/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          light: '#FFE0E0',
          dark: '#E85555'
        },
        income: '#4ECDC4',
        expense: '#FF6B6B',
        warning: '#FF922B',
        success: '#51CF66',
        sky: '#6C9BCF',
        lavender: '#A084DC',
        sunshine: '#FFD93D',
        peach: '#FFB5B5',
        ink: {
          DEFAULT: '#2D3436',
          secondary: '#636E72',
          tertiary: '#B2BEC3'
        },
        page: '#F8F9FA',
        card: '#FFFFFF',
        divider: '#F0F0F0'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px'
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.06)',
        fab: '0 4px 16px rgba(255, 107, 107, 0.3)',
        modal: '0 8px 32px rgba(0, 0, 0, 0.12)',
        tabbar: '0 -2px 12px rgba(0, 0, 0, 0.04)'
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};