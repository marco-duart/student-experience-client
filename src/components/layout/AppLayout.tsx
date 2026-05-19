import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/Spinner";
import { BottomNav } from "@/components/layout/BottomNav";
import { accountService } from "@/services/user.service";
import { PrototypeCard } from "@/components/ui/PrototypeCard";

const Shell = styled("div", {
  display: "grid",
  minHeight: "100%",
  flex: 1,
  width: "100%",
  gridTemplateColumns: "1fr",

  "@md": {
    gridTemplateColumns: "minmax(260px, 360px) minmax(620px, 980px)",
    justifyContent: "center",
    gap: "$6",
    padding: "$6",
  },
});

const SidePanel = styled("aside", {
  display: "none",

  "@md": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "$lg",
    background:
      "linear-gradient(160deg, rgba(16,33,43,0.98) 0%, rgba(15,76,92,0.94) 58%, rgba(224,159,62,0.84) 100%)",
    padding: "$8",
    color: "#fff",
    boxShadow: "0 24px 56px rgba(15,23,42,0.24)",
    minHeight: "calc(100vh - 3rem)",
    position: "sticky",
    top: "$6",
  },
});

const SideTitle = styled("h2", {
  margin: 0,
  fontSize: "$lg",
  color: "#fff",
  lineHeight: 1.15,
});

const SideText = styled("p", {
  margin: 0,
  marginTop: "$3",
  fontSize: "$sm",
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.84)",
});

const AppViewport = styled("section", {
  width: "100%",
  maxWidth: "none",
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(247,243,234,0.90) 100%)",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  backdropFilter: "blur(10px)",

  "@md": {
    borderRadius: "$lg",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(15,23,42,0.14)",
    border: "1px solid rgba(255,255,255,0.42)",
    minHeight: "calc(100vh - 3rem)",
  },
});

export function AppLayout() {
  const { isBooting, isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnread = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const res = await accountService.listNotifications({
      account_id: user.id,
      page: 1,
      limit: 100,
    });

    if (res.success && res.data) {
      const root = res.data as Record<string, unknown>;
      const meta = (root.meta ?? {}) as Record<string, unknown>;
      const container = (root.notifications ?? {}) as Record<string, unknown>;
      const items = Array.isArray(container.data) ? container.data : [];
      const unreadFromMeta = Number(meta.unread_count ?? NaN);

      if (Number.isFinite(unreadFromMeta)) {
        setUnreadCount(unreadFromMeta);
        return;
      }

      const unread = items.filter((item) => {
        const parsed = item as Record<string, unknown>;
        const attrs = (parsed.attributes ?? {}) as Record<string, unknown>;
        return !Boolean(attrs.read);
      }).length;

      setUnreadCount(unread);
    }
  }, [user]);

  useEffect(() => {
    loadUnread();
  }, [loadUnread]);

  if (isBooting) return <Spinner fullScreen label="Carregando..." />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <Shell>
      <SidePanel>
        <div>
          <PrototypeCard label="logo" tone="light" size="md" />
          <SideTitle>
            Um protótipo neutro para vender a experiência.
          </SideTitle>
          <SideText>
            A navegação, os fluxos e os dados aparecem como se o sistema fosse
            real, mas tudo é demonstrativo.
          </SideText>
        </div>
        <SideText>
          Aprendizado, acompanhamento, conteúdo e catálogo em um fluxo único.
        </SideText>
      </SidePanel>

      <AppViewport>
        <Outlet context={{ reloadNotifications: loadUnread }} />
        <BottomNav notificationCount={unreadCount} />
      </AppViewport>
    </Shell>
  );
}
