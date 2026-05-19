import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { courseService } from "@/services/course.service";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/layout/PageLayout";

type CourseItem = {
  id: number;
  nome: string;
  codigo: string;
  tipo: number;
  service_type: number;
  classificacao: number;
};

const SERVICE_TYPE_MAP: Record<number, string> = {
  1: "EVENTO",
  2: "TRILHA",
  3: "BIBLIOTECA",
  4: "CURTA DURAÇÃO",
  5: "TRILHA GUIADA",
  6: "TRILHA AVANÇADA",
  7: "TRILHA COMPLEMENTAR",
  8: "ACESSO",
  9: "ACESSO COMPLEMENTAR - MBA",
  10: "BÔNUS",
  11: "CONTEÚDO EXTRA",
  12: "ACESSO COMPLEMENTAR - PÓS",
  13: "ACESSO COMPLEMENTAR - MBA E PÓS",
  14: "TRILHA COMPLEMENTAR - PÓS",
  15: "EMPRESARIAL",
  16: "PRODUTO",
  17: "TRILHA PREMIUM",
  18: "REATIVAÇÃO CURTA",
  19: "REATIVAÇÃO TRILHA",
  20: "CONTEÚDO TRILHA",
  21: "CONTEÚDO CURTO",
  22: "JANELA FECHADA TRILHA",
  23: "JANELA FECHADA CURTA",
};

const CourseList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  padding: "$4",
});

const CourseCard = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$md",
  padding: "$4",
  border: "1px solid $divider",
  cursor: "pointer",
  transition: "all 0.15s ease",
  display: "flex",
  gap: "$3",
  alignItems: "flex-start",

  "&:hover": {
    boxShadow: "0 4px 16px rgba(0,43,92,0.10)",
    transform: "translateY(-1px)",
  },
  "&:active": { transform: "scale(0.98)" },
});

const CourseIcon = styled("div", {
  width: "44px",
  height: "44px",
  borderRadius: "$md",
  background: "linear-gradient(135deg, $primary, $primaryLight)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: "2px",
});

const CourseInfo = styled("div", {
  flex: 1,
  minWidth: 0,
});

const CourseName = styled("h3", {
  fontSize: "$sm",
  fontWeight: "$bold",
  color: "$textPrimary",
  margin: "0 0 4px",
  lineHeight: 1.3,
});

const CourseCode = styled("span", {
  fontSize: "$xs",
  color: "$textDisabled",
  fontFamily: "monospace",
  display: "block",
  marginBottom: "$2",
});

const TagRow = styled("div", {
  display: "flex",
  gap: "$2",
  flexWrap: "wrap",
});

const CountBadge = styled("div", {
  padding: "$2 $5",
  backgroundColor: "rgba(0,43,92,0.06)",
  borderRadius: "$sm",
  fontSize: "$xs",
  color: "$textSecondary",
  fontWeight: "$medium",
  textAlign: "center",
});

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await courseService.getAll();

      if (!res.success) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const contentArray = Array.isArray(res.data) ? res.data : [];

      const mapped = contentArray
        .filter(
          (item): item is Record<string, unknown> =>
            item !== null &&
            typeof item === "object" &&
            "id" in item &&
            "nome" in item &&
            "codigo" in item,
        )
        .map((item) => ({
          id: Number(item.id),
          nome: String(item.nome),
          codigo: String(item.codigo),
          tipo: Number(item.tipo ?? 1),
          service_type: Number(item.service_type ?? 2),
          classificacao: Number(item.classificacao ?? 2),
        }))
        .filter(
          (item): item is CourseItem =>
            Number.isFinite(item.id) &&
            item.id > 0 &&
            item.nome.length > 0 &&
            item.codigo.length > 0,
        );

      setCourses(mapped);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <>
      <AppHeader title="Catálogo" subtitle="Explore os módulos disponíveis no protótipo" />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando cursos..." />
        ) : courses.length === 0 ? (
          <EmptyState>
            <BookOpen size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Nenhum conteúdo encontrado</EmptyStateTitle>
            <EmptyStateText>
              Os conteúdos disponíveis aparecerão aqui.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <CourseList>
            <CountBadge>{courses.length} conteúdo(s) disponível(is)</CountBadge>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                onClick={() =>
                  navigate("/app/courses/detail", { state: { course } })
                }
              >
                <CourseIcon>
                  <BookOpen size={20} color="#fff" />
                </CourseIcon>
                <CourseInfo>
                  <CourseName>{course.nome}</CourseName>
                  <CourseCode>{course.codigo}</CourseCode>
                  <TagRow>
                    {SERVICE_TYPE_MAP[course.service_type] && (
                      <Badge color="primary">
                        {SERVICE_TYPE_MAP[course.service_type]}
                      </Badge>
                    )}
                    <Badge color="secondary">
                      {course.classificacao === 1 ? "PRODUTO" : "CONTEÚDO"}
                    </Badge>
                  </TagRow>
                </CourseInfo>
              </CourseCard>
            ))}
          </CourseList>
        )}
      </PageContent>
    </>
  );
}
