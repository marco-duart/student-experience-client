import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent, Text } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const ProfileHero = styled("div", {
  background: "linear-gradient(135deg, $primary, $primaryLight)",
  padding: "$6 $5",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$3",
  position: "relative",
  overflow: "hidden",

  "&::after": {
    content: "''",
    position: "absolute",
    top: "-30px",
    right: "-30px",
    width: "120px",
    height: "120px",
    background: "rgba(197,160,89,0.15)",
    borderRadius: "50%",
  },
});

const ProfileAvatar = styled("div", {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  border: "3px solid rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  color: "#fff",
  fontWeight: "700",
  position: "relative",
  zIndex: 1,
  overflow: "hidden",
});

const ProfileName = styled("h2", {
  fontSize: "$lg",
  fontWeight: "$bold",
  color: "#fff",
  margin: 0,
  position: "relative",
  zIndex: 1,
  textAlign: "center",
});

const ProfileEmail = styled("p", {
  fontSize: "$sm",
  color: "rgba(255,255,255,0.8)",
  margin: 0,
  position: "relative",
  zIndex: 1,
  textAlign: "center",
});

const MenuList = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$md",
  overflow: "hidden",
  border: "1px solid $divider",
  margin: "0 $4",
  marginBottom: "$4",
});

const MenuItem = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  width: "100%",
  padding: "$4 $5",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid $divider",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.12s ease",

  "&:last-child": { borderBottom: "none" },
  "&:active": { backgroundColor: "rgba(0,43,92,0.04)" },
  "&:hover": { backgroundColor: "rgba(0,43,92,0.03)" },
});

const MenuIconWrap = styled("div", {
  width: "36px",
  height: "36px",
  borderRadius: "$sm",
  backgroundColor: "rgba(0,43,92,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const MenuLabel = styled("span", {
  flex: 1,
  fontSize: "$md",
  fontWeight: "$medium",
  color: "$textPrimary",
});

const ROLE_LABELS: Record<string, string> = {
  coach: "Coach",
  coachee: "Coachee",
  customer: "Cliente",
  employee: "Equipe",
};

const ROLE_BADGE_COLOR: Record<
  string,
  "primary" | "secondary" | "info" | "neutral"
> = {
  coach: "secondary",
  coachee: "primary",
  customer: "info",
  employee: "neutral",
};

type MenuItemDef = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export default function ProfilePage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const { loading: loggingOut, run: handleLogout } = useAsyncAction(
    async () => {
      await logout();
      navigate("/auth/login", { replace: true });
    },
  );

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const menuItems: MenuItemDef[] = [
    {
      icon: User,
      label: "Editar dados pessoais",
      path: "/app/profile/account-settings",
    },
    { icon: MapPin, label: "Editar endereço", path: "/app/profile/address" },
    { icon: Lock, label: "Alterar senha", path: "/app/profile/password" },
    { icon: Bell, label: "Notificações", path: "/app/notifications" },
  ];

  return (
    <>
      <AppHeader title="Perfil" />
      <PageContent noPadding>
        <ProfileHero>
          <ProfileAvatar>
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </ProfileAvatar>
          <ProfileName>{user?.name ?? "Usuário do protótipo"}</ProfileName>
          <ProfileEmail>{user?.email}</ProfileEmail>
          {role && (
            <Badge
              color={ROLE_BADGE_COLOR[role] ?? "neutral"}
              css={{ marginTop: "4px", zIndex: 1 }}
            >
              {ROLE_LABELS[role] ?? "Usuário"}
            </Badge>
          )}
          {user?.phone && (
            <Text size="xs" color="inverse" css={{ opacity: 0.75, zIndex: 1 }}>
              {user.phone}
            </Text>
          )}
        </ProfileHero>

        <PageContent>
          <MenuList>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <MenuItem key={item.path} onClick={() => navigate(item.path)}>
                  <MenuIconWrap>
                    <Icon size={18} color="var(--colors-primary)" />
                  </MenuIconWrap>
                  <MenuLabel>{item.label}</MenuLabel>
                  <ChevronRight size={18} color="var(--colors-textDisabled)" />
                </MenuItem>
              );
            })}
          </MenuList>

          <Button
            variant="danger"
            loading={loggingOut}
            onClick={() => handleLogout()}
            leftIcon={<LogOut size={18} />}
          >
            Sair da conta
          </Button>
        </PageContent>
      </PageContent>
    </>
  );
}
