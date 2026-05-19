// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { Send } from "lucide-react";
// import { toolService } from "@/services/tool.service";
// import { useAuth } from "@/contexts/auth-context";
// import { useAsyncAction } from "@/hooks/use-async-action";
// import { AppHeader } from "@/components/layout/AppHeader";
// import { PageContent, Text } from "@/components/layout/PageLayout";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { styled } from "@/theme/stitches.config";
// import type { Tool, ToolField } from "@/types/domain";

// const Form = styled("form", { display: "flex", flexDirection: "column", gap: "$4" });

// const FieldLabel = styled("label", {
//   fontSize: "$sm",
//   fontWeight: "$medium",
//   color: "$textPrimary",
//   display: "block",
//   marginBottom: "$2",
// });

// const TextArea = styled("textarea", {
//   width: "100%",
//   minHeight: "80px",
//   padding: "$3",
//   borderRadius: "$sm",
//   border: "1.5px solid $border",
//   fontSize: "$sm",
//   color: "$textPrimary",
//   backgroundColor: "$bgDefault",
//   resize: "vertical",
//   fontFamily: "inherit",
//   transition: "border-color 0.15s ease",
//   boxSizing: "border-box",
//   "&:focus": { outline: "none", borderColor: "$primary" },
// });

export default function ToolAnswerPage() {
  // const { state } = useLocation();
  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const tool = state?.tool as Tool | undefined;
  // const [answers, setAnswers] = useState<Record<string, string>>({});

  // useEffect(() => {
  //   if (!tool || !user) return;
  //   toolService.fetchToolAnswer({ tool_id: tool.id, account_id: user.id }).then((res) => {
  //     if (res.success && res.data) {
  //       const data = res.data as Record<string, unknown>;
  //       const existing = Array.isArray(data.answers) ? data.answers as Record<string, unknown>[] : [];
  //       const mapped: Record<string, string> = {};
  //       for (const a of existing) {
  //         if (a.tool_field_id && a.value) {
  //           mapped[String(a.tool_field_id)] = String(a.value);
  //         }
  //       }
  //       setAnswers(mapped);
  //     }
  //   });
  // }, [tool, user]);

  // const { loading: saving, run: handleSubmit } = useAsyncAction(async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!tool || !user) return;
  //   const answerArr = Object.entries(answers).map(([fieldId, value]) => ({
  //     tool_field_id: parseInt(fieldId, 10),
  //     value,
  //   }));
  //   const res = await toolService.sendAnswer({ tool_id: tool.id, account_id: user.id, answers: answerArr });
  //   if (res.success) {
  //     toast.success("Respostas salvas!");
  //     navigate(-1);
  //   } else {
  //     toast.error(res.message || "Erro ao salvar.");
  //   }
  // });

  // if (!tool) {
  //   return (
  //     <>
  //       <AppHeader title="Responder" showBack />
  //       <PageContent><Text color="secondary">Ferramenta não selecionada.</Text></PageContent>
  //     </>
  //   );
  // }

  // const setAnswer = (fieldId: string | number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  //   setAnswers((prev) => ({ ...prev, [String(fieldId)]: e.target.value }));

  return (
    <>
      {/* <AppHeader title={tool.name} showBack /> */}
      {/* <PageContent> */}
        {/* <Form onSubmit={handleSubmit}>
          {(tool.fields ?? []).map((field: ToolField) => (
            <div key={field.id}>
              <FieldLabel>{field.name}</FieldLabel>
              {field.type === "textarea" ? (
                <TextArea
                  value={answers[String(field.id)] ?? ""}
                  onChange={setAnswer(field.id)}
                  placeholder={`Responda: ${field.name}`}
                />
              ) : (
                <Input
                  value={answers[String(field.id)] ?? ""}
                  onChange={setAnswer(field.id) as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  placeholder={`Responda: ${field.name}`}
                />
              )}
            </div>
          ))}
          <Button type="submit" loading={saving} leftIcon={<Send size={18} />}>
            Salvar respostas
          </Button>
        </Form> */}
      {/* </PageContent> */}
    </>
  );
}
