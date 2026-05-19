import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { accountService } from "@/services/user.service";
import { useAuth } from "@/contexts/auth-context";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";

type NotifItem = {
  account_notification_id: number;
  notification_id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

const NotifCard = styled("div", {
  display: "flex",
  gap: "$3",
  padding: "$4",
  borderBottom: "1px solid $divider",
  cursor: "pointer",
  transition: "background 0.12s ease",
  "&:active": { backgroundColor: "rgba(0,43,92,0.04)" },

  variants: {
    unread: {
      true: { backgroundColor: "rgba(0,43,92,0.03)" },
    },
  },
});

const NotifDotWrap = styled("div", {
  paddingTop: "5px",
  flexShrink: 0,
});

const NotifDot = styled("div", {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "$primary",

  variants: {
    hidden: {
      true: { opacity: 0 },
    },
  },
});

const NotifContent = styled("div", { flex: 1, minWidth: 0 });

const NotifTitle = styled("p", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: "0 0 3px",
  lineHeight: 1.4,
});

const NotifBody = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  margin: 0,
  lineHeight: 1.5,
});

const NotifTime = styled("span", {
  fontSize: "10px",
  color: "$textDisabled",
  display: "block",
  marginTop: "4px",
});

const ReadButton = styled("button", {
  borderRadius: "$pill",
  border: "1px solid $divider",
  padding: "5px 10px",
  fontSize: "11px",
  fontWeight: "$semibold",
  color: "$primary",
  backgroundColor: "#fff",
  flexShrink: 0,
  alignSelf: "center",
  "&:hover": {
    backgroundColor: "rgba(0,43,92,0.04)",
  },
});

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const res = await accountService.listNotifications({
      account_id: user.id,
      page: 1,
      limit: 50,
    });

    if (res.success && res.data) {
      const root = res.data as Record<string, unknown>;
      const container = (root.notifications ?? {}) as Record<string, unknown>;
      const items = Array.isArray(container.data) ? container.data : [];
      const meta = (root.meta ?? {}) as Record<string, unknown>;

      const mapped = items.map((item) => {
        const it = item as Record<string, unknown>;
        const attrs = (it.attributes ?? {}) as Record<string, unknown>;
        return {
          account_notification_id: Number(it.id ?? 0),
          notification_id: Number(attrs.notification_id ?? 0),
          title: String(attrs.title ?? ""),
          body: String(attrs.body ?? ""),
          read: Boolean(attrs.read),
          created_at: String(attrs.created_at ?? ""),
        };
      });

      setNotifications(mapped);
      const unreadFromMeta = Number(meta.unread_count ?? NaN);
      setUnreadCount(
        Number.isFinite(unreadFromMeta)
          ? unreadFromMeta
          : mapped.filter((n) => !n.read).length,
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const markAsRead = async (notif: NotifItem) => {
    if (!user || notif.read) return;
    const res = await accountService.updateNotification({
      account_id: user.id,
      notification_id: notif.account_notification_id,
      read: true,
    });
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.account_notification_id === notif.account_notification_id
            ? { ...n, read: true }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <>
      <AppHeader
        title="Notificações"
        right={
          unreadCount > 0 ? (
            <Badge color="error">{unreadCount} não lida(s)</Badge>
          ) : undefined
        }
      />
      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando..." />
        ) : notifications.length === 0 ? (
          <EmptyState>
            <Bell size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem notificações</EmptyStateTitle>
            <EmptyStateText>Você está em dia!</EmptyStateText>
          </EmptyState>
        ) : (
          <div>
            {notifications.map((notif) => (
              <NotifCard
                key={notif.account_notification_id}
                unread={!notif.read}
              >
                <NotifDotWrap>
                  <NotifDot hidden={notif.read} />
                </NotifDotWrap>
                <NotifContent>
                  <NotifTitle>{notif.title}</NotifTitle>
                  <NotifBody>{notif.body}</NotifBody>
                  <NotifTime>{formatDate(notif.created_at)}</NotifTime>
                </NotifContent>
                {!notif.read ? (
                  <ReadButton onClick={() => markAsRead(notif)}>
                    <CheckCheck size={14} style={{ marginRight: 4 }} />
                    Marcar
                  </ReadButton>
                ) : null}
              </NotifCard>
            ))}
          </div>
        )}
      </PageContent>
    </>
  );
}
