import { useEffect, useState } from "react";
import { ExternalLink, Globe, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Text } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { styled } from "@/theme/stitches.config";

type Props = {
  title: string;
  url: string;
};

const FrameShell = styled("div", {
  minHeight: "calc(100vh - 132px)",
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  padding: "$3",
});

const FrameToolbar = styled("div", {
  display: "flex",
  gap: "$2",
  flexWrap: "wrap",
  alignItems: "center",
});

const FrameContainer = styled("div", {
  flex: 1,
  minHeight: "520px",
  border: "1px solid $divider",
  borderRadius: "$lg",
  overflow: "hidden",
  backgroundColor: "$bgPaper",
});

const EmbeddedFrame = styled("iframe", {
  width: "100%",
  height: "100%",
  minHeight: "520px",
  border: "none",
  backgroundColor: "#fff",
});

const HintBox = styled("div", {
  border: "1px dashed $divider",
  borderRadius: "$md",
  padding: "$3",
  backgroundColor: "rgba(0,43,92,0.03)",
});

export default function RedirectPage({ title, url }: Props) {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [showFallbackHint, setShowFallbackHint] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowFallbackHint(false);
    const t = window.setTimeout(() => {
      setShowFallbackHint(true);
    }, 7000);

    return () => window.clearTimeout(t);
  }, [url, iframeKey]);

  return (
    <>
      <AppHeader title={title} showBack />
      <PageContent noPadding>
        <Shell>
          <Panel>
            <PrototypeCard label="logo" tone="light" size="sm" />
            <Section>
              <SectionTitle>Conteúdo interno</SectionTitle>
              <Text size="md" weight="semibold">
                {summary}
              </Text>
              <Text size="sm" color="secondary" css={{ marginTop: "$2" }}>
                O endereço original foi convertido em uma experiência local para o protótipo.
              </Text>
            </Section>
 
            <Button
              variant="secondary"
              onClick={() => (window.location.hash = "#/app/home")}
            >
              Voltar ao painel
            </Button>
          </Panel>
 
          <Text size="xs" color="disabled">
            Referência antiga preservada apenas como contexto interno: {url}
          </Text>
        </Shell>
      </PageContent>
    </>
  );
}
