import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-rajdhani)", "sans-serif"],
                display: ["var(--font-orbitron)", "sans-serif"],
                mono: ["var(--font-rajdhani)", "monospace"], // Using Rajdhani for mono too as it fits the tech theme
            },
        },
    },
    plugins: [],
} satisfies Config;
