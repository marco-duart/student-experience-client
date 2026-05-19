// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { Share2 } from "lucide-react";
// import { coachService } from "@/services/coach.service";
// import { useAuth } from "@/contexts/auth-context";
// import { useAsyncAction } from "@/hooks/use-async-action";
// import { AppHeader } from "@/components/layout/AppHeader";
// import { PageContent, Section, Text } from "@/components/layout/PageLayout";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Card, CardBody } from "@/components/ui/Card";
// import { styled } from "@/theme/stitches.config";
// import type { Tool } from "@/types/domain";

// const Form = styled("form", { display: "flex", flexDirection: "column", gap: "$4" });

export default function ToolSharePage() {
  // const { state } = useLocation();
  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const tool = state?.tool as Tool | undefined;
  // const [coacheeId, setCoacheeId] = useState("");
  // const [toolIdInput, setToolIdInput] = useState(tool ? String(tool.id) : "");
  // const [errors, setErrors] = useState<Record<string, string>>({});

  // const { loading, run: handleSubmit } = useAsyncAction(async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const errs: Record<string, string> = {};
  //   if (!coacheeId.trim()) errs.coacheeId = "Informe o ID do coachee";
  //   if (!toolIdInput.trim()) errs.toolId = "Informe o ID da ferramenta";
  //   setErrors(errs);
  //   if (Object.keys(errs).length > 0) return;
  //   if (!user) return;
  //   const res = await coachService.shareTool({
  //     coach_id: user.id,
  //     coachee_id: parseInt(coacheeId, 10),
  //     tool_id: parseInt(toolIdInput, 10),
  //   });
  //   if (res.success) {
  //     toast.success("Ferramenta compartilhada!");
  //     navigate(-1);
  //   } else {
  //     toast.error(res.message || "Erro ao compartilhar.");
  //   }
  // });

  return (
    <>
      {/* <AppHeader title="Compartilhar Ferramenta" showBack />
      <PageContent>
        {tool && (
          <Section>
            <Card>
              <CardBody>
                <Text size="sm" weight="semibold">{tool.name}</Text>
                <Text size="xs" color="secondary">ID: {tool.id}</Text>
              </CardBody>
            </Card>
          </Section>
        )}
        <Form onSubmit={handleSubmit}>
          <Input
            label="ID da Ferramenta"
            type="number"
            inputMode="numeric"
            value={toolIdInput}
            onChange={(e) => setToolIdInput(e.target.value)}
            error={errors.toolId}
            placeholder="ID numérico da ferramenta"
          />
          <Input
            label="ID do Coachee"
            type="number"
            inputMode="numeric"
            value={coacheeId}
            onChange={(e) => setCoacheeId(e.target.value)}
            error={errors.coacheeId}
            placeholder="ID numérico do coachee"
          />
          <Button type="submit" loading={loading} leftIcon={<Share2 size={18} />}>
            Compartilhar
          </Button>
        </Form>
      </PageContent> */}
    </>
  );
}
