/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Add this line to enable class-based dark mode
  theme: {
    // Custom breakpoints
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7',
          light: '#38bdf8',
          dark: '#075985',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dark: '#ea580c',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        // Update background colors to support dark mode
        background: {
          primary: '#ffffff',
          secondary: '#f9fafb',
          dark: '#111827',
          // Dark mode variants
          'dark-primary': '#1f2937',
          'dark-secondary': '#111827',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f3f4f6',
          tertiary: '#e5e7eb',
          // Dark mode variants
          'dark': '#1f2937',
          'dark-secondary': '#374151',
          'dark-tertiary': '#4b5563',
        },
        border: {
          light: '#e5e7eb',
          DEFAULT: '#d1d5db',
          dark: '#9ca3af',
          // Dark mode variant
          'dark-mode': '#4b5563',
        },
        text: {
          primary: '#111827',
          secondary: '#4b5563',
          tertiary: '#6b7280',
          light: '#9ca3af',
          inverse: '#ffffff',
          // Dark mode variants
          'dark-primary': '#f9fafb',
          'dark-secondary': '#e5e7eb',
          'dark-tertiary': '#d1d5db',
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        // Dark mode shadow
        'soft-dark': '0 2px 15px -3px rgba(0, 0, 0, 0.4), 0 10px 20px -2px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontSize: {
        'tiny': ['0.625rem', { lineHeight: '0.75rem' }],
        'md': ['0.938rem', { lineHeight: '1.375rem' }],
      },
      height: {
        'header': '4rem',
        'footer': '3.5rem',
      },
      minHeight: {
        'card': '18rem',
        'modal': '24rem',
      },
      zIndex: {
        'modal': 1000,
        'popup': 900,
        'header': 800,
      }
    },
  },
  plugins: [],
}