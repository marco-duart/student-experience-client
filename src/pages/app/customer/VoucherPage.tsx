import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Ticket, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
  Text,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { customerService } from "@/services/customer.service";
import { styled } from "@/theme/stitches.config";

const Canvas = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "$4",
  borderRadius: "$lg",
  border: "1px solid $divider",
  backgroundColor: "$bgPaper",
  minHeight: "380px",
  overflow: "auto",
});

const TicketImage = styled("img", {
  width: "100%",
  maxWidth: "860px",
  height: "auto",
  objectFit: "contain",
  borderRadius: "$md",
  boxShadow: "0 10px 28px rgba(0,43,92,0.14)",
});

export default function VoucherPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let localUrl: string | null = null;

    async function loadVoucher() {
      if (!token) {
        if (isMounted) {
          setError("Token do ingresso não informado.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const res = await customerService.fetchVoucherFile(token);

      if (!isMounted) return;

      if (!res.success || !res.blob) {
        setError(res.message || "Não foi possível carregar o ingresso.");
        setLoading(false);
        return;
      }

      localUrl = URL.createObjectURL(res.blob);
      setImageUrl(localUrl);
      setLoading(false);
    }

    loadVoucher();

    return () => {
      isMounted = false;
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [token]);

  return (
    <>
      <AppHeader title="Mostrar Ingresso" showBack />
      <PageContent>
        {loading ? (
          <Spinner fullScreen label="Baixando seu ingresso..." />
        ) : error ? (
          <EmptyState>
            <AlertTriangle size={48} color="var(--colors-error)" />
            <EmptyStateTitle>Falha ao carregar ingresso</EmptyStateTitle>
            <EmptyStateText>{error}</EmptyStateText>
          </EmptyState>
        ) : imageUrl ? (
          <>
            <Canvas>
              <TicketImage src={imageUrl} alt="Ingresso" />
            </Canvas>
            <Text size="xs" color="secondary" css={{ marginTop: "$2" }}>
              O ingresso é exibido em modo de visualização, como imagem PNG.
            </Text>
          </>
        ) : (
          <EmptyState>
            <Ticket size={48} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Ingresso indisponível</EmptyStateTitle>
            <EmptyStateText>
              Não foi possível localizar os dados do ingresso.
            </EmptyStateText>
          </EmptyState>
        )}
      </PageContent>
    </>
  );
}
