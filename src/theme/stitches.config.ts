import { createStitches } from "@stitches/react";

export const { styled, css, globalCss, keyframes, config, getCssText } =
  createStitches({
    theme: {
      colors: {
        primary: "#0F4C5C",
        primaryLight: "#2A7D8C",
        primaryDark: "#08323D",
        primaryContrast: "#FFFFFF",

        secondary: "#E09F3E",
        secondaryLight: "#F3BC6A",
        secondaryDark: "#B86C12",
        secondaryContrast: "#1B1B1B",

        bgDefault: "#F7F3EA",
        bgPaper: "#FFFDF8",
        bgDark: "#10212B",

        textPrimary: "#1E293B",
        textSecondary: "#556070",
        textDisabled: "#A4AEBB",
        textInverse: "#FFFFFF",

        success: "#2F855A",
        successBg: "#DCF5E7",
        error: "#C2410C",
        errorBg: "#FDE7D9",
        warning: "#CA8A04",
        warningBg: "#FEF3C7",
        info: "#0E7490",
        infoBg: "#D8F3F8",

        divider: "rgba(15, 76, 92, 0.12)",

        coachMain: "#E09F3E",
        coachLight: "#F3BC6A",
        coachDark: "#B86C12",
        coachText: "#2B1F0C",

        coacheeMain: "#0F4C5C",
        coacheeLight: "#8CCED8",
        coacheeDark: "#08323D",
        coacheeText: "#06232B",

        customerMain: "#1E293B",
        customerLight: "#556070",
        customerDark: "#0F172A",
        customerText: "#FFFDF8",
      },
      fonts: {
        display: '"Fraunces", "Georgia", serif',
        body: '"Urbanist", "Inter", sans-serif',
        mono: '"IBM Plex Mono", Menlo, monospace',
      },
      fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.5rem",
        xxl: "2.1rem",
      },
      fontWeights: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      space: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
      },
      radii: {
        sm: "8px",
        md: "14px",
        lg: "22px",
        pill: "999px",
      },
      shadows: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.09)",
        medium: "0 14px 30px rgba(15, 23, 42, 0.16)",
      },
    },
    media: {
      sm: "(min-width: 540px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1080px)",
    },
  });
