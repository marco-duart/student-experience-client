import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { styled } from "@/theme/stitches.config";
import { accountService } from "@/services/user.service";
import { useAsyncAction } from "@/hooks/use-async-action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

const PageTitle = styled("h2", {
  fontSize: "$xl",
  fontWeight: "$bold",
  color: "$textPrimary",
  margin: 0,
  marginBottom: "$1",
});

const PageSub = styled("p", {
  fontSize: "$sm",
  color: "$textSecondary",
  margin: 0,
  marginBottom: "$2",
});

const Footer = styled("div", {
  textAlign: "center",
  marginTop: "$4",
});

const LinkText = styled(Link, {
  color: "$primary",
  fontWeight: "$semibold",
  fontSize: "$sm",
  "&:hover": { textDecoration: "underline" },
});

const ExternalLinkText = styled("a", {
  color: "$primary",
  fontWeight: "$semibold",
  fontSize: "$sm",
  "&:hover": { textDecoration: "underline" },
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Nome é obrigatório";
    if (!form.email.trim()) next.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "E-mail inválido";
    if (!form.phone.trim()) next.phone = "Telefone é obrigatório";
    if (!form.password) next.password = "Senha é obrigatória";
    else if (form.password.length < 6) next.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Senhas não conferem";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      const res = await accountService.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        document: form.document || undefined,
        password: form.password,
      });

      if (res.success) {
        toast.success("Conta criada! Faça login.");
        navigate("/auth/login");
      } else {
        toast.error(res.message || "Erro ao criar conta.");
      }
    },
  );

  return (
    <>
      <PageTitle>Criar conta</PageTitle>
      <PageSub>Preencha os dados para ativar um acesso demonstrativo</PageSub>

      <Form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          value={form.name}
          onChange={set("name")}
          error={errors.name ? "true" : undefined}
          autoComplete="name"
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email ? "true" : undefined}
          autoComplete="email"
          inputMode="email"
        />
        <Input
          label="Telefone"
          type="tel"
          placeholder="(11) 91234-5678"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone ? "true" : undefined}
          autoComplete="tel"
          inputMode="tel"
        />
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={form.document}
          onChange={set("document")}
          error={errors.document ? "true" : undefined}
          inputMode="numeric"
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          error={errors.password ? "true" : undefined}
          autoComplete="new-password"
        />
        <Input
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword ? "true" : undefined}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={loading}
          leftIcon={<UserPlus size={18} />}
        >
          Criar conta
        </Button>
      </Form>

      <Footer>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--colors-textSecondary)",
            margin: "12px 0 4px",
          }}
        >
          Já tem conta?{" "}
        </p>
        <LinkText to="/auth/login">Fazer login</LinkText>
          <p
          style={{
            fontSize: "0.875rem",
            color: "var(--colors-textSecondary)",
            margin: "8px 0 4px",
          }}
        >
          Problemas ao criar a conta?{" "}
        </p>
        <ExternalLinkText
          href="/auth/first-access"
        >
          Acesso inicial
        </ExternalLinkText>
      </Footer>
    </>
  );
}
