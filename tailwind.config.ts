import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Inter"', '"SF Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          muted: "hsl(var(--destructive-muted))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          muted: "hsl(var(--success-muted))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          muted: "hsl(var(--warning-muted))",
        },
        pending: {
          DEFAULT: "hsl(var(--pending))",
          foreground: "hsl(var(--pending-foreground))",
          muted: "hsl(var(--pending-muted))",
        },
        awaiting: {
          DEFAULT: "hsl(var(--awaiting))",
          foreground: "hsl(var(--awaiting-foreground))",
          muted: "hsl(var(--awaiting-muted))",
        },
        "in-progress": {
          DEFAULT: "hsl(var(--in-progress))",
          foreground: "hsl(var(--in-progress-foreground))",
          muted: "hsl(var(--in-progress-muted))",
        },
        hero: {
          DEFAULT: "hsl(var(--hero))",
          foreground: "hsl(var(--hero-foreground))",
          muted: "hsl(var(--hero-muted))",
        },
        "accent-bright": {
          DEFAULT: "hsl(var(--accent-bright))",
          foreground: "hsl(var(--accent-bright-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'card': '0 2px 8px -2px hsl(220 20% 0% / 0.2)',
        'card-hover': '0 8px 24px -4px hsl(220 20% 0% / 0.3), 0 0 0 1px hsl(217 91% 60% / 0.1)',
        'dropdown': '0 10px 30px -5px hsl(220 20% 0% / 0.35), 0 0 0 1px hsl(220 16% 16% / 0.5)',
        'glow': '0 0 20px hsl(217 91% 60% / 0.15)',
        'glow-lg': '0 0 40px hsl(217 91% 60% / 0.2), 0 0 80px hsl(217 91% 60% / 0.05)',
        'glow-accent': '0 0 20px hsl(25 95% 55% / 0.2)',
        'inner-glow': 'inset 0 1px 0 0 hsl(0 0% 100% / 0.03)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px hsl(217 91% 60% / 0.2)" },
          "50%": { boxShadow: "0 0 20px hsl(217 91% 60% / 0.4)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
