import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { coachService } from "@/services/coach.service";
import { customerService } from "@/services/customer.service";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Section, Text } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { styled } from "@/theme/stitches.config";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export default function CallConsultantPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    send_vd: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nome é obrigatório";
    if (!form.phone.trim()) errs.phone = "Telefone é obrigatório";
    if (!form.email.trim()) errs.email = "E-mail é obrigatório";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !validate()) return;
      const payload = {
        account_id: user.id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        send_vd: Boolean(form.send_vd.trim()),
      };
      const res =
        role === "coach"
          ? await coachService.callConsultant(payload)
          : await customerService.callConsultant(payload);
      if (res.success) {
        toast.success("Solicitação enviada! Nossa equipe entrará em contato.");
        navigate(-1);
      } else {
        toast.error(res.message || "Erro ao enviar.");
      }
    },
  );

  return (
    <>
      <AppHeader title="Contato" showBack />
      <PageContent>
        <Section>
          <Card>
            <CardBody>
              <Text size="sm" color="secondary">
                Preencha os dados abaixo para simular um pedido de contato.
              </Text>
            </CardBody>
          </Card>
        </Section>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            value={form.name}
            onChange={set("name")}
            error={errors.name ? "true" : undefined}
            placeholder="Seu nome completo"
          />
          <Input
            label="Telefone / WhatsApp"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone ? "true" : undefined}
            placeholder="(11) 99999-9999"
          />
          <Input
            label="E-mail"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email ? "true" : undefined}
            placeholder="voce@email.com"
          />
          <Input
            label="Mensagem (opcional)"
            value={form.send_vd}
            onChange={set("send_vd")}
            placeholder="Descreva o que precisa..."
          />
          <Button type="submit" loading={loading} leftIcon={<Send size={18} />}>
            Enviar solicitação
          </Button>
        </Form>
      </PageContent>
    </>
  );
}
