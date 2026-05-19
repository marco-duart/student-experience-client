// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BookOpen, ChevronRight } from "lucide-react";
// import { coacheeService } from "@/services/coachee.service";
// import { useAuth } from "@/contexts/auth-context";
// import { AppHeader } from "@/components/layout/AppHeader";
// import { PageContent, EmptyState, EmptyStateTitle, EmptyStateText, Col, Text } from "@/components/layout/PageLayout";
// import { Spinner } from "@/components/ui/Spinner";
// import { styled } from "@/theme/stitches.config";
// import type { Tool } from "@/types/domain";

// const ToolItem = styled("div", {
//   display: "flex",
//   gap: "$3",
//   alignItems: "center",
//   padding: "$4 $5",
//   borderBottom: "1px solid $divider",
//   cursor: "pointer",
//   transition: "background 0.12s",
//   "&:hover": { backgroundColor: "rgba(0,43,92,0.03)" },
//   "&:active": { backgroundColor: "rgba(0,43,92,0.06)" },
// });

// const ToolIconWrap = styled("div", {
//   width: "40px",
//   height: "40px",
//   borderRadius: "$md",
//   background: "linear-gradient(135deg, $primary, $primaryLight)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   flexShrink: 0,
// });

export default function SharedToolsPage() {
  // const { user } = useAuth();
  // const navigate = useNavigate();
  // const [tools, setTools] = useState<Tool[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
    // if (!user) return;
    // coacheeService.fetchSharedTools(user.id).then((res) => {
    //   if (res.success) {
    //     const arr = Array.isArray(res.data) ? res.data as Tool[] : [];
    //     setTools(arr);
    //   }
    //   setLoading(false);
    // });
  // }, [user]);

  return (
    <>
      {/* <AppHeader title="Ferramentas Compartilhadas" showBack />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando..." />
        ) : tools.length === 0 ? (
          <EmptyState>
            <BookOpen size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem ferramentas</EmptyStateTitle>
            <EmptyStateText>Nenhuma ferramenta foi compartilhada com você ainda.</EmptyStateText>
          </EmptyState>
        ) : (
          <div>
            {tools.map((tool) => (
              <ToolItem key={tool.id} onClick={() => navigate("/app/tools/answer", { state: { tool } })}>
                <ToolIconWrap>
                  <BookOpen size={18} color="#fff" />
                </ToolIconWrap>
                <Col css={{ flex: 1, gap: "$1" }}>
                  <Text weight="semibold" size="sm">{tool.name}</Text>
                  {tool.fields && (
                    <Text size="xs" color="secondary">{tool.fields.length} campo(s)</Text>
                  )}
                </Col>
                <ChevronRight size={18} color="var(--colors-textDisabled)" />
              </ToolItem>
            ))}
          </div>
        )}
      </PageContent> */}
    </>
  );
}
