import { useMemo } from "react";
import { styled, keyframes } from "@/theme/stitches.config";
import { PrototypeCard } from "@/components/ui/PrototypeCard";
import { LIFE_PHRASES } from "@/constants/life-phrases";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

const SpinnerRing = styled("div", {
  borderRadius: "50%",
  borderStyle: "solid",
  borderColor: "transparent",
  animation: `${spin} 0.7s linear infinite`,

  variants: {
    size: {
      sm: { width: 16, height: 16, borderWidth: 2 },
      md: { width: 24, height: 24, borderWidth: 3 },
      lg: { width: 40, height: 40, borderWidth: 4 },
    },
    color: {
      primary: { borderTopColor: "$primary" },
      white: { borderTopColor: "#ffffff" },
      gold: { borderTopColor: "$secondary" },
    },
  },

  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 0.95 },
  "50%": { transform: "scale(1.06)", opacity: 1 },
});

const SpinnerWrap = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "$3",

  variants: {
    fullScreen: {
      true: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      },
    },
    inline: {
      true: { display: "inline-flex" },
    },
  },
});

const SpinnerLabel = styled("span", {
  fontSize: "$sm",
  color: "$textSecondary",
  fontWeight: "$medium",
});

const FullScreenBackdrop = styled("div", {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "$4",
  background:
    "radial-gradient(circle at 20% 20%, rgba(224,159,62,0.28) 0%, rgba(224,159,62,0) 36%), linear-gradient(150deg, rgba(16,33,43,0.96) 0%, rgba(15,76,92,0.94) 55%, rgba(10,40,51,0.98) 100%)",
  backdropFilter: "blur(4px)",

  "@md": {
    padding: "$5",
  },
});

const FullScreenCard = styled("div", {
  width: "100%",
  maxWidth: "640px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.16)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
  boxShadow: "0 18px 44px rgba(0,0,0,0.30)",
  padding: "$5",
  textAlign: "center",

  "@md": {
    borderRadius: "24px",
    padding: "$6",
  },
});

const FullScreenRing = styled(SpinnerRing, {
  position: "relative",
  width: 54,
  height: 54,
  borderWidth: 4,
  borderTopColor: "$secondary",
  marginBottom: "$4",
  animation: `${spin} 0.9s linear infinite`,
});

const FullScreenRingPulse = styled("span", {
  position: "absolute",
  inset: -6,
  borderRadius: "999px",
  border: "2px solid rgba(197,160,89,0.55)",
  animation: `${pulse} 1.8s ease-in-out infinite`,
  pointerEvents: "none",
});

const LoadingHint = styled("p", {
  margin: 0,
  marginBottom: "$3",
  color: "rgba(255,255,255,0.8)",
  fontSize: "$xs",
  fontWeight: "$medium",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const Phrase = styled("p", {
  margin: 0,
  color: "#FFFFFF",
  fontSize: "$md",
  lineHeight: 1.35,
  fontWeight: "$semibold",
  textWrap: "balance",

  "@sm": {
    fontSize: "$lg",
  },
});

const SubLabel = styled("p", {
  margin: 0,
  marginTop: "$4",
  color: "rgba(255,255,255,0.74)",
  fontSize: "$sm",
  lineHeight: 1.4,
});

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gold";
  fullScreen?: boolean;
  inline?: boolean;
  label?: string;
};

export function Spinner({
  size = "md",
  color = "primary",
  fullScreen,
  inline,
  label,
}: SpinnerProps) {
  const randomPhrase = useMemo(() => {
    if (LIFE_PHRASES.length === 0) return "Aprender com consistencia.";
    const index = Math.floor(Math.random() * LIFE_PHRASES.length);
    return LIFE_PHRASES[index] ?? "Aprender com consistencia.";
  }, []);

  if (fullScreen) {
    return (
      <FullScreenBackdrop>
        <FullScreenCard>
          <SpinnerWrap>
            <PrototypeCard label="logo" tone="light" size="sm" />
            <FullScreenRing size="lg" color="gold">
              <FullScreenRingPulse />
            </FullScreenRing>
            <LoadingHint>Protótipo em movimento</LoadingHint>
            <Phrase>{randomPhrase}</Phrase>
            {label && <SubLabel>{label}</SubLabel>}
          </SpinnerWrap>
        </FullScreenCard>
      </FullScreenBackdrop>
    );
  }

  return (
    <SpinnerWrap fullScreen={fullScreen} inline={inline}>
      <SpinnerRing size={size} color={color} />
      {label && <SpinnerLabel>{label}</SpinnerLabel>}
    </SpinnerWrap>
  );
}
