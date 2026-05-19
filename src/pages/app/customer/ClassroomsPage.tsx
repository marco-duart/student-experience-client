import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Users } from "lucide-react";
import { customerService } from "@/services/customer.service";
import { useAuth } from "@/contexts/auth-context";
import { useRoleTheme } from "@/hooks/use-role-theme";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { styled } from "@/theme/stitches.config";

const STATUS_MAP: Record<string, string> = {
  "1": "CONFIRMADO",
  "2": "PENDENTE DE CONFIRMAÇÃO",
  "3": "CANCELADO",
  "8": "PENDENTE FINANCEIRO",
  "10": "CANCELADO",
  "11": "CANCELADO",
  "12": "CANCELADO",
};

const getStatusText = (status: unknown): string =>
  STATUS_MAP[String(status)] ??
  STATUS_MAP[String(Number(status))] ??
  "PENDENTE";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    CONFIRMADO: { bg: "#E8F5E9", text: "#2E7D32", dot: "#2E7D32" },
    "PENDENTE DE CONFIRMAÇÃO": {
      bg: "#FFF8E1",
      text: "#F57F17",
      dot: "#F57F17",
    },
    "PENDENTE FINANCEIRO": { bg: "#FBE9E7", text: "#D32F2F", dot: "#D32F2F" },
    CANCELADO: { bg: "#FCE4EC", text: "#C2185B", dot: "#C2185B" },
    PENDENTE: { bg: "#F5F5F5", text: "#616161", dot: "#616161" },
  };

const getStatusColor = (s: string) =>
  STATUS_COLORS[s] ?? STATUS_COLORS["PENDENTE"];

const CardList = styled("div", {
  padding: "$4",
  display: "flex",
  flexDirection: "column",
  gap: "$3",

  "@md": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "$4",
    padding: "$5",
  },
  "@lg": { gridTemplateColumns: "repeat(3, 1fr)" },
});

const ClassCard = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$lg",
  overflow: "hidden",
  border: "1.5px solid $divider",
  cursor: "pointer",
  transition: "transform 0.15s, box-shadow 0.15s",
  display: "flex",
  flexDirection: "column",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,43,92,0.12)",
  },
  "&:active": { transform: "scale(0.98)" },
});

const CardAccent = styled("div", {
  height: "4px",
  width: "100%",
});

const CardBody = styled("div", {
  padding: "$4",
  display: "flex",
  gap: "$3",
  alignItems: "flex-start",
});

const IconCircle = styled("div", {
  width: "44px",
  height: "44px",
  borderRadius: "$md",
  background: "linear-gradient(135deg, $primary, $primaryLight)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const Info = styled("div", { flex: 1, minWidth: 0 });

const ProductCode = styled("p", {
  fontSize: "$xs",
  fontWeight: "$bold",
  margin: "0 0 2px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const ProductName = styled("p", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: "0 0 4px",
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const Meta = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  margin: "0 0 2px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

const StatusPill = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "10px",
  fontWeight: "$bold",
  letterSpacing: "0.04em",
  padding: "3px 8px",
  borderRadius: "$pill",
  marginTop: "$1",
});

const StatusDot = styled("span", {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  display: "inline-block",
  flexShrink: 0,
});

const DupBadge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "22px",
  height: "22px",
  borderRadius: "$pill",
  padding: "0 6px",
  fontSize: "11px",
  fontWeight: "$bold",
  backgroundColor: "$primary",
  color: "#fff",
  marginLeft: "$2",
});

type ClassItem = {
  id: number;
  codigo_turma: string;
  product_name: string;
  product_code: string;
  student_name: string;
  student_count: number;
  status: string;
  duplicate_count: number;
  raw: Record<string, unknown>;
};

export default function ClassroomsPage() {
  const { user } = useAuth();
  const theme = useRoleTheme();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.customerId) {
      setLoading(false);
      return;
    }

    customerService.fetchClassrooms(user.customerId).then((res) => {
      if (!res.success) {
        setLoading(false);
        return;
      }

      const arr: Record<string, unknown>[] = Array.isArray(res.data)
        ? res.data
        : [];

      const mapped: ClassItem[] = arr.map((raw, idx) => {
        const product = (raw.product as Record<string, unknown>) ?? {};
        const student = (raw.student as Record<string, unknown>) ?? {};
        const allStudents: Record<string, unknown>[] = Array.isArray(
          raw.students,
        )
          ? (raw.students as Record<string, unknown>[])
          : student
            ? [student]
            : [];

        const statusRaw = student.status ?? raw.status ?? "PENDENTE";
        const statusText = getStatusText(statusRaw);

        return {
          id: Number(raw.id ?? raw.turma_id ?? idx + 1),
          codigo_turma: String(
            raw.codigo_turma ?? raw.code ?? raw.id ?? `Turma ${idx + 1}`,
          ),
          product_name: String(product.nome ?? "Formação"),
          product_code: String(product.codigo ?? "---"),
          student_name: String(student.nome_cracha ?? student.nome ?? "Aluno"),
          student_count: allStudents.length || 1,
          status: statusText,
          duplicate_count: Number(student.duplicate_count ?? 1),
          raw,
        };
      });

      setClassrooms(mapped);
      setLoading(false);
    });
  }, [user]);

  const accentColor = theme.roleAccent.main;

  return (
    <>
      <AppHeader
        title="Minhas Turmas"
        subtitle="Acompanhe suas formações"
      />

      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando turmas..." />
        ) : classrooms.length === 0 ? (
          <EmptyState>
            <BookOpen size={44} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem turmas</EmptyStateTitle>
            <EmptyStateText>
              Suas turmas aparecerão aqui assim que disponíveis.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <CardList>
            {classrooms.map((cls) => {
              const sc = getStatusColor(cls.status);
              return (
                <ClassCard
                  key={`${cls.id}-${cls.codigo_turma}`}
                  onClick={() =>
                    navigate(`/app/customer/classrooms/${cls.id}`, {
                      state: { classroom: cls.raw },
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate(`/app/customer/classrooms/${cls.id}`, {
                      state: { classroom: cls.raw },
                    })
                  }
                >
                  <CardAccent css={{ backgroundColor: accentColor }} />
                  <CardBody>
                    <IconCircle>
                      <BookOpen size={20} color="#fff" />
                    </IconCircle>
                    <Info>
                      <ProductCode css={{ color: accentColor }}>
                        {cls.product_code}
                        {cls.duplicate_count > 1 && (
                          <DupBadge>{cls.duplicate_count}</DupBadge>
                        )}
                      </ProductCode>
                      <ProductName title={cls.product_name}>
                        {cls.product_name}
                      </ProductName>
                      <Meta>{cls.student_name}</Meta>
                      <Meta>
                        <Users size={12} />
                        {cls.student_count} aluno(s) · Turma: {cls.codigo_turma}
                      </Meta>
                      <StatusPill
                        css={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        <StatusDot css={{ backgroundColor: sc.dot }} />
                        {cls.status}
                      </StatusPill>
                    </Info>
                    <ChevronRight
                      size={18}
                      color="var(--colors-textDisabled)"
                    />
                  </CardBody>
                </ClassCard>
              );
            })}
          </CardList>
        )}
      </PageContent>
    </>
  );
}
