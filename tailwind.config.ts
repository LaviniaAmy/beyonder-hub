import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      /* ── Typography ─────────────────────────────────── */
      fontFamily: {
        sans: ["'Outfit'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Jost'", "system-ui", "-apple-system", "sans-serif"],
      },

      /* ── Colour tokens (all map to CSS vars in index.css) */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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

        /* Navy scale */
        navy: {
          900: "hsl(var(--navy-900))" /* #061828 */,
          800: "hsl(var(--navy-800))" /* #0d2035 */,
          700: "hsl(var(--navy-700))" /* #112438 */,
          600: "hsl(var(--navy-600))" /* #182f44 */,
          500: "hsl(var(--navy-500))" /* #27455a */,
        },

        /* Teal scale */
        teal: {
          600: "hsl(var(--teal-600))" /* #1f5e50 */,
          500: "hsl(var(--teal-500))" /* #2a7a6a */,
          400: "hsl(var(--teal-400))" /* #3a9a88 */,
          300: "hsl(var(--teal-300))" /* #5ebdad */,
          100: "hsl(var(--teal-100))" /* #eaf4f0 sage */,
        },

        /* Orange */
        orange: {
          500: "hsl(var(--orange-500))" /* #e8622a */,
          400: "hsl(var(--orange-400))" /* #f07840 */,
          300: "hsl(var(--orange-300))" /* #f5a06a */,
        },

        /* Beyonder named tokens */
        beyonder: {
          navy: "hsl(var(--beyonder-navy))",
          "navy-mid": "hsl(var(--beyonder-navy-mid))",
          teal: "hsl(var(--beyonder-teal))",
          "teal-light": "hsl(var(--beyonder-teal-light))",
          cream: "hsl(var(--beyonder-cream))",
          "cream-dark": "hsl(var(--beyonder-cream-dark))",
          sage: "hsl(var(--beyonder-sage))",
          orange: "hsl(var(--beyonder-orange))",
        },

        /* Sidebar */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* ── Border radius ──────────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      /* ── Spacing extras ─────────────────────────────── */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      /* ── Animations ─────────────────────────────────── */
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
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
