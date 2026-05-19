import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { styled } from "@/theme/stitches.config";

const AUTO_BACK_ROUTES = new Set([
  "/app/courses",
  "/app/messages",
  "/app/notifications",
  "/app/profile",
  "/app/talks",
  "/app/call-consultant",
  "/app/shop",
  "/app/tools",
  "/app/coach/coachees",
  "/app/coachee/coaches",
  "/app/customer/classrooms",
  "/app/customer/orders",
]);

const HeaderBar = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$4 $5",
  background:
    "linear-gradient(120deg, rgba(16,33,43,0.96) 0%, rgba(15,76,92,0.90) 55%, rgba(224,159,62,0.72) 100%)",
  color: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 50,
  minHeight: "60px",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.18)",

  variants: {
    transparent: {
      true: {
        background: "transparent",
        color: "$textPrimary",
        boxShadow: "none",
        borderBottom: "none",
        backdropFilter: "none",
        position: "static",
      },
    },
  },
});

const BackButton = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "$md",
  background: "rgba(255,255,255,0.18)",
  border: "none",
  borderColor: "rgba(255,255,255,0.28)",
  borderStyle: "solid",
  borderWidth: "1px",
  color: "inherit",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background 0.15s ease",
  "&:active": { background: "rgba(255,255,255,0.25)" },

  variants: {
    dark: {
      true: {
        background: "rgba(15,76,92,0.08)",
        borderColor: "rgba(15,76,92,0.14)",
        color: "$primary",
        "&:active": { background: "rgba(15,76,92,0.15)" },
      },
    },
  },
});

const TitleGroup = styled("div", {
  flex: 1,
  minWidth: 0,
});

const Title = styled("h1", {
  fontSize: "$md",
  fontWeight: "$bold",
  color: "inherit",
  lineHeight: 1.2,
  margin: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const Subtitle = styled("p", {
  fontSize: "$xs",
  color: "rgba(255,255,255,0.75)",
  margin: 0,
  marginTop: "2px",
  lineHeight: 1.2,
});

const RightSlot = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  flexShrink: 0,
});

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  showBack,
  onBack,
  right,
  transparent,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, "") || "/";
  const shouldShowBack =
    showBack ?? AUTO_BACK_ROUTES.has(normalizedPath);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <HeaderBar transparent={transparent}>
      {shouldShowBack && (
        <BackButton dark={transparent} onClick={handleBack} aria-label="Voltar">
          <ArrowLeft size={20} />
        </BackButton>
      )}
      <TitleGroup>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleGroup>
      {right && <RightSlot>{right}</RightSlot>}
    </HeaderBar>
  );
}
