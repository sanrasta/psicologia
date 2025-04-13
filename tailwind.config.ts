import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	container: {
		center: true,
		padding: "2rem",
		screens: {
			lg: "1100px",
			xl: "1100px",
			"2xl": "1400px",
		},
	},
  	extend: {
  		colors: {
  			background: '#F8F0FF',
  			foreground: '#2E2E2E',
  			card: {
  				DEFAULT: '#F8F0FF',
  				foreground: '#2E2E2E'
  			},
  			popover: {
  				DEFAULT: '#F8F0FF',
  				foreground: '#2E2E2E'
  			},
  			primary: {
  				DEFAULT: '#9B5DE5',
  				foreground: '#2E2E2E'
  			},
  			secondary: {
  				DEFAULT: '#F15BB5',
  				foreground: '#2E2E2E'
  			},
  			muted: {
  				DEFAULT: '#F8F0FF',
  				foreground: '#2E2E2E'
  			},
  			accent: {
  				DEFAULT: '#F15BB5',
  				foreground: '#2E2E2E'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#F8F0FF'
  			},
  			border: '#F8F0FF',
  			input: '#F8F0FF',
  			ring: '#9B5DE5'
  		},
  		borderRadius: {
  			lg: '0.5rem',
  			md: '0.375rem',
  			sm: '0.25rem'
  		},
      dropShadow: {
        'glow-red': '0 0 8px rgba(239, 68, 68, 0.6)',
        'glow-blue': '0 0 8px rgba(59, 130, 246, 0.6)',
        'glow-green': '0 0 8px rgba(34, 197, 94, 0.6)',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
