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
                // Paleta Importadora Fernández — Opción C: Azul Cielo & Naranja
                'navy': {
                    50:  '#F0F9FF',  // fondo principal (azul muy claro)
                    100: '#E0F2FE',  // fondo hover
                    200: '#BAE6FD',  // bordes claros
                    300: '#7DD3FC',  // acento claro
                    400: '#38BDF8',  // celeste brillante
                    500: '#0EA5E9',  // azul cielo medio
                    600: '#0284C7',  // azul cielo principal (navbar, hero)
                    700: '#0369A1',  // azul cielo oscuro (hover)
                    800: '#075985',  // azul profundo (cards)
                    900: '#0C4A6E',  // azul más oscuro (footer)
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
