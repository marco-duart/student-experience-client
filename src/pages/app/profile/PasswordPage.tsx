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

export default function PasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.current) errs.current = "Informe a senha atual";
    if (!form.next) errs.next = "Informe a nova senha";
    else if (form.next.length < 6) errs.next = "Mínimo 6 caracteres";
    if (form.next !== form.confirm) errs.confirm = "Senhas não conferem";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !validate()) return;
      const res = await accountService.updatePassword({
        account_id: user.id,
        current_pass: form.current,
        new_pass: form.next,
      });
      if (res.success) {
        toast.success("Senha alterada!");
        navigate(-1);
      } else {
        toast.error(res.message || "Erro ao alterar senha.");
      }
    },
  );

  return (
    <>
      <AppHeader title="Alterar senha" showBack />
      <PageContent>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Senha atual"
            type="password"
            value={form.current}
            onChange={set("current")}
            error={errors.current ? "true" : undefined}
            autoComplete="current-password"
          />
          <Input
            label="Nova senha"
            type="password"
            value={form.next}
            onChange={set("next")}
            error={errors.next ? "true" : undefined}
            autoComplete="new-password"
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            value={form.confirm}
            onChange={set("confirm")}
            error={errors.confirm ? "true" : undefined}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} leftIcon={<Save size={18} />}>
            Salvar nova senha
          </Button>
        </Form>
      </PageContent>
    </>
  );
}
