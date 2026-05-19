import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { styled } from "@/theme/stitches.config";
import { accountService } from "@/services/user.service";
import { useAsyncAction } from "@/hooks/use-async-action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
  marginBottom: "$4",
  lineHeight: 1.6,
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$5",
});

const Footer = styled("div", {
  textAlign: "center",
  marginTop: "$6",
});

const LinkText = styled(Link, {
  color: "$primary",
  fontWeight: "$semibold",
  fontSize: "$sm",
  "&:hover": { textDecoration: "underline" },
});

const SuccessBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$4",
  padding: "$6",
  backgroundColor: "$successBg",
  borderRadius: "$md",
  textAlign: "center",
  color: "$success",
});

export default function ForgetPassPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) {
        setError("Informe seu e-mail");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("E-mail inválido");
        return;
      }
      setError("");

      const res = await accountService.recoverPassword(
        email.trim().toLowerCase(),
      );
      if (res.success) {
        setSent(true);
      } else {
        toast.error(res.message || "Erro ao enviar e-mail.");
      }
    },
  );

  if (sent) {
    return (
      <>
        <PageTitle>E-mail enviado!</PageTitle>
        <SuccessBox>
          <CheckCircle size={40} />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Enviamos as instruções para <strong>{email}</strong>. Verifique sua
            caixa de entrada.
          </p>
        </SuccessBox>
        <Footer>
          <LinkText to="/auth/login">← Voltar ao login</LinkText>
        </Footer>
      </>
    );
  }

  return (
    <>
      <PageTitle>Recuperar senha</PageTitle>
      <PageSub>
        Informe o e-mail da sua conta e enviaremos as instruções para criar uma
        nova senha.
      </PageSub>

      <Form onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ? "true" : undefined}
          autoComplete="email"
          inputMode="email"
        />
        <Button type="submit" loading={loading} leftIcon={<Mail size={18} />}>
          Enviar instruções
        </Button>
      </Form>

      <Footer>
        <LinkText to="/auth/login">← Voltar ao login</LinkText>
      </Footer>
    </>
  );
}
