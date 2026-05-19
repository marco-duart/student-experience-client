import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { customerService } from "@/services/customer.service";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Section, Text } from "@/components/layout/PageLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ConfirmStudentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const student = state?.student as Record<string, unknown> | undefined;
  const classroom = state?.classroom as Record<string, unknown> | undefined;
  const studentId = Number(useLocation().pathname.split("/").pop() ?? 0);

  const { loading, run: handleConfirm } = useAsyncAction(async () => {
    if (!user?.customerId) return;
    const res = await customerService.confirmStudent(studentId);
    if (res.success) {
      toast.success("Presença confirmada!");
      navigate(-1);
    } else {
      toast.error(res.message || "Erro ao confirmar.");
    }
  });

  return (
    <>
      <AppHeader title="Confirmar Presença" showBack />
      <PageContent>
        <Section>
          <Card>
            <CardBody
              css={{
                textAlign: "center",
                gap: "$4",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CheckCircle size={48} color="var(--colors-success)" />
              <Text weight="semibold" size="lg">
                {String(student?.name ?? student?.nome ?? "Aluno")}
              </Text>
              {classroom && (
                <Text color="secondary" size="sm">
                  Turma: {String(classroom.name ?? "")}
                </Text>
              )}
              <Text color="secondary" size="sm">
                Deseja confirmar a presença?
              </Text>
            </CardBody>
          </Card>
        </Section>

        <Button
          onClick={() => handleConfirm()}
          loading={loading}
          leftIcon={<CheckCircle size={18} />}
        >
          Confirmar Presença
        </Button>
      </PageContent>
    </>
  );
}
