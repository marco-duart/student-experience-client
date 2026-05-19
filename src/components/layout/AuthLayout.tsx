import { Navigate, Outlet } from "react-router-dom";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/Spinner";
import { PrototypeCard } from "@/components/ui/PrototypeCard";

const Shell = styled("div", {
  minHeight: "100%",
  display: "grid",
  gridTemplateColumns: "1fr",
  backgroundColor: "$bgDefault",
  padding: "$4",

  "@md": {
    gridTemplateColumns: "minmax(260px, 380px) minmax(360px, 520px)",
    justifyContent: "center",
    gap: "$6",
    padding: "$6",
    alignItems: "stretch",
  },
});

const TopBand = styled("div", {
  background:
    "linear-gradient(135deg, rgba(16,33,43,0.98) 0%, rgba(15,76,92,0.94) 58%, rgba(224,159,62,0.82) 100%)",
  padding: "$8 $6 $8",
  minHeight: "clamp(260px, 40vh, 340px)",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: "''",
    position: "absolute",
    bottom: "-50px",
    right: "-30px",
    width: "160px",
    height: "160px",
    background: "rgba(197,160,89,0.18)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  "&::after": {
    content: "''",
    position: "absolute",
    top: "-30px",
    left: "-50px",
    width: "130px",
    height: "130px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "50%",
    pointerEvents: "none",
  },

  "@md": {
    borderRadius: "$lg",
    padding: "$8",
    boxShadow: "0 24px 56px rgba(15,23,42,0.22)",
  },
});

const LogoArea = styled("div", {
  position: "relative",
  zIndex: 4,
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});

const BrandName = styled("h1", {
  fontSize: "$xxl",
  fontWeight: "$bold",
  color: "#fff",
  margin: 0,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
});

// const BrandSub = styled("p", {
//   fontSize: "$sm",
//   color: "rgba(255,255,255,0.75)",
//   margin: 0,
//   maxWidth: "72%",

//   "@md": {
//     maxWidth: "100%",
//   },
// });

const GoldAccent = styled("span", {
  color: "$secondaryLight",
});

const IntroCard = styled("div", {
  position: "relative",
  zIndex: 3,
  marginTop: "$6",
  padding: "$4",
  borderRadius: "$lg",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(10px)",
  color: "rgba(255,255,255,0.88)",
});

const IntroTitle = styled("p", {
  margin: 0,
  fontSize: "$sm",
  fontWeight: "$bold",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

const IntroText = styled("p", {
  margin: 0,
  marginTop: "$2",
  fontSize: "$sm",
  lineHeight: 1.55,
});

const FormCard = styled("div", {
  flex: 1,
  backgroundColor: "$bgPaper",
  borderRadius: "24px",
  marginTop: "-20px",
  padding: "$6 $5 $8",
  position: "relative",
  zIndex: 2,
  boxShadow: "0 -8px 30px rgba(15,23,42,0.08)",

  "@md": {
    marginTop: 0,
    borderRadius: "$lg",
    boxShadow: "0 24px 56px rgba(15,23,42,0.14)",
    border: "1px solid rgba(15,76,92,0.10)",
  },
});

export function AuthLayout() {
  const { isBooting, isAuthenticated } = useAuth();

  if (isBooting) return <Spinner fullScreen label="Carregando..." />;
  if (isAuthenticated) return <Navigate to="/app/home" replace />;

  return (
    <Shell>
      <TopBand>
        <LogoArea>
          <PrototypeCard label="logo" tone="light" size="md" />
          <BrandName>
            <GoldAccent>Protótipo</GoldAccent>
          </BrandName>
          <GoldAccent>Vitrine educacional e comercial.</GoldAccent>
        </LogoArea>
        <IntroCard>
          <IntroTitle>Experiência demonstrativa</IntroTitle>
          <IntroText>
            O fluxo abaixo funciona como se fosse real, mas todas as respostas,
            listas e ações são simuladas para apresentação.
          </IntroText>
        </IntroCard>
      </TopBand>
      <FormCard>
        <Outlet />
      </FormCard>
    </Shell>
  );
}
