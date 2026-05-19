import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Tag, Hash } from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  HeroGradient,
  HeroTitle,
  HeroSubtitle,
} from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PrototypeCard } from "@/components/ui/PrototypeCard";
import { getProductVisualById } from "@/constants/product-visuals";

type CourseItem = {
  id: number;
  nome: string;
  codigo: string;
  tipo: number;
  service_type: number;
  classificacao: number;
};

const SERVICE_TYPE_MAP: Record<number, string> = {
  1: "EVENTO",
  2: "TRILHA",
  3: "BIBLIOTECA",
  4: "CURTA DURAÇÃO",
  5: "TRILHA GUIADA",
  6: "TRILHA AVANÇADA",
  7: "TRILHA COMPLEMENTAR",
  8: "ACESSO",
  15: "EMPRESARIAL",
  16: "PRODUTO",
  17: "TRILHA PREMIUM",
};

const InfoSection = styled("div", {
  padding: "$5",
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

const ProductVisual = styled("div", {
  borderRadius: "$lg",
  overflow: "hidden",
  backgroundColor: "$bgPaper",
  border: "1px solid $divider",
});

const ProductImage = styled("img", {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  display: "block",
  backgroundColor: "#f4f7f9",
});

const ProductCaption = styled("p", {
  margin: 0,
  padding: "$4",
  fontSize: "$sm",
  lineHeight: 1.45,
  color: "$textSecondary",
});

const InfoCard = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$md",
  padding: "$4",
  border: "1px solid $divider",
  display: "flex",
  gap: "$4",
  alignItems: "flex-start",
});

const InfoIcon = styled("div", {
  width: "36px",
  height: "36px",
  borderRadius: "$sm",
  backgroundColor: "rgba(0,43,92,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const InfoContent = styled("div", {
  flex: 1,
});

const InfoLabel = styled("span", {
  fontSize: "$xs",
  color: "$textDisabled",
  fontWeight: "$semibold",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "3px",
});

const InfoValue = styled("span", {
  fontSize: "$md",
  color: "$textPrimary",
  fontWeight: "$medium",
  display: "block",
});

export default function CourseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course as CourseItem | undefined;

  if (!course) {
    return (
      <>
        <AppHeader title="Curso" showBack />
        <PageContent>
          <p
            style={{
              color: "var(--colors-textSecondary)",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            Curso não encontrado.
          </p>
        </PageContent>
      </>
    );
  }

  const serviceTypeLabel =
    SERVICE_TYPE_MAP[course.service_type] ?? "Desconhecido";
  const classificationLabel =
    course.classificacao === 1 ? "PRODUTO" : "CONTEÚDO";
  const visual = getProductVisualById(course.id);

  return (
    <>
      <HeroGradient>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(197,160,89,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={24} color="var(--colors-secondaryLight)" />
          </div>
          <div>
            <HeroTitle style={{ fontSize: "1.1rem" }}>{course.nome}</HeroTitle>
            <HeroSubtitle>{course.codigo}</HeroSubtitle>
          </div>
        </div>
      </HeroGradient>

      <PageContent>
        <InfoSection>
          <ProductVisual>
            <div
              style={{
                minHeight: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background:
                  "linear-gradient(160deg, rgba(16,33,43,0.96) 0%, rgba(15,76,92,0.92) 60%, rgba(224,159,62,0.85) 100%)",
              }}
            >
              <PrototypeCard label={visual.label} tone="light" size="lg" />
            </div>
            <ProductCaption>{visual.miniDescription}</ProductCaption>
          </ProductVisual>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge color="primary">{serviceTypeLabel}</Badge>
            <Badge color="secondary">{classificationLabel}</Badge>
          </div>

          <InfoCard>
            <InfoIcon>
              <Hash size={18} color="var(--colors-primary)" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Código</InfoLabel>
              <InfoValue style={{ fontFamily: "monospace" }}>
                {course.codigo}
              </InfoValue>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <Tag size={18} color="var(--colors-primary)" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Tipo</InfoLabel>
              <InfoValue>{serviceTypeLabel}</InfoValue>
            </InfoContent>
          </InfoCard>

          {/* <InfoCard>
            <InfoIcon>
              <BookOpen size={18} color="var(--colors-primary)" />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Classificação</InfoLabel>
              <InfoValue>{classificationLabel}</InfoValue>
            </InfoContent>
          </InfoCard> */}

          <Button variant="secondary" onClick={() => navigate(-1)}>
            Voltar à lista
          </Button>
        </InfoSection>
      </PageContent>
    </>
  );
}
