import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  ShoppingBag,
  GraduationCap,
  Headphones,
  BookOpen,
  Bell,
  User,
  Wrench,
  Users,
  UserCheck,
  Link as LinkIcon,
  FileText,
  Mic,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { FaGlobe, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { useRoleTheme } from "@/hooks/use-role-theme";
import { PageContent } from "@/components/layout/PageLayout";
import { marketingCarouselSlides } from "@/constants/marketing-carousel";
import { PrototypeCard } from "@/components/ui/PrototypeCard";

type MenuCard = {
  label: string;
  icon: LucideIcon;
  path: string;
  comingSoon?: boolean;
};

type FeaturedItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

type SocialLinkItem = {
  label: string;
  icon: IconType;
  url: string;
  tone: "site" | "instagram" | "facebook" | "youtube";
};

const Section = styled("section", {
  padding: "$4",

  "@md": {
    padding: "$5",
  },
});

const SectionTitle = styled("h2", {
  margin: 0,
  marginBottom: "$4",
  fontSize: "$md",
  color: "$textPrimary",
  fontWeight: "$bold",
  letterSpacing: "-0.01em",
});

const IntroCard = styled("section", {
  margin: "0 $4 $4",
  padding: "$4",
  borderRadius: "$lg",
  background:
    "linear-gradient(145deg, rgba(16,33,43,0.98) 0%, rgba(15,76,92,0.94) 58%, rgba(224,159,62,0.88) 100%)",
  color: "#fff",
  boxShadow: "0 16px 34px rgba(15,23,42,0.18)",
  position: "relative",
  overflow: "hidden",

  "@md": {
    margin: "0 $5 $5",
    padding: "$5",
  },
});

const IntroHeadline = styled("h2", {
  margin: 0,
  fontSize: "$lg",
  lineHeight: 1.05,
  fontWeight: "$bold",
  maxWidth: "16ch",

  "@sm": {
    fontSize: "$xl",
  },
});

const IntroText = styled("p", {
  margin: 0,
  marginTop: "$3",
  maxWidth: "42ch",
  color: "rgba(255,255,255,0.88)",
  fontSize: "$xs",
  lineHeight: 1.55,

  "@sm": {
    fontSize: "$sm",
  },
});

const MetricsRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "$2",
  marginTop: "$4",

  "@sm": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
});

const MetricCard = styled("div", {
  borderRadius: "$md",
  padding: "$3",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(8px)",
});

const MetricValue = styled("div", {
  fontSize: "$lg",
  fontWeight: "$bold",
  lineHeight: 1,
});

const MetricLabel = styled("div", {
  marginTop: "$1",
  fontSize: "$xs",
  color: "rgba(255,255,255,0.78)",
});

const Header = styled("header", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3 $4",

  "@md": {
    padding: "$4 $5",
  },
});

const AvatarWrap = styled("div", {
  width: "44px",
  height: "44px",
  borderRadius: "16px",
  border: "1px solid $divider",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontWeight: "$bold",
});

const HeaderText = styled("div", {
  flex: 1,
  minWidth: 0,
});

const Greeting = styled("p", {
  margin: 0,
  fontSize: "$md",
  fontWeight: "$bold",
  color: "$textPrimary",
});

const GreetingSub = styled("p", {
  margin: 0,
  fontSize: "$xs",
  fontWeight: "$semibold",
  color: "$textSecondary",
});

const HeaderLogo = styled("img", {
  width: "82px",
  height: "32px",
  objectFit: "contain",
});

const FeaturedRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  alignItems: "start",
  gap: "$3",
  marginBottom: "$4",
});

const FeaturedCard = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$3",
  width: "100%",
  background: "transparent",
  border: "none",
  padding: 0,
  minHeight: "auto",
  cursor: "pointer",
  transition: "transform 0.12s ease, opacity 0.12s ease",

  "&:active": {
    transform: "scale(0.98)",
    opacity: 0.9,
  },
});

const FeaturedArt = styled("div", {
  width: "66px",
  height: "66px",
  borderRadius: "33px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#FFE0B2",
  boxShadow: "0 8px 14px rgba(0,0,0,0.10)",
  overflow: "hidden",
  position: "relative",

  "&::after": {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.30)",
  },

  "@sm": {
    width: "80px",
    height: "80px",
    borderRadius: "40px",
  },
});

const FeaturedLabel = styled("span", {
  fontSize: "$xs",
  lineHeight: 1.2,
  fontWeight: "$semibold",
  color: "$textPrimary",
  textAlign: "center",
  maxWidth: "94px",

  "@sm": {
    fontSize: "13px",
  },
});

const ClientPanel = styled("section", {
  margin: "0 $4 $4",
  border: "1px solid $divider",
  borderRadius: "24px",
  backgroundColor: "$bgPaper",
  boxShadow: "0 10px 24px rgba(0,43,92,0.10)",
  padding: "$4",
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(8px)",

  "@md": {
    margin: "0 $5 $5",
  },

  "&::before": {
    content: "''",
    position: "absolute",
    top: "-45%",
    right: "-20%",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 68%)",
    pointerEvents: "none",
  },

  variants: {
    roleTone: {
      customer: {
        borderColor: "rgba(30,136,229,0.30)",
        background:
          "linear-gradient(160deg, rgba(30,136,229,0.10) 0%, rgba(21,101,192,0.06) 50%, rgba(255,255,255,0.82) 100%)",
      },
      coachee: {
        borderColor: "rgba(13,71,161,0.34)",
        background:
          "linear-gradient(160deg, rgba(13,71,161,0.12) 0%, rgba(10,55,130,0.07) 50%, rgba(255,255,255,0.84) 100%)",
      },
      coach: {
        borderColor: "rgba(210,138,0,0.36)",
        background:
          "linear-gradient(160deg, rgba(245,167,10,0.14) 0%, rgba(210,138,0,0.08) 50%, rgba(255,255,255,0.86) 100%)",
      },
    },
  },
});

const MarketingPanel = styled("section", {
  margin: "0 $4 $4",
  border: "1px solid $divider",
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  minHeight: "210px",
  boxShadow: "0 12px 26px rgba(15,23,42,0.16)",
  background:
    "linear-gradient(160deg, rgba(16,33,43,0.98) 0%, rgba(15,76,92,0.96) 55%, rgba(224,159,62,0.84) 100%)",

  "@sm": {
    margin: "0 $5 $5",
  },

  "@md": {
    minHeight: "280px",
  },

  "@lg": {
    minHeight: "340px",
  },
});

const MarketingTrack = styled("div", {
  display: "flex",
  width: "100%",
  height: "100%",
  transition: "transform 0.55s ease",
  willChange: "transform",
});

const MarketingSlide = styled("article", {
  position: "relative",
  minWidth: "100%",
  height: "210px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "$5",
  color: "#fff",

  "@md": {
    height: "280px",
  },

  "@lg": {
    height: "340px",
  },
});

const MarketingBackdrop = styled("div", {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.14) 0%, transparent 24%), radial-gradient(circle at 86% 14%, rgba(255,255,255,0.12) 0%, transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.08) 100%)",
  pointerEvents: "none",
});

const MarketingEyebrow = styled("p", {
  margin: 0,
  fontSize: "$xs",
  fontWeight: "$bold",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.74)",
});

const MarketingTitle = styled("h3", {
  margin: 0,
  fontSize: "$lg",
  fontWeight: "$bold",
  lineHeight: 1.1,
  maxWidth: "18ch",
  textWrap: "balance",

  "@md": {
    fontSize: "$xl",
  },
});

const MarketingCaption = styled("p", {
  margin: 0,
  maxWidth: "42ch",
  fontSize: "$xs",
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.88)",

  "@md": {
    fontSize: "$sm",
  },
});

const MarketingDots = styled("div", {
  position: "absolute",
  zIndex: 2,
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "$2",
  display: "flex",
  alignItems: "center",
  gap: "$2",
});

const MarketingDot = styled("span", {
  width: "7px",
  height: "7px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.5)",
  transition: "width 0.2s ease, background-color 0.2s ease",

  variants: {
    active: {
      true: {
        width: "18px",
        backgroundColor: "#fff",
      },
    },
  },
});

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$2",

  "@sm": {
    gridTemplateColumns: "1fr 1fr",
  },

  "@md": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },

  "@lg": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
});

const MenuCardItem = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "$2",
  padding: "$4",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  position: "relative",
  overflow: "hidden",
  textAlign: "left",
  minHeight: "96px",

  "&:active": {
    transform: "scale(0.96)",
  },

  variants: {
    roleTone: {
      customer: {
        background: "#1976D2",
        boxShadow:
          "0 8px 18px rgba(25,118,210,0.42), 0 2px 6px rgba(25,118,210,0.22)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 12px 24px rgba(25,118,210,0.52), 0 4px 8px rgba(25,118,210,0.26)",
        },
      },
      coachee: {
        background: "#0D47A1",
        boxShadow:
          "0 8px 18px rgba(13,71,161,0.48), 0 2px 6px rgba(13,71,161,0.26)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 12px 24px rgba(13,71,161,0.58), 0 4px 8px rgba(13,71,161,0.30)",
        },
      },
      coach: {
        background: "#F5A70A",
        boxShadow:
          "0 8px 18px rgba(210,138,0,0.44), 0 2px 6px rgba(210,138,0,0.24)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 12px 24px rgba(210,138,0,0.54), 0 4px 8px rgba(210,138,0,0.28)",
        },
      },
    },
    comingSoon: {
      true: {
        opacity: 0.55,
        cursor: "not-allowed",
        "&:hover": { transform: "none" },
        "&:active": { transform: "none" },
      },
    },
  },
});

const CardLabel = styled("span", {
  fontSize: "13px",
  fontWeight: "$bold",
  color: "#FFFFFF",
  lineHeight: 1.3,
  textAlign: "left",
});

const ComingSoonBadge = styled("span", {
  position: "absolute",
  top: "8px",
  right: "8px",
  fontSize: "9px",
  fontWeight: "$bold",
  color: "#fff",
  backgroundColor: "$secondary",
  borderRadius: "$pill",
  padding: "2px 6px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

const SocialSection = styled("div", {
  marginTop: "$4",
  paddingTop: "$4",
  borderTop: "1px solid rgba(0,43,92,0.12)",
  position: "relative",
  zIndex: 1,
});

const SocialTitle = styled("p", {
  margin: 0,
  marginBottom: "$3",
  fontSize: "$xs",
  fontWeight: "$bold",
  color: "$textSecondary",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const SocialLinksRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$2",

  "@sm": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@md": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
});

const SocialLinkCard = styled("a", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$2",
  textDecoration: "none",
  borderRadius: "14px",
  minHeight: "50px",
  border: "1px solid rgba(255,255,255,0.26)",
  color: "#fff",
  transition: "transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease",
  position: "relative",
  overflow: "hidden",

  "&::after": {
    content: "''",
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(140deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)",
    pointerEvents: "none",
  },

  "&:hover": {
    transform: "translateY(-2px)",
    filter: "saturate(1.08)",
  },

  "&:active": {
    transform: "scale(0.98)",
  },

  variants: {
    tone: {
      site: {
        background: "linear-gradient(135deg, #0F4C5C 0%, #2A7D8C 100%)",
        boxShadow: "0 8px 18px rgba(15,76,92,0.30)",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(15,76,92,0.42)",
        },
      },
      instagram: {
        background:
          "linear-gradient(135deg, #E09F3E 0%, #F3BC6A 100%)",
        boxShadow: "0 8px 18px rgba(224,159,62,0.30)",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(224,159,62,0.42)",
        },
      },
      facebook: {
        background: "linear-gradient(135deg, #10212B 0%, #556070 100%)",
        boxShadow: "0 8px 18px rgba(16,33,43,0.30)",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(16,33,43,0.42)",
        },
      },
      youtube: {
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.30)",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(15,23,42,0.42)",
        },
      },
    },
  },
});

const SocialIconBadge = styled("span", {
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.34)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
  backdropFilter: "blur(2px)",
});

const SocialLabel = styled("span", {
  fontSize: "$xs",
  fontWeight: "$bold",
  color: "inherit",
  letterSpacing: "0.01em",
});

export default function HomePage() {
  const { user, role } = useAuth();
  const theme = useRoleTheme();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(() => marketingCarouselSlides, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [slides]);

  if (!role || !user) return null;

  const roleTone =
    role === "coach" ? "coach" : role === "coachee" ? "coachee" : "customer";

  const socialLinks: SocialLinkItem[] = [
    { label: "Catálogo", icon: FaGlobe, url: "/#/app/courses", tone: "site" },
    { label: "Aprendizado", icon: FaInstagram, url: "/#/app/free-materials", tone: "instagram" },
    { label: "Frases", icon: FaFacebookF, url: "/#/app/jrm", tone: "facebook" },
    { label: "Palestras", icon: FaYoutube, url: "/#/app/talks", tone: "youtube" },
  ];

  const featured: FeaturedItem[] = [
    {
      label: "Frases da vida",
      icon: UserRound,
      path: "/app/jrm",
    },
    {
      label: "Palestras",
      icon: Mic,
      path: "/app/talks",
    },
    {
      label: "Materiais Gratuitos",
      icon: FileText,
      path: "/app/free-materials",
    },
  ];

  let cards: MenuCard[] = [
    { label: "Pedidos", icon: Receipt, path: "/app/customer/orders" },
    { label: "Catálogo", icon: ShoppingBag, path: "/app/shop" },
    {
      label: "Turmas",
      icon: GraduationCap,
      path: "/app/customer/classrooms",
    },
    {
      label: "Contato",
      icon: Headphones,
      path: "/app/call-consultant",
    },
    { label: "Cursos", icon: BookOpen, path: "/app/courses" },
    { label: "Alertas", icon: Bell, path: "/app/notifications" },
    { label: "Perfil", icon: User, path: "/app/profile" },
    { label: "Vincular Mentoria", icon: LinkIcon, path: "#", comingSoon: true },
  ];

  if (role === "coachee" || role === "coach") {
    cards = [
      ...cards,
      { label: "Meu Coach", icon: UserCheck, path: "/app/coachee/coaches" },
    ];
  }

  if (role === "coach") {
    cards = [
      { label: "Ferramentas", icon: Wrench, path: "/app/tools" },
      ...cards,
      { label: "Meus Coachees", icon: Users, path: "/app/coach/coachees" },
    ];
  }

  return (
    <>
      <Header>
        <AvatarWrap
          css={{
            backgroundColor: theme.roleAccent.light,
            color: theme.roleAccent.roleText,
            borderColor: theme.palette.divider,
          }}
        >
          {user.name.slice(0, 1).toUpperCase()}
        </AvatarWrap>
        <HeaderText>
          <Greeting>Olá, {user.name.split(" ")[0]}</Greeting>
          <GreetingSub>Bem-vindo de volta</GreetingSub>
        </HeaderText>
        <PrototypeCard label="logo" tone="light" size="sm" />
      </Header>

      <PageContent
        noPadding
        css={{
          paddingBottom: "calc(92px + env(safe-area-inset-bottom, 0px))",
          "@md": {
            paddingBottom: "$4",
          },
        }}
      >
        <IntroCard>
          <PrototypeCard label="logo" tone="light" size="sm" />
          <IntroHeadline>Uma vitrine pronta para apresentar, vender e demonstrar.</IntroHeadline>
          <IntroText>
            Este painel simula um produto digital completo: catálogo, módulos,
            mensagens, notificações, ferramentas e conteúdo didático acessíveis
            sem backend real.
          </IntroText>
          <MetricsRow>
            <MetricCard>
              <MetricValue>{cards.length}</MetricValue>
              <MetricLabel>Atalhos disponíveis</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{slides.length}</MetricValue>
              <MetricLabel>Blocos de vitrine</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{featured.length}</MetricValue>
              <MetricLabel>Entradas rápidas</MetricLabel>
            </MetricCard>
          </MetricsRow>
        </IntroCard>

        <Section>
          <SectionTitle>Explorar protótipo</SectionTitle>
          <FeaturedRow>
            {featured.map((item) => {
              const Icon = item.icon;
              return (
                <FeaturedCard
                  key={item.label}
                  onClick={() => navigate(item.path)}
                >
                  <FeaturedArt>
                    <Icon
                      size={28}
                      color={theme.palette.secondary.dark}
                      style={{ width: "clamp(28px, 5vw, 36px)", height: "clamp(28px, 5vw, 36px)" }}
                    />
                  </FeaturedArt>
                  <FeaturedLabel>{item.label}</FeaturedLabel>
                </FeaturedCard>
              );
            })}
          </FeaturedRow>
        </Section>

        <MarketingPanel aria-label="Carrossel de marketing">
          <MarketingTrack
            css={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <MarketingSlide
                key={slide.title + index}
                aria-hidden={activeSlide !== index}
              >
                <MarketingBackdrop />
                  <MarketingEyebrow>{slide.eyebrow}</MarketingEyebrow>
                <div>
                  <MarketingTitle>{slide.title}</MarketingTitle>
                  <MarketingCaption>{slide.caption}</MarketingCaption>
                </div>
              </MarketingSlide>
            ))}
          </MarketingTrack>

          <MarketingDots>
            {slides.map((slide, index) => (
              <MarketingDot
                key={slide.title + "-dot-" + index}
                active={activeSlide === index}
              />
            ))}
          </MarketingDots>
        </MarketingPanel>

        <ClientPanel roleTone={roleTone}>
          <SectionTitle
            css={{
              marginBottom: "$3",
              color: "$textPrimary",
              position: "relative",
              zIndex: 1,
            }}
          >
            Painel do protótipo
          </SectionTitle>
          <Grid>
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <MenuCardItem
                  key={card.path + card.label}
                  roleTone={roleTone}
                  comingSoon={card.comingSoon}
                  onClick={() => {
                    if (!card.comingSoon) navigate(card.path);
                  }}
                >
                  {card.comingSoon && (
                    <ComingSoonBadge>Em breve</ComingSoonBadge>
                  )}
                  <Icon size={28} color="#FFFFFF" strokeWidth={1.8} />
                  <CardLabel>{card.label}</CardLabel>
                </MenuCardItem>
              );
            })}
          </Grid>

          <SocialSection>
            <SocialTitle>Atalhos do protótipo</SocialTitle>
            <SocialLinksRow>
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SocialLinkCard
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${link.label}`}
                    tone={link.tone}
                  >
                    <SocialIconBadge>
                      <Icon size={14} />
                    </SocialIconBadge>
                    <SocialLabel>{link.label}</SocialLabel>
                  </SocialLinkCard>
                );
              })}
            </SocialLinksRow>
          </SocialSection>
        </ClientPanel>
      </PageContent>
    </>
  );
}
