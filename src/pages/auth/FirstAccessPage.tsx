import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { styled } from "@/theme/stitches.config";
import { coachService } from "@/services/coach.service";
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

export default function FirstAccessPage() {
  const navigate = useNavigate();
  const [accountableId, setAccountableId] = useState("");
  const [error, setError] = useState("");

  const { loading, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const id = Number(accountableId.trim());
      if (!id || !Number.isFinite(id)) {
        setError("Informe um ID válido");
        return;
      }
      setError("");

      const res = await coachService.firstAccess({
        accountable_type: "Customer",
        accountable_id: id,
      });

      if (res.success) {
        toast.success("Acesso verificado! Faça login com suas credenciais.");
        navigate("/auth/login");
      } else {
        toast.error(res.message || "ID não encontrado.");
      }
    },
  );

  return (
    <>
      <PageTitle>Primeiro acesso</PageTitle>
      <PageSub>
        Informe um ID demonstrativo para simular a ativação do acesso.
      </PageSub>

      <Form onSubmit={handleSubmit} noValidate>
        <Input
          label="ID de acesso"
          type="text"
          placeholder="Ex: 123456"
          value={accountableId}
          onChange={(e) => setAccountableId(e.target.value)}
          error={error ? "true" : undefined}
          inputMode="numeric"
        />
        <Button
          type="submit"
          loading={loading}
          leftIcon={<KeyRound size={18} />}
        >
          Verificar acesso
        </Button>
      </Form>

      <Footer>
        <LinkText to="/auth/login">← Voltar ao login</LinkText>
      </Footer>
    </>
  );
}
