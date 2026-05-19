import { useEffect, useState } from "react";
import { Users, Phone, Mail } from "lucide-react";
import { coachService } from "@/services/coach.service";
import { useAuth } from "@/contexts/auth-context";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
  ListItem,
  Avatar,
  Col,
  Text,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";

type CoacheeItem = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

export default function CoacheesPage() {
  const { user } = useAuth();
  const [coachees, setCoachees] = useState<CoacheeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    coachService.fetchCoachees(user.id).then((res) => {
      if (res.success) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setCoachees(
          arr.map((c) => {
            const item = c as Record<string, unknown>;
            return {
              id: Number(item.id ?? 0),
              name: String(item.name ?? ""),
              email: String(item.email ?? ""),
              phone: item.phone ? String(item.phone) : undefined,
            };
          }),
        );
      }
      setLoading(false);
    });
  }, [user]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <>
      <AppHeader title="Meus Coachees" showBack />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando..." />
        ) : coachees.length === 0 ? (
          <EmptyState>
            <Users size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem coachees</EmptyStateTitle>
            <EmptyStateText>
              Você não possui coachees vinculados ainda.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <div>
            {coachees.map((c) => (
              <ListItem key={c.id}>
                <Avatar>{getInitials(c.name)}</Avatar>
                <Col css={{ flex: 1, gap: "$1" }}>
                  <Text weight="semibold">{c.name}</Text>
                  <Text
                    size="xs"
                    color="secondary"
                    css={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Mail size={12} /> {c.email}
                  </Text>
                  {c.phone && (
                    <Text
                      size="xs"
                      color="secondary"
                      css={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Phone size={12} /> {c.phone}
                    </Text>
                  )}
                </Col>
              </ListItem>
            ))}
          </div>
        )}
      </PageContent>
    </>
  );
}
