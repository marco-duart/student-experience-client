import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  XCircle,
  Calendar,
  RefreshCw,
  CheckSquare,
  Ticket,
  User,
} from "lucide-react";
import { customerService } from "@/services/customer.service";
import { useRoleTheme } from "@/hooks/use-role-theme";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  Section,
  SectionTitle,
  Col,
  Text,
} from "@/components/layout/PageLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { styled } from "@/theme/stitches.config";
import toast from "react-hot-toast";

const STATUS_MAP: Record<string, string> = {
  "1": "CONFIRMADO",
  "2": "PENDENTE DE CONFIRMAÇÃO",
  "3": "CANCELADO",
  "8": "PENDENTE FINANCEIRO",
  "10": "CANCELADO",
  "11": "CANCELADO",
  "12": "CANCELADO",
};

const getStatusText = (s: unknown) =>
  STATUS_MAP[String(s)] ?? STATUS_MAP[String(Number(s))] ?? "PENDENTE";

type StatusConfig = {
  bg: string;
  border: string;
  color: string;
  icon: ReactNode;
  message: string;
};

const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "CONFIRMADO":
      return {
        bg: "#E8F5E9",
        border: "#A5D6A7",
        color: "#2E7D32",
        icon: <CheckCircle size={28} color="#2E7D32" />,
        message: "Sua matrícula está confirmada! 🎉",
      };
    case "PENDENTE DE CONFIRMAÇÃO":
      return {
        bg: "#FFF8E1",
        border: "#FFE082",
        color: "#F57F17",
        icon: <Clock size={28} color="#F57F17" />,
        message:
          "Confirme sua matrícula ou solicite reagendamento com nossa equipe!",
      };
    case "PENDENTE FINANCEIRO":
      return {
        bg: "#FBE9E7",
        border: "#FFAB91",
        color: "#D32F2F",
        icon: <DollarSign size={28} color="#D32F2F" />,
        message: "Aguardando pagamento para confirmação da matrícula.",
      };
    case "CANCELADO":
      return {
        bg: "#FCE4EC",
        border: "#F48FB1",
        color: "#C2185B",
        icon: <XCircle size={28} color="#C2185B" />,
        message: "Esta matrícula foi cancelada.",
      };
    default:
      return {
        bg: "#F5F5F5",
        border: "#E0E0E0",
        color: "#616161",
        icon: <Clock size={28} color="#616161" />,
        message: "Aguardando confirmação da matrícula.",
      };
  }
};

const formatDate = (s?: string) => {
  if (!s) return "Data não disponível";
  try {
    return new Date(s).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "long",
    });
  } catch {
    return s;
  }
};

const AccentHeader = styled("div", {
  padding: "$4 $5",
  borderRadius: "$lg $lg 0 0",
  background:
    "linear-gradient(120deg, $primary 0%, $primaryLight 72%, #4f8fc2 100%)",
  border: "1px solid rgba(255,255,255,0.16)",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: "''",
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    right: "-70px",
    top: "-70px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 68%)",
    pointerEvents: "none",
  },

  "&::after": {
    content: "''",
    position: "absolute",
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    left: "-45px",
    bottom: "-45px",
    background:
      "radial-gradient(circle, rgba(197,160,89,0.24) 0%, rgba(197,160,89,0) 70%)",
    pointerEvents: "none",
  },
});

const AccentTitle = styled("p", {
  fontSize: "$lg",
  fontWeight: "$bold",
  color: "#fff",
  margin: "0 0 2px",
  position: "relative",
  zIndex: 1,
  textShadow: "0 2px 10px rgba(0,0,0,0.18)",
});

const AccentSub = styled("p", {
  fontSize: "$sm",
  color: "rgba(255,255,255,0.8)",
  margin: 0,
  position: "relative",
  zIndex: 1,
});

const StatusBanner = styled("div", {
  borderRadius: "$md",
  padding: "$4",
  border: "1.5px solid",
  display: "flex",
  alignItems: "flex-start",
  gap: "$3",
  marginBottom: "$4",
  backdropFilter: "blur(8px)",
  boxShadow: "0 10px 24px rgba(0,43,92,0.10)",
});

const StatusMsg = styled("p", {
  fontSize: "$sm",
  fontWeight: "$medium",
  lineHeight: 1.5,
  margin: 0,
});

const InfoRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3 0",
  borderBottom: "1px solid $divider",
  "&:last-child": { borderBottom: "none" },
  transition: "transform 0.18s ease, background 0.18s ease",

  "&:hover": {
    transform: "translateX(2px)",
    background:
      "linear-gradient(90deg, rgba(0,43,92,0.04) 0%, rgba(0,43,92,0) 75%)",
  },
});

const InfoLabel = styled("span", {
  fontSize: "$xs",
  fontWeight: "$semibold",
  color: "$textSecondary",
  minWidth: "90px",
  letterSpacing: "0.03em",
  textTransform: "uppercase",
});

const InfoValue = styled("span", {
  fontSize: "$sm",
  color: "$textPrimary",
  fontWeight: "$medium",
  flex: 1,
});

const ActionGrid = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$3",

  "@sm": {
    flexDirection: "row",
    flexWrap: "wrap",
    "& > *": { flex: "1 1 160px" },
  },
});

const StudentCard = styled("div", {
  border: "1.5px solid $divider",
  borderRadius: "$md",
  padding: "$4",
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.78) 100%)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 8px 24px rgba(0,43,92,0.10)",
  position: "relative",
  overflow: "hidden",
  transition:
    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background:
      "linear-gradient(120deg, rgba(197,160,89,0.09), rgba(14,107,168,0.05) 45%, transparent 72%)",
    pointerEvents: "none",
  },

  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(197,160,89,0.45)",
    boxShadow: "0 14px 28px rgba(0,43,92,0.15)",
  },
});

const StudentHead = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  position: "relative",
  zIndex: 1,
});

const StudentIconWrap = styled("div", {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(140deg, rgba(0,43,92,0.14), rgba(197,160,89,0.22))",
  border: "1px solid rgba(197,160,89,0.36)",
  flexShrink: 0,
});

const StatusPill = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "10px",
  fontWeight: "$bold",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "4px 9px",
  borderRadius: "$pill",
  width: "fit-content",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 14px rgba(0,43,92,0.08)",
  position: "relative",
  zIndex: 1,
});

const StatusDot = styled("span", {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  display: "inline-block",
  flexShrink: 0,
});

const StudentsList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

const statusPillColors: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  CONFIRMADO: { bg: "#E8F5E9", text: "#2E7D32", dot: "#2E7D32" },
  "PENDENTE DE CONFIRMAÇÃO": { bg: "#FFF8E1", text: "#F57F17", dot: "#F57F17" },
  "PENDENTE FINANCEIRO": { bg: "#FBE9E7", text: "#D32F2F", dot: "#D32F2F" },
  CANCELADO: { bg: "#FCE4EC", text: "#C2185B", dot: "#C2185B" },
  PENDENTE: { bg: "#F5F5F5", text: "#616161", dot: "#616161" },
};

const getStatusPillColors = (status: string) =>
  statusPillColors[status] ?? statusPillColors.PENDENTE;

export default function ClassroomDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useRoleTheme();
  const classroom = state?.classroom as Record<string, unknown> | undefined;
  const [confirmingByStudent, setConfirmingByStudent] = useState<
    Record<number, boolean>
  >({});

  if (!classroom) {
    return (
      <>
        <AppHeader title="Detalhes da Turma" showBack />
        <PageContent>
          <Text color="secondary" align="center">
            Turma não encontrada.
          </Text>
        </PageContent>
      </>
    );
  }

  const rawStudent = (classroom.student as Record<string, unknown>) ?? {};
  const allStudents: Record<string, unknown>[] = Array.isArray(
    classroom.students,
  )
    ? (classroom.students as Record<string, unknown>[])
    : Object.keys(rawStudent).length > 0
      ? [rawStudent]
      : [];
  const [students, setStudents] =
    useState<Record<string, unknown>[]>(allStudents);

  const uniqueStatuses = Array.from(
    new Set(
      students.map((student) =>
        getStatusText(student.status ?? classroom.status ?? "PENDENTE"),
      ),
    ),
  );

  const hasMixedStatuses = uniqueStatuses.length > 1;
  const summaryStatus = hasMixedStatuses
    ? "PENDENTE"
    : (uniqueStatuses[0] ?? "PENDENTE");
  const sc = getStatusConfig(summaryStatus);
  const accentColor = theme.roleAccent.main;

  const product = (classroom.product as Record<string, unknown>) ?? {};
  const productCode = String(
    classroom.product_code ?? product.codigo ?? classroom.productCode ?? "---",
  );
  const productName = String(
    product.nome ?? classroom.product_name ?? "Formação",
  );
  const codigoTurma = String(
    classroom.codigo_turma ?? classroom.code ?? classroom.id ?? "---",
  );
  const turmaId = Number(classroom.turma_id ?? classroom.id ?? 0);
  const eventStart = classroom.data_inicio
    ? new Date(String(classroom.data_inicio))
    : null;
  const eventStartMs =
    eventStart && !Number.isNaN(eventStart.getTime())
      ? eventStart.getTime()
      : null;
  const nowMs = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const buildStudentName = (student: Record<string, unknown>, index: number) =>
    String(
      student.nome_cracha ??
        student.nome ??
        student.name ??
        `Aluno ${index + 1}`,
    );

  const handleConfirm = async (studentId: number) => {
    if (!studentId) {
      toast.error("ID do aluno não encontrado.");
      return;
    }
    setConfirmingByStudent((prev) => ({ ...prev, [studentId]: true }));
    const res = await customerService.confirmStudent(studentId);
    setConfirmingByStudent((prev) => ({ ...prev, [studentId]: false }));
    if (res.success) {
      toast.success("Presença confirmada com sucesso!");
      setStudents((prev) =>
        prev.map((student) =>
          Number(student.id ?? 0) === studentId
            ? { ...student, status: "1" }
            : student,
        ),
      );
    } else {
      toast.error(res.message || "Não foi possível confirmar.");
    }
  };

  return (
    <>
      <AppHeader title="Detalhes da Turma" showBack />
      <PageContent>
        <AccentHeader css={{ backgroundColor: accentColor }}>
          <AccentTitle>{codigoTurma}</AccentTitle>
          <AccentSub>{productCode}</AccentSub>
        </AccentHeader>

        <StatusBanner
          css={{
            backgroundColor: sc.bg,
            borderColor: sc.border,
            marginTop: "$4",
          }}
        >
          {sc.icon}
          <Col css={{ gap: "$1" }}>
            <Text weight="semibold" size="sm" css={{ color: sc.color }}>
              {hasMixedStatuses ? "Situações diferentes" : summaryStatus}
            </Text>
            <StatusMsg css={{ color: sc.color }}>
              {hasMixedStatuses
                ? "Cada aluno desta turma pode ter uma situação diferente. As ações abaixo são individuais."
                : sc.message}
            </StatusMsg>
          </Col>
        </StatusBanner>

        <Section>
          <SectionTitle>Informações</SectionTitle>
          <Card flat>
            <CardBody>
              <InfoRow>
                <Calendar size={16} color="var(--colors-textSecondary)" />
                <InfoLabel>Formação</InfoLabel>
                <InfoValue>{productName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <BookOpen size={16} color="var(--colors-textSecondary)" />
                <InfoLabel>Turma</InfoLabel>
                <InfoValue>{codigoTurma}</InfoValue>
              </InfoRow>
              {Boolean(classroom.data_inicio) && (
                <InfoRow>
                  <Calendar size={16} color="var(--colors-textSecondary)" />
                  <InfoLabel>Início</InfoLabel>
                  <InfoValue>
                    {formatDate(String(classroom.data_inicio))}
                  </InfoValue>
                </InfoRow>
              )}
              {Boolean(classroom.data_fim) && (
                <InfoRow>
                  <Calendar size={16} color="var(--colors-textSecondary)" />
                  <InfoLabel>Fim</InfoLabel>
                  <InfoValue>
                    {formatDate(String(classroom.data_fim))}
                  </InfoValue>
                </InfoRow>
              )}
              <InfoRow>
                <InfoLabel>Alunos</InfoLabel>
                <InfoValue>{students.length || 0}</InfoValue>
              </InfoRow>
            </CardBody>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Ações por aluno</SectionTitle>
          <StudentsList>
            {students.map((student, index) => {
              const studentId = Number(student.id ?? 0);
              const studentName = buildStudentName(student, index);
              const studentStatus = getStatusText(
                student.status ?? classroom.status ?? "PENDENTE",
              );
              const pill = getStatusPillColors(studentStatus);
              const isConfirmable = studentStatus === "PENDENTE DE CONFIRMAÇÃO";
              const msUntilEvent =
                eventStartMs !== null ? eventStartMs - nowMs : null;
              const isAtLeastOneDayBeforeEvent =
                msUntilEvent !== null && msUntilEvent >= oneDayMs;
              const isWithinOneDayBeforeEvent =
                msUntilEvent !== null &&
                msUntilEvent <= oneDayMs &&
                msUntilEvent >= 0;
              const canTransferTicket =
                student.transferred === false && isAtLeastOneDayBeforeEvent;
              const canConfirmPresence =
                isConfirmable && isWithinOneDayBeforeEvent;
              const voucherUrl = String(student.voucher ?? "");

              return (
                <StudentCard key={`${studentId || index}-${studentName}`}>
                  <StudentHead>
                    <StudentIconWrap>
                      <User size={15} color="var(--colors-primary)" />
                    </StudentIconWrap>
                    <Text weight="semibold" size="sm">
                      {studentName}
                    </Text>
                  </StudentHead>

                  <StatusPill
                    css={{ backgroundColor: pill.bg, color: pill.text }}
                  >
                    <StatusDot css={{ backgroundColor: pill.dot }} />
                    {studentStatus}
                  </StatusPill>

                  <ActionGrid>
                    {canConfirmPresence && (
                      <Button
                        variant="primary"
                        leftIcon={<CheckSquare size={16} />}
                        loading={Boolean(confirmingByStudent[studentId])}
                        onClick={() => handleConfirm(studentId)}
                      >
                        Confirmar presença
                      </Button>
                    )}

                    {canTransferTicket && (
                      <Button
                        variant="secondary"
                        leftIcon={<RefreshCw size={16} />}
                        onClick={() =>
                          navigate(`/app/customer/transfer/${studentId}`, {
                            state: {
                              student: {
                                ...student,
                                nome: studentName,
                                nome_cracha: studentName,
                              },
                              classroom: {
                                id: turmaId,
                                turma_id: turmaId,
                                codigo_turma: codigoTurma,
                                data_inicio: classroom.data_inicio,
                                data_fim: classroom.data_fim,
                              },
                            },
                          })
                        }
                      >
                        Transferir ingresso
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      leftIcon={<Calendar size={16} />}
                      onClick={() => {
                        window.location.hash = "#/app/call-consultant";
                      }}
                    >
                      Reagendar aluno
                    </Button>

                    {voucherUrl && (
                      <Button
                        variant="gold"
                        leftIcon={<Ticket size={16} />}
                        css={{
                          fontWeight: "$bold",
                          letterSpacing: "0.02em",
                          boxShadow: "0 10px 24px rgba(197,160,89,0.32)",
                          border: "1px solid rgba(255,255,255,0.24)",
                          "&:hover:not(:disabled)": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 14px 28px rgba(197,160,89,0.38)",
                          },
                        }}
                        onClick={() =>
                          navigate(
                            `/app/customer/voucher?token=${encodeURIComponent(voucherUrl)}`,
                          )
                        }
                      >
                        Mostrar ingresso
                      </Button>
                    )}
                  </ActionGrid>
                </StudentCard>
              );
            })}
          </StudentsList>
        </Section>
      </PageContent>
    </>
  );
}
