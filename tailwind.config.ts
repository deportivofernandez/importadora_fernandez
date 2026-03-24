import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        // Garantiza que clases navy y white con opacidad se generen
        { pattern: /bg-navy-(600|700|800|900)/ },
        { pattern: /text-navy-(600|700|800)/ },
        { pattern: /border-navy-(600|700|800)/ },
        { pattern: /bg-white\/(5|10|15|20|25|30)/ },
        { pattern: /border-white\/(10|15|20|25)/ },
        { pattern: /text-white\/(30|40|50|60|70|80)/ },
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Paleta Importadora Fernández — Azul Marino + Negro + Blanco
                'navy': {
                    50:  '#E8ECF2',
                    100: '#C5CEDC',
                    200: '#9AADC4',
                    300: '#6F8BAC',
                    400: '#4D6F95',
                    500: '#2B537E',
                    600: '#1B2436',
                    700: '#141B29',
                    800: '#0D121C',
                    900: '#07090E',
                },
                'brand': {
                    black:  '#0D0D0D',
                    dark:   '#000000',
                    white:  '#FFFFFF',
                    pearl:  '#F5F5F7',
                    silver: '#9CA3AF',
                },
            },
            fontFamily: {
                // Inter se maneja via next/font/google en layout.tsx
            },
            opacity: {
                '8': '0.08',
                '12': '0.12',
                '15': '0.15',
            },
        },
    },
    plugins: [],
};
export default config;
