// import { useLocation, useNavigate } from "react-router-dom";
// import { ClipboardList, ChevronRight } from "lucide-react";
// import { AppHeader } from "@/components/layout/AppHeader";
// import { PageContent, Section, SectionTitle, Col, Text, Row, Divider } from "@/components/layout/PageLayout";
// import { Card, CardBody } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Badge } from "@/components/ui/Badge";
// import type { Tool, ToolField } from "@/types/domain";

export default function ToolDetailPage() {
  // const { state } = useLocation();
  // const navigate = useNavigate();
  // const tool = state?.tool as Tool | undefined;

  // if (!tool) {
  //   return (
  //     <>
  //       <AppHeader title="Ferramenta" showBack />
  //       <PageContent>
  //         <Text color="secondary">Ferramenta não encontrada.</Text>
  //       </PageContent>
  //     </>
  //   );
  // }

  return (
    <>
      {/* <AppHeader title={tool.name} showBack />
      <PageContent>
        <Section>
          <Card>
            <CardBody css={{ gap: "$2", display: "flex", flexDirection: "column" }}>
              <Row justify="between" css={{ alignItems: "flex-start" }}>
                <Col css={{ flex: 1, gap: "$1" }}>
                  <Text weight="bold" size="md">{tool.name}</Text>
                  {tool.description && <Text color="secondary" size="sm">{tool.description}</Text>}
                </Col>
                <Badge color="primary">ID: {tool.id}</Badge>
              </Row>
            </CardBody>
          </Card>
        </Section>

        {tool.fields && tool.fields.length > 0 && (
          <Section>
            <SectionTitle>Campos ({tool.fields.length})</SectionTitle>
            <Card>
              <CardBody>
                {tool.fields.map((field: ToolField, idx: number) => (
                  <div key={field.id ?? idx}>
                    <Row css={{ alignItems: "flex-start", gap: "$3", padding: "$3 0" }}>
                      <Badge color="neutral" css={{ flexShrink: 0, marginTop: "2px" }}>{idx + 1}</Badge>
                      <Col css={{ flex: 1, gap: "$1" }}>
                        <Text size="sm" weight="medium">{field.name}</Text>
                        {field.type && <Text size="xs" color="secondary">{field.type}</Text>}
                      </Col>
                    </Row>
                    {idx < tool.fields!.length - 1 && <Divider />}
                  </div>
                ))}
              </CardBody>
            </Card>
          </Section>
        )}

        <Button
          leftIcon={<ClipboardList size={18} />}
          onClick={() => navigate("/app/tools/answer", { state: { tool } })}
        >
          Responder esta ferramenta
        </Button>
      </PageContent> */}
    </>
  );
}
