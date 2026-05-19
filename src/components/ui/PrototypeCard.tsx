import { styled } from "@/theme/stitches.config";

const PrototypeBadge = styled("div", {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "$1",
  borderRadius: "$lg",
  border: "1px solid rgba(255,255,255,0.24)",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)",
  color: "$textInverse",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
  backdropFilter: "blur(10px)",
  letterSpacing: "0.03em",
  userSelect: "none",

  variants: {
    tone: {
      light: {
        color: "$textPrimary",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(248,243,231,0.84) 100%)",
        border: "1px solid rgba(15, 76, 92, 0.14)",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.10)",
      },
      brand: {
        background:
          "linear-gradient(145deg, rgba(15,76,92,0.98) 0%, rgba(19,110,118,0.95) 100%)",
      },
      accent: {
        background:
          "linear-gradient(145deg, rgba(224,159,62,0.98) 0%, rgba(237,137,54,0.92) 100%)",
      },
    },
    size: {
      sm: {
        width: "72px",
        height: "72px",
        fontSize: "$xs",
        padding: "$2",
      },
      md: {
        width: "96px",
        height: "96px",
        fontSize: "$sm",
        padding: "$3",
      },
      lg: {
        width: "128px",
        height: "128px",
        fontSize: "$md",
        padding: "$4",
      },
    },
  },

  defaultVariants: {
    tone: "brand",
    size: "md",
  },
});

const PrototypeLabel = styled("span", {
  fontWeight: "$bold",
  lineHeight: 1,
});

const PrototypeHelper = styled("span", {
  fontSize: "0.62em",
  lineHeight: 1.15,
  textAlign: "center",
  opacity: 0.78,
});

type PrototypeCardProps = {
  label: string;
  helperText?: string;
  tone?: "brand" | "accent" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function PrototypeCard({
  label,
  helperText,
  tone = "brand",
  size = "md",
  className,
}: PrototypeCardProps) {
  return (
    <PrototypeBadge
      className={className}
      tone={tone}
      size={size}
      aria-label={label}
    >
      <PrototypeLabel>{label}</PrototypeLabel>
      {helperText && <PrototypeHelper>{helperText}</PrototypeHelper>}
    </PrototypeBadge>
  );
}