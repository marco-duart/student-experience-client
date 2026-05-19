import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  Section,
  SectionTitle,
  Col,
  Text,
} from "@/components/layout/PageLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { useRoleTheme } from "@/hooks/use-role-theme";

type Installment = {
  id: number | string;
  numero_parcela?: number;
  valor_parcela?: string | number;
  valor_total?: string | number;
  data_vencimento: string;
  situacao: string | number;
};

type Product = {
  id: number | string;
  codigo?: string;
  nome?: string;
  situacao?: string;
};

type Student = {
  id: number | string;
  nome?: string;
  nome_cracha?: string;
  turma_id?: number | string;
  produto_id?: number | string;
};

const ORDER_STATUS_MAP: Record<number, string> = {
  5: "PENDENTE",
  6: "AGUARDANDO RECEBIMENTO",
  7: "ATRASADO",
  8: "CONFIRMADO",
  10: "CANCELADO",
};

const INSTALLMENT_STATUS_MAP: Record<number, string> = {
  1: "A RECEBER",
  2: "PAGO",
  3: "VENCIDO",
  5: "RECEBIDO",
  6: "DEVOLVIDO",
  7: "ESTORNADO",
  8: "CANCELADO",
};

const InfoRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "$3 0",
  borderBottom: "1px solid $divider",
  "&:last-child": { borderBottom: "none" },
});

const Label = styled("span", { fontSize: "$xs", color: "$textSecondary" });
const Value = styled("span", {
  fontSize: "$sm",
  fontWeight: "$medium",
  color: "$textPrimary",
  textAlign: "right",
  maxWidth: "60%",
});

const StatusPill = styled("span", {
  padding: "4px 10px",
  borderRadius: "$pill",
  fontSize: "$xs",
  fontWeight: "$bold",
  letterSpacing: "0.03em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function OrderDetailPage() {
  const { state } = useLocation();
  const theme = useRoleTheme();
  const order = state?.order as Record<string, unknown> | undefined;

  if (!order) {
    return (
      <>
        <AppHeader title="Detalhes do Pedido" showBack />
        <PageContent>
          <Text color="secondary">Pedido não encontrado.</Text>
        </PageContent>
      </>
    );
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("pt-BR");
    } catch {
      return d;
    }
  };

  const formatCurrency = (v: string | number) => {
    const num = typeof v === "number" ? v : parseFloat(String(v));
    if (isNaN(num)) return String(v);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const installments: Installment[] = Array.isArray(order.installments)
    ? (order.installments as Installment[])
    : [];
  const products: Product[] = Array.isArray(order.products)
    ? (order.products as Product[])
    : [];
  const students: Student[] = Array.isArray(order.students)
    ? (order.students as Student[])
    : [];
  const productById = new Map(
    products.map((product) => [String(product.id), product]),
  );
  const studentsByClassroom = students.reduce<Record<string, Student[]>>(
    (acc, student) => {
      const turmaKey = String(student.turma_id ?? "sem-turma");
      if (!acc[turmaKey]) acc[turmaKey] = [];
      acc[turmaKey].push(student);
      return acc;
    },
    {},
  );
  const classroomEntries = Object.entries(studentsByClassroom);

  const orderStatus = Number(order.status ?? 0);
  const inCancellationProcess = Boolean(order.in_cancellation_process);

  const overallStatus = inCancellationProcess
    ? "CANCELADO"
    : (ORDER_STATUS_MAP[orderStatus] ?? "DESCONHECIDO");

  const getOrderStatusStyle = () => {
    if (inCancellationProcess) return { bg: "#F2F2F2", color: "#616161" };
    if (orderStatus === 8) return { bg: "#E8F5E9", color: "#2E7D32" };
    if (orderStatus === 7) return { bg: "#FFEBEE", color: "#C62828" };
    if (orderStatus === 6) return { bg: "#FFF8E1", color: "#F57F17" };
    return { bg: "#FFF8E1", color: "#F57F17" };
  };

  const getInstallmentStatusColor = (situacao: number | string) => {
    const status = Number(situacao);
    if (status === 5 || status === 2) return theme.palette.status.success;
    if (status === 3) return theme.palette.status.error;
    if (status === 8 || status === 6 || status === 7) return "#9E9E9E";
    return theme.palette.status.warning;
  };

  return (
    <>
      <AppHeader title={`Pedido #${String(order.codigo ?? "")}`} showBack />
      <PageContent>
        <Section>
          <Card>
            <CardBody>
              <InfoRow>
                <Label>Código</Label>
                <Value>#{String(order.codigo ?? "")}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Data da venda</Label>
                <Value>{formatDate(String(order.data_venda ?? ""))}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Status</Label>
                <StatusPill
                  css={{
                    backgroundColor: getOrderStatusStyle().bg,
                    color: getOrderStatusStyle().color,
                  }}
                >
                  {overallStatus}
                </StatusPill>
              </InfoRow>
              <InfoRow>
                <Label>Valor total</Label>
                <Value
                  css={{ color: "var(--colors-primary)", fontWeight: "700" }}
                >
                  {formatCurrency(order.valor_total as string | number)}
                </Value>
              </InfoRow>
            </CardBody>
          </Card>
        </Section>

        {products.length > 0 && (
          <Section>
            <SectionTitle>Produtos</SectionTitle>
            <Card>
              <CardBody>
                {products.map((p, idx) => (
                  <InfoRow key={idx}>
                    <Label css={{ flex: 1, textAlign: "left" }}>
                      {p.codigo ? `${p.codigo} - ` : ""}
                      {p.nome ?? `Produto ${idx + 1}`}
                    </Label>
                    <Value
                      css={{
                        textDecoration: String(p.situacao ?? "").includes(
                          "CANCEL",
                        )
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {String(p.situacao ?? "") || "ATIVO"}
                    </Value>
                  </InfoRow>
                ))}
              </CardBody>
            </Card>
          </Section>
        )}

        {installments.length > 0 && (
          <Section>
            <SectionTitle>Parcelas</SectionTitle>
            <Card>
              <CardBody>
                {installments.map((inst, idx) => (
                  <InfoRow key={idx}>
                    <Col>
                      <Label>Parcela {inst.numero_parcela ?? idx + 1}</Label>
                      <Text size="xs" color="secondary">
                        {formatDate(String(inst.data_vencimento ?? ""))}
                      </Text>
                      <Text
                        size="xs"
                        weight="semibold"
                        css={{
                          color: getInstallmentStatusColor(inst.situacao),
                        }}
                      >
                        {INSTALLMENT_STATUS_MAP[Number(inst.situacao)] ??
                          "DESCONHECIDO"}
                      </Text>
                    </Col>
                    <Value>
                      {formatCurrency(
                        inst.valor_parcela ?? inst.valor_total ?? 0,
                      )}
                    </Value>
                  </InfoRow>
                ))}
              </CardBody>
            </Card>
          </Section>
        )}

        {students.length > 0 && (
          <Section>
            <SectionTitle>Alunos e turmas</SectionTitle>
            <Card>
              <CardBody>
                {classroomEntries.map(([turmaKey, turmaStudents], turmaIdx) => {
                  const firstStudent = turmaStudents[0];
                  const product = firstStudent?.produto_id
                    ? productById.get(String(firstStudent.produto_id))
                    : undefined;
                  const turmaTitle =
                    turmaKey === "sem-turma" ? "Turma não informada" : `Turma ${turmaKey}`;

                  return (
                    <div key={turmaKey}>
                      <Text
                        size="xs"
                        weight="semibold"
                        css={{
                          color: "var(--colors-textSecondary)",
                          marginTop: turmaIdx > 0 ? "$4" : "$0",
                          marginBottom: "$2",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {turmaTitle}
                        {product?.nome ? ` • ${product.nome}` : ""}
                      </Text>

                      {turmaStudents.map((s, idx) => (
                        <InfoRow key={`${turmaKey}-${s.id}-${idx}`}>
                          <Label css={{ flex: 1, textAlign: "left" }}>
                            {String(s.nome_cracha ?? s.nome ?? `Aluno ${idx + 1}`)}
                          </Label>
                          <ChevronRight
                            size={16}
                            color="var(--colors-textDisabled)"
                          />
                        </InfoRow>
                      ))}
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </Section>
        )}
      </PageContent>
    </>
  );
}
