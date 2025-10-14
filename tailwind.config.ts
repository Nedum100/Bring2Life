import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#0D1117',
          gold: '#FFD60A',
          orange: '#FF4D00',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.15)',
        }
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #FFD60A, #FF4D00)',
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
