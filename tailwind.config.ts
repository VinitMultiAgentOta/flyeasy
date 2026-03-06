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
        brand: {
          primary:    "#004D9F",   // CheapOAir exact blue
          secondary:  "#FF4600",   // CheapOAir exact orange
          accent:     "#00A651",   // green (deals/success)
          dark:       "#001F5B",   // deeper navy for hero bg
          light:      "#E8F0FB",   // soft blue tint
          hover:      "#003F87",   // primary hover
        },
        cta: {
          call:       "#FF4600",   // orange = call CTA (CheapOAir style)
          callHover:  "#B33100",   // dark orange hover
          callLight:  "#FFF2ED",   // light orange bg tint
        },
        surface: {
          DEFAULT:    "#FFFFFF",
          muted:      "#F5F7FA",
          border:     "#DDE3ED",
          dark:       "#EEF2F8",
        },
        text: {
          primary:    "#1A1A2E",
          secondary:  "#4A5568",
          muted:      "#8896A5",
          inverse:    "#FFFFFF",
          orange:     "#FF4600",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Poppins", "Inter", "sans-serif"],
      },
      fontSize: {
        "phone-hero": ["2rem",   { lineHeight: "1.2", fontWeight: "800" }],
        "phone-lg":   ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "phone-md":   ["1.25rem",{ lineHeight: "1.2", fontWeight: "700" }],
      },
      boxShadow: {
        "card":        "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover":  "0 8px 32px rgba(0,87,184,0.15)",
        "cta":         "0 4px 20px rgba(255,107,0,0.35)",
        "header":      "0 2px 20px rgba(0,0,0,0.12)",
      },
      animation: {
        "pulse-slow":   "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "bounce-soft":  "bounce 2s infinite",
        "fade-in-up":   "fadeInUp 0.5s ease-out forwards",
        "marquee":      "marquee 30s linear infinite",
        "ping-slow":    "ping 2s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(135deg, #0A1628 0%, #0057B8 60%, #003d8f 100%)",
        "cta-gradient":    "linear-gradient(90deg, #FF6B00 0%, #FF3B30 100%)",
        "deals-gradient":  "linear-gradient(135deg, #00A651 0%, #007d3e 100%)",
        "card-shimmer":    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
