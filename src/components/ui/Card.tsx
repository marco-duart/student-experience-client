import { styled } from "@/theme/stitches.config";

export const Card = styled("div", {
  background:
    "linear-gradient(150deg, rgba(255,255,255,0.90) 0%, rgba(248,251,255,0.78) 100%)",
  borderRadius: "$lg",
  overflow: "hidden",
  boxShadow: "0 8px 22px rgba(0,43,92,0.09)",
  border: "1px solid rgba(0,43,92,0.12)",
  backdropFilter: "blur(8px)",

  variants: {
    interactive: {
      true: {
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 28px rgba(0,43,92,0.14)",
        },
        "&:active": {
          transform: "translateY(0) scale(0.98)",
        },
      },
    },
    elevated: {
      true: {
        boxShadow: "0 16px 34px rgba(0,43,92,0.14)",
      },
    },
    flat: {
      true: {
        boxShadow: "none",
        border: "1.5px solid rgba(0,43,92,0.12)",
        background: "rgba(255,255,255,0.82)",
      },
    },
  },
});

export const CardBody = styled("div", {
  padding: "$5",
});

export const CardHeader = styled("div", {
  padding: "$4 $5",
  borderBottom: "1px solid $divider",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$3",
});

export const CardTitle = styled("h3", {
  fontSize: "$md",
  fontWeight: "$bold",
  color: "$textPrimary",
  margin: 0,
});
