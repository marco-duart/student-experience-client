import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Calendar, ChevronRight } from "lucide-react";
import { customerService } from "@/services/customer.service";
import { useAuth } from "@/contexts/auth-context";
import { useRoleTheme } from "@/hooks/use-role-theme";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
  Col,
  Text,
  Row,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { styled } from "@/theme/stitches.config";

type OrderItem = {
  id: number;
  codigo: string;
  data_venda: string;
  valor_total: string | number;
  status: number;
  in_cancellation_process?: boolean;
  products?: Array<{ id?: number | string; nome?: string }>;
  students?: Array<Record<string, unknown>>;
  installments?: Array<Record<string, unknown>>;
};

const STATUS_MAP: Record<
  number,
  { label: string; color: "success" | "warning" | "error" | "neutral" }
> = {
  5: { label: "PENDENTE", color: "warning" },
  6: { label: "AGUARDANDO RECEBIMENTO", color: "warning" },
  7: { label: "ATRASADO", color: "error" },
  8: { label: "CONFIRMADO", color: "success" },
  10: { label: "CANCELADO", color: "neutral" },
};

const getStatusDotColor = (order: OrderItem): string => {
  if (order.in_cancellation_process) return "#9E9E9E";
  if (order.status === 8) return "#4CAF50";
  if (order.status === 7) return "#F44336";
  if (order.status === 6) return "#FFC107";
  if (order.status === 5) return "#4CAF50";
  return "#FFC107";
};

const StatusDot = styled("span", {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  display: "inline-block",
});

const OrderCard = styled("div", {
  padding: "$4 $5",
  borderBottom: "1px solid $divider",
  cursor: "pointer",
  display: "flex",
  gap: "$3",
  alignItems: "center",
  transition: "background 0.12s ease",
  "&:hover": { backgroundColor: "rgba(0,43,92,0.03)" },
  "&:active": { backgroundColor: "rgba(0,43,92,0.06)" },
});

const OrderIconWrap = styled("div", {
  width: "44px",
  height: "44px",
  borderRadius: "$md",
  background: "linear-gradient(135deg, $primary, $primaryLight)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export default function OrdersPage() {
  const { user } = useAuth();
  const theme = useRoleTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.customerId) {
      setLoading(false);
      return;
    }
    customerService.fetchOrders(user.customerId).then((res) => {
      if (res.success) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setOrders(
          arr.map((o) => {
            const item = o as Record<string, unknown>;
            return {
              id: Number(item.id ?? 0),
              codigo: String(item.codigo ?? ""),
              data_venda: String(item.data_venda ?? ""),
              valor_total: item.valor_total as string | number,
              status: Number(item.status ?? 1),
              in_cancellation_process: Boolean(item.in_cancellation_process),
              products: Array.isArray(item.products)
                ? (item.products as Array<{ id?: number | string; nome?: string }>)
                : undefined,
              students: Array.isArray(item.students)
                ? (item.students as Array<Record<string, unknown>>)
                : undefined,
              installments: Array.isArray(item.installments)
                ? (item.installments as Array<Record<string, unknown>>)
                : undefined,
            };
          }),
        );
      }
      setLoading(false);
    });
  }, [user]);

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

  return (
    <>
      <AppHeader title="Meus Pedidos" showBack />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando pedidos..." />
        ) : orders.length === 0 ? (
          <EmptyState>
            <ShoppingCart size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem pedidos</EmptyStateTitle>
            <EmptyStateText>Seus pedidos aparecerão aqui.</EmptyStateText>
          </EmptyState>
        ) : (
          <div>
            {orders.map((order) => {
              const status = order.in_cancellation_process
                ? { label: "CANCELADO", color: "neutral" as const }
                : (STATUS_MAP[order.status] ?? {
                    label: "PENDENTE",
                    color: "warning" as const,
                  });

              const firstProduct = order.products?.[0]?.nome;

              return (
                <OrderCard
                  key={order.id}
                  onClick={() =>
                    navigate("/app/customer/orders/" + order.id, {
                      state: { order },
                    })
                  }
                >
                  <OrderIconWrap>
                    <ShoppingCart size={20} color="#fff" />
                  </OrderIconWrap>
                  <Col css={{ flex: 1, gap: "$1" }}>
                    <Row justify="between">
                      <Text
                        weight="semibold"
                        size="sm"
                        css={{ color: theme.roleAccent.main }}
                      >
                        {order.codigo}
                      </Text>
                      <Row css={{ gap: "$2" }}>
                        <StatusDot
                          css={{ backgroundColor: getStatusDotColor(order) }}
                        />
                        <Badge color={status.color}>{status.label}</Badge>
                      </Row>
                    </Row>
                    {firstProduct ? (
                      <Text size="xs" color="primary" weight="medium">
                        {firstProduct}
                      </Text>
                    ) : null}
                    <Text
                      size="xs"
                      color="secondary"
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={12} /> {formatDate(order.data_venda)}
                    </Text>
                    <Text weight="semibold" color="brand" size="sm">
                      {formatCurrency(order.valor_total)}
                    </Text>
                  </Col>
                  <ChevronRight size={18} color="var(--colors-textDisabled)" />
                </OrderCard>
              );
            })}
          </div>
        )}
      </PageContent>
    </>
  );
}
