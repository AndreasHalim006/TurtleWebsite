/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary: Black (team logo)
        primary: "#0a0a0a",
        "primary-light": "#1a1a1a",
        "primary-dark": "#000000",
        
        // Secondary: Orange (Protergia brand color - main sponsor)
        secondary: "#f7941d",
        "secondary-light": "#ffaa33",
        "secondary-dark": "#e07a0a",
        "secondary-container": "#c47515",
        "on-secondary-container": "#fff5e6",
        
        // Tertiary: Cyan (electric/autonomous tech)
        tertiary: "#00d4ff",
        "tertiary-light": "#33ddff",
        "tertiary-dark": "#00b8e6",
        "tertiary-container": "#000c11",
        
        // Surface colors (dark theme)
        surface: "#131313",
        "surface-container": "#1f2020",
        "surface-container-low": "#1b1c1c",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "surface-bright": "#393939",
        "surface-dim": "#131313",
        "surface-variant": "#353535",
        
        // Text colors
        "on-surface": "#e4e2e1",
        "on-surface-variant": "#c4c7c7",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary": "#003642",
        
        // Outline
        outline: "#8e9192",
        "outline-variant": "#444748",
        
        // Background
        background: "#131313",
        "on-background": "#e4e2e1",
        
        // Error
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        
        // Inverse
        "inverse-surface": "#e4e2e1",
        "inverse-on-surface": "#303030",
        "inverse-primary": "#5f5e5e",
        
        // Fixed variants
        "primary-fixed": "#e5e2e1",
        "primary-fixed-dim": "#c9c6c5",
        "on-primary-fixed": "#1c1b1b",
        "on-primary-fixed-variant": "#474646",
        "secondary-fixed": "#ffdbd0",
        "secondary-fixed-dim": "#ffb59d",
        "on-secondary-fixed": "#390c00",
        "on-secondary-fixed-variant": "#832600",
        "tertiary-fixed": "#b4ebff",
        "tertiary-fixed-dim": "#3cd7ff",
        "on-tertiary-fixed": "#001f27",
        "on-tertiary-fixed-variant": "#004e5f",
        
        // Sponsor tier colors
        gold: "#ffd700",
        silver: "#c0c0c0",
        bronze: "#cd7f32",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
