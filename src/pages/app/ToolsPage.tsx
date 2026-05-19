import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Share2, ClipboardList, BookOpen } from "lucide-react";
import { toolService } from "@/services/tool.service";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  Section,
  SectionTitle,
  Text,
} from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { styled } from "@/theme/stitches.config";

const QuickActions = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$3",
  marginBottom: "$4",
});

const ActionCard = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$2",
  padding: "$4 $3",
  border: "1px solid $divider",
  borderRadius: "$md",
  backgroundColor: "$bgPaper",
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:hover": { backgroundColor: "rgba(0,43,92,0.04)", borderColor: "$primary" },
  "&:active": { transform: "scale(0.97)" },
});

const ActionIcon = styled("div", {
  width: "40px",
  height: "40px",
  borderRadius: "$md",
  background: "linear-gradient(135deg, $primary, $primaryLight)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$3",
});

export default function ToolsPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [toolId, setToolId] = useState("");

  const { loading, run: handleSearch } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const id = parseInt(toolId.trim(), 10);
      if (isNaN(id)) {
        toast.error("Informe um ID numérico válido.");
        return;
      }
      const res = await toolService.getById(id);
      if (res.success && res.data) {
        navigate("/app/tools/detail", { state: { tool: res.data } });
      } else {
        toast.error(res.message || "Ferramenta não encontrada.");
      }
    },
  );

  return (
    <>
      <AppHeader title="Ferramentas" showBack />
      <PageContent>
        <Section>
          <QuickActions>
            {role === "coach" && (
              <>
                <ActionCard onClick={() => navigate("/app/tools/share")}>
                  <ActionIcon>
                    <Share2 size={18} color="#fff" />
                  </ActionIcon>
                  <Text size="xs" weight="medium" css={{ textAlign: "center" }}>
                    Compartilhar Ferramenta
                  </Text>
                </ActionCard>
                <ActionCard onClick={() => navigate("/app/tools/answer")}>
                  <ActionIcon>
                    <ClipboardList size={18} color="#fff" />
                  </ActionIcon>
                  <Text size="xs" weight="medium" css={{ textAlign: "center" }}>
                    Responder Ferramenta
                  </Text>
                </ActionCard>
              </>
            )}
            {role === "coachee" && (
              <ActionCard onClick={() => navigate("/app/tools/shared")}>
                <ActionIcon>
                  <BookOpen size={18} color="#fff" />
                </ActionIcon>
                <Text size="xs" weight="medium" css={{ textAlign: "center" }}>
                  Ferramentas Compartilhadas
                </Text>
              </ActionCard>
            )}
          </QuickActions>
        </Section>

        <Section>
          <SectionTitle>Buscar por ID</SectionTitle>
          <Form onSubmit={handleSearch}>
            <Input
              label="ID da ferramenta"
              type="number"
              inputMode="numeric"
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              placeholder="Ex: 42"
            />
            <Button
              type="submit"
              loading={loading}
              leftIcon={<Search size={18} />}
            >
              Buscar ferramenta
            </Button>
          </Form>
        </Section>
      </PageContent>
    </>
  );
}
