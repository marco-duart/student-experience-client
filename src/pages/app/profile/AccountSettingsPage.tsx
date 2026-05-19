import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Save } from "lucide-react";
import { accountService } from "@/services/user.service";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { styled } from "@/theme/stitches.config";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export default function AccountSettingsPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    document: user?.document ?? "",
  });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      const res = await accountService.updatePersonalInfo({
        account_id: user.id,
        name: form.name || undefined,
        phone: form.phone || undefined,
        document: form.document || undefined,
      });
      if (res.success) {
        toast.success("Dados atualizados!");
        await refreshUser({
          ...user,
          name: form.name || user.name,
          phone: form.phone || user.phone,
        });
        navigate(-1);
      } else {
        toast.error(res.message || "Erro ao salvar.");
      }
    },
  );

  return (
    <>
      <AppHeader title="Dados pessoais" showBack />
      <PageContent>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            value={form.name}
            onChange={set("name")}
          />
          <Input
            label="Telefone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
          />
          <Input
            label="CPF"
            value={form.document}
            onChange={set("document")}
            inputMode="numeric"
          />
          <Button type="submit" loading={loading} leftIcon={<Save size={18} />}>
            Salvar alterações
          </Button>
        </Form>
      </PageContent>
    </>
  );
}
