import { globalCss } from "./stitches.config";

export const globalStyles = globalCss({
  "@import":
    'url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Urbanist:wght@400;500;600;700;800&display=swap")',
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
  },
  html: {
    fontSize: "16px",
    scrollBehavior: "smooth",
  },
  "html, body, #root": {
    minHeight: "100%",
  },
  body: {
    minHeight: "100vh",
    fontFamily: "$body",
    color: "$textPrimary",
    backgroundColor: "$bgDefault",
    backgroundImage:
      "radial-gradient(circle at 4% 8%, rgba(224,159,62,0.18) 0%, transparent 32%), radial-gradient(circle at 90% 0%, rgba(15,76,92,0.14) 0%, transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(247,243,234,0.92) 100%)",
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    overscrollBehavior: "none",
  },
  "#root": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    position: "relative",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "$display",
    lineHeight: 1.2,
  },
  a: {
    textDecoration: "none",
    color: "inherit",
  },
  "input, textarea, select": {
    fontFamily: "$body",
    fontSize: "16px",
  },
  button: {
    fontFamily: "$body",
    cursor: "pointer",
    border: "none",
    background: "none",
  },
  "img, svg": {
    maxWidth: "100%",
  },
  ":focus-visible": {
    outline: "2px solid $primary",
    outlineOffset: "2px",
  },
  "::placeholder": {
    color: "$textDisabled",
  },
  "::-webkit-scrollbar": {
    width: "4px",
    height: "4px",
  },
  "::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "::-webkit-scrollbar-thumb": {
    background: "$divider",
    borderRadius: "4px",
  },
});
