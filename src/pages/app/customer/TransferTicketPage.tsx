import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { customerService } from "@/services/customer.service";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Section, Text } from "@/components/layout/PageLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { styled } from "@/theme/stitches.config";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export default function TransferTicketPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student as Record<string, unknown> | undefined;
  const studentId = Number(useLocation().pathname.split("/").pop() ?? 0);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
  }>({});

  const setField =
    (field: "nome" | "cpf" | "email" | "telefone") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs: { nome?: string; email?: string; telefone?: string } = {};
      if (!form.nome.trim()) errs.nome = "Informe o nome completo";
      if (!form.email.trim()) errs.email = "Informe o e-mail";
      if (!form.telefone.trim()) errs.telefone = "Informe o telefone";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      if (!studentId) {
        toast.error("Aluno inválido para transferência.");
        return;
      }

      const res = await customerService.transferStudent(studentId, {
        nome: form.nome.trim(),
        cpf: form.cpf.trim() || undefined,
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        tipo_cliente: "BRASILEIRO",
      });

      if (res.success) {
        toast.success("Transferência realizada!");
        navigate(-1);
      } else {
        const message =
          typeof res.message === "string" && res.message.trim().length > 0
            ? res.message
            : "Erro ao transferir.";
        toast.error(message);
      }
    },
  );

  return (
    <>
      <AppHeader title="Transferir Vaga" showBack />
      <PageContent>
        <Section>
          <Card>
            <CardBody
              css={{ gap: "$2", display: "flex", flexDirection: "column" }}
            >
              <Text weight="semibold" size="sm">
                Aluno: {String(student?.name ?? student?.nome ?? "Aluno")}
              </Text>
              <Text color="secondary" size="xs">
                Preencha os dados da pessoa que receberá este ingresso.
              </Text>
            </CardBody>
          </Card>
        </Section>

        <Form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            value={form.nome}
            onChange={setField("nome")}
            error={errors.nome ? "true" : undefined}
            placeholder="Ex: Maria Silva"
          />

          <Input
            label="CPF"
            value={form.cpf}
            onChange={setField("cpf")}
            placeholder="000.000.000-00"
          />

          <Input
            label="E-mail do destinatário"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={setField("email")}
            error={errors.email ? "true" : undefined}
            placeholder="destinatario@email.com"
          />

          <Input
            label="Telefone"
            type="tel"
            inputMode="tel"
            value={form.telefone}
            onChange={setField("telefone")}
            error={errors.telefone ? "true" : undefined}
            placeholder="(11) 99999-9999"
          />

          <Button
            type="submit"
            loading={loading}
            leftIcon={<RefreshCw size={18} />}
          >
            Transferir vaga
          </Button>
        </Form>
      </PageContent>
    </>
  );
}
