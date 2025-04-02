/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Microsoft's blue/purple palette for C# branding
        'csharp-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'csharp-purple': {
          50: '#F5F0FF',
          100: '#EBE3FE',
          200: '#D6C7FD',
          300: '#B598FA',
          400: '#9D7BF7',
          500: '#8661C5', // Primary purple
          600: '#7046AB',
          700: '#592F8E',
          800: '#40216A',
          900: '#2B1647',
        },
        'code-bg': '#1E1E1E', // VS Code-like dark background
        'code-text': '#D4D4D4', // VS Code-like text color
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Andale Mono', 'monospace'],
      },
      boxShadow: {
        'inner-code': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            code: {
              color: '#8661C5',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 