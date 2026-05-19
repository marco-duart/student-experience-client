import { useEffect, useState } from "react";
import { UserCheck, Phone, Mail } from "lucide-react";
import { coacheeService } from "@/services/coachee.service";
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

type CoachItem = { id: number; name: string; email: string; phone?: string };

export default function CoachesPage() {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    coacheeService.fetchCoaches(user.id).then((res) => {
      if (res.success) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setCoaches(
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
      <AppHeader title="Meu Coach" showBack />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando..." />
        ) : coaches.length === 0 ? (
          <EmptyState>
            <UserCheck size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem coaches vinculados</EmptyStateTitle>
            <EmptyStateText>
              Você não possui coaches vinculados ainda.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <div>
            {coaches.map((c) => (
              <ListItem key={c.id}>
                <Avatar
                  css={{ backgroundColor: "var(--colors-secondaryDark)" }}
                >
                  {getInitials(c.name)}
                </Avatar>
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
