import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$5",
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

const CheckRow = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  cursor: "pointer",
  fontSize: "$sm",
  color: "$textSecondary",
  userSelect: "none",
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

const Separator = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  margin: "$2 0",
  "& span": {
    flex: 1,
    height: "1px",
    backgroundColor: "$divider",
  },
  "& p": {
    fontSize: "$xs",
    color: "$textDisabled",
    margin: 0,
    whiteSpace: "nowrap",
  },
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const next = { email: "", password: "" };
    if (!email.trim()) next.email = "Informe seu e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "E-mail inválido";
    if (!password.trim()) next.password = "Informe sua senha";
    setErrors(next);
    return !next.email && !next.password;
  };

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      const result = await login({ email, password, rememberMe });
      if (result.ok) {
        navigate("/app/home", { replace: true });
      } else {
        toast.error(result.message || "Credenciais inválidas.");
      }
    },
  );

  return (
    <>
      <PageTitle>Bem-vindo de volta</PageTitle>
      <PageSub>
        Acesse sua conta demonstrativa. Use coach, coachee, customer ou employee no e-mail para trocar de perfil.
      </PageSub>

      <Form onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email ? "true" : undefined}
          autoComplete="email"
          inputMode="email"
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password ? "true" : undefined}
          autoComplete="current-password"
        />

        <CheckRow>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            id="remember"
          />
          Lembrar de mim
        </CheckRow>

        <Button type="submit" loading={loading} leftIcon={<LogIn size={18} />}>
          Entrar
        </Button>
      </Form>

      <Separator>
        <span />
        <p>ou</p>
        <span />
      </Separator>

      <Footer>
        <LinkText to="/auth/forget-pass">Esqueceu sua senha?</LinkText>
      </Footer>

      <Footer>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--colors-textSecondary)",
            margin: "8px 0 4px",
          }}
        >
          Problemas para logar?{" "}
        </p>
        <ExternalLinkText
          href="/auth/first-access"
        >
          Acesso inicial
        </ExternalLinkText>
      </Footer>

      <Footer>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--colors-textSecondary)",
            margin: "8px 0 4px",
          }}
        >
          Não tem conta?{" "}
        </p>
        <LinkText to="/auth/register">Criar conta demonstrativa</LinkText>
      </Footer>

      <Footer>
        {/* <LinkText to="/auth/first-access">Primeiro acesso (Coach)?</LinkText> */}
      </Footer>
    </>
  );
}
