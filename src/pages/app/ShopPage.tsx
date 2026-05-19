import { ExternalLink, Globe, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Section, SectionTitle, Text } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { PrototypeCard } from "@/components/ui/PrototypeCard";
import { styled } from "@/theme/stitches.config";

const FrameShell = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
  padding: "$4",
});

const ShowcaseGrid = styled("div", {
  display: "grid",
  gap: "$3",
  gridTemplateColumns: "1fr",

  "@md": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
});

const ShowcaseCard = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$lg",
  border: "1px solid $divider",
  padding: "$4",
  boxShadow: "$soft",
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  minHeight: "180px",
});

const HintBox = styled("div", {
  border: "1px dashed $divider",
  borderRadius: "$md",
  padding: "$3",
  backgroundColor: "rgba(15,76,92,0.04)",
});

export default function ShopPage() {
  const highlights = [
    "Catálogo navegável",
    "Cards de produto demonstrativos",
    "Fluxo pronto para apresentação",
  ];

  return (
    <>
      <AppHeader title="Catálogo demonstrativo" showBack />
      <PageContent noPadding>
        <FrameShell>
          <Section>
            <SectionTitle>Visão geral</SectionTitle>
            <ShowcaseGrid>
              {highlights.map((item, index) => (
                <ShowcaseCard key={item}>
                  <PrototypeCard
                    label="Produto"
                    tone={index === 1 ? "accent" : "brand"}
                    size="sm"
                  />
                  <Text size="sm" weight="semibold">
                    {item}
                  </Text>
                  <Text size="xs" color="secondary">
                    O objetivo aqui é mostrar como o catálogo pode ser apresentado sem depender de site externo.
                  </Text>
                </ShowcaseCard>
              ))}
            </ShowcaseGrid>
          </Section>

          <HintBox>
            <Text size="sm" color="secondary">
              Esta área substitui o iframe original por uma vitrine interna. O usuário continua no protótipo e consegue avaliar a experiência completa.
            </Text>
          </HintBox>

          <Section>
            <SectionTitle>Ações rápidas</SectionTitle>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Recarregar
              </Button>
              <Button
                size="sm"
                variant="gold"
                leftIcon={<ExternalLink size={16} />}
                onClick={() => (window.location.hash = "#/app/courses")}
              >
                Ver catálogo
              </Button>
            </div>
          </Section>

          <Text
            size="xs"
            color="disabled"
            css={{ display: "flex", alignItems: "center", gap: "$2" }}
          >
            <Globe size={12} />
            Conteúdo interno do protótipo com foco em demonstração comercial.
          </Text>
        </FrameShell>
      </PageContent>
    </>
  );
}