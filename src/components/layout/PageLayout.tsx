import { styled } from "@/theme/stitches.config";

export const PageContent = styled("main", {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
  paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",

  variants: {
    noPadding: {
      true: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      false: {
        paddingTop: "$5",
        paddingLeft: "$5",
        paddingRight: "$5",
      },
    },
    noBottomPad: {
      true: { paddingBottom: 0 },
    },
  },

  defaultVariants: {
    noPadding: false,
  },
});

export const PageShell = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
  flex: 1,
});

export const Section = styled("section", {
  marginBottom: "$6",
  position: "relative",
});

export const SectionTitle = styled("h2", {
  fontSize: "$sm",
  fontWeight: "$bold",
  color: "$textSecondary",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "$3",
});

export const Divider = styled("hr", {
  border: "none",
  borderTop: "1px solid $divider",
  margin: "$4 0",
});

export const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "$12 $6",
  gap: "$4",
  textAlign: "center",
  color: "$textSecondary",
});

export const EmptyStateTitle = styled("h3", {
  fontSize: "$md",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
});

export const EmptyStateText = styled("p", {
  fontSize: "$sm",
  margin: 0,
  lineHeight: 1.6,
});

export const HeroGradient = styled("div", {
  background:
    "linear-gradient(135deg, rgba(16,33,43,0.96) 0%, rgba(15,76,92,0.90) 58%, rgba(224,159,62,0.78) 100%)",
  padding: "$6 $5",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  borderBottom: "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(6px)",

  "&::after": {
    content: "''",
    position: "absolute",
    top: "-40%",
    right: "-20%",
    width: "200px",
    height: "200px",
    background: "rgba(224,159,62,0.18)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
});

export const HeroTitle = styled("h1", {
  fontSize: "$xl",
  fontWeight: "$bold",
  color: "#fff",
  margin: 0,
  marginBottom: "$1",
  lineHeight: 1.2,
  position: "relative",
  zIndex: 1,
});

export const HeroSubtitle = styled("p", {
  fontSize: "$sm",
  color: "rgba(255,255,255,0.8)",
  margin: 0,
  position: "relative",
  zIndex: 1,
});

export const ListItem = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  padding: "$4",
  background:
    "linear-gradient(140deg, rgba(255,255,255,0.90) 0%, rgba(248,250,253,0.78) 100%)",
  borderBottom: "1px solid rgba(0,43,92,0.10)",
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  transition: "background 0.14s ease, transform 0.14s ease",
  "&:last-child": { borderBottom: "none" },
  "&:active": {
    background: "rgba(255,255,255,0.86)",
    transform: "scale(0.995)",
  },
  "&:hover": {
    background:
      "linear-gradient(140deg, rgba(255,255,255,0.96) 0%, rgba(245,249,252,0.86) 100%)",
  },
});

export const Row = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",

  variants: {
    justify: {
      between: { justifyContent: "space-between" },
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
    },
  },
});

export const Col = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});

export const Text = styled("p", {
  margin: 0,

  variants: {
    size: {
      xs: { fontSize: "$xs" },
      sm: { fontSize: "$sm" },
      md: { fontSize: "$md" },
      lg: { fontSize: "$lg" },
    },
    weight: {
      regular: { fontWeight: "$regular" },
      medium: { fontWeight: "$medium" },
      semibold: { fontWeight: "$semibold" },
      bold: { fontWeight: "$bold" },
    },
    color: {
      primary: { color: "$textPrimary" },
      secondary: { color: "$textSecondary" },
      disabled: { color: "$textDisabled" },
      brand: { color: "$primary" },
      gold: { color: "$secondary" },
      inverse: { color: "#fff" },
      error: { color: "$error" },
      success: { color: "$success" },
    },
    align: {
      left: { textAlign: "left" },
      center: { textAlign: "center" },
      right: { textAlign: "right" },
    },
  },

  defaultVariants: {
    size: "md",
    weight: "regular",
    color: "primary",
  },
});

export const Avatar = styled("div", {
  borderRadius: "50%",
  backgroundColor: "$primaryLight",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "$bold",
  fontSize: "$md",
  flexShrink: 0,
  overflow: "hidden",

  variants: {
    size: {
      sm: { width: "36px", height: "36px", fontSize: "$sm" },
      md: { width: "48px", height: "48px" },
      lg: { width: "72px", height: "72px", fontSize: "$lg" },
      xl: { width: "96px", height: "96px", fontSize: "$xl" },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
