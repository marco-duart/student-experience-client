import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  MessageSquare,
  User,
  Bell,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { styled } from "@/theme/stitches.config";
import { useAuth } from "@/contexts/auth-context";
import { NotificationBadge } from "@/components/ui/Badge";

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badgeCount?: number;
  disabled?: boolean;
};

const Nav = styled("nav", {
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: "560px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.90) 100%)",
  borderTop: "1px solid $divider",
  display: "flex",
  alignItems: "stretch",
  zIndex: 100,
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  boxShadow: "0 -8px 26px rgba(0,43,92,0.12)",
  backdropFilter: "blur(8px)",

  "@md": {
    position: "sticky",
    left: "auto",
    transform: "none",
    maxWidth: "none",
    width: "100%",
    marginTop: "auto",
  },
});

const NavBtn = styled("button", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  padding: "$3 $2",
  background: "none",
  border: "none",
  cursor: "pointer",
  position: "relative",
  transition: "background 0.15s ease",
  minHeight: "60px",

  "&:active": {
    backgroundColor: "rgba(0,43,92,0.04)",
  },

  variants: {
    active: {
      true: {},
    },
    disabled: {
      true: {
        cursor: "not-allowed",
        opacity: 0.55,
        "&:active": { backgroundColor: "transparent" },
      },
    },
  },
});

const NavLabel = styled("span", {
  fontSize: "10px",
  fontWeight: "$bold",
  letterSpacing: "0.03em",
  lineHeight: 1,
  transition: "color 0.15s ease",

  variants: {
    active: {
      true: { color: "$primary", textShadow: "0 1px 10px rgba(0,43,92,0.18)" },
      false: { color: "$textSecondary" },
    },
    disabled: {
      true: { color: "$textDisabled" },
    },
  },
});

const ActiveIndicator = styled("div", {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "28px",
  height: "3px",
  backgroundColor: "$primary",
  borderRadius: "0 0 3px 3px",
  transition: "opacity 0.15s ease",

  variants: {
    visible: {
      false: { opacity: 0 },
      true: { opacity: 1 },
    },
  },
});

type BottomNavProps = {
  notificationCount?: number;
};

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const navItems: NavItem[] = [
    { label: "Início", path: "/app/home", icon: Home },
    { label: "Cursos", path: "/app/courses", icon: BookOpen },
    {
      label: "Mensagens",
      path: "/app/messages",
      icon: MessageSquare,
      disabled: true,
    },
    {
      label: "Avisos",
      path: "/app/notifications",
      icon: Bell,
      badgeCount: notificationCount,
    },
    { label: "Perfil", path: "/app/profile", icon: User },
  ];

  if (role === "coach") {
    navItems.splice(2, 0, {
      label: "Ferramentas",
      path: "/app/tools",
      icon: Wrench,
    });
  }

  return (
    <Nav role="navigation" aria-label="Navegação principal">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        const iconColor = item.disabled
          ? "var(--colors-textDisabled)"
          : isActive
            ? "var(--colors-primary)"
            : "var(--colors-textSecondary)";
        const iconStroke = item.disabled ? 1.6 : isActive ? 2.5 : 2;

        return (
          <NavBtn
            key={item.path}
            active={isActive}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              navigate(item.path);
            }}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={item.disabled ? true : undefined}
          >
            <ActiveIndicator visible={isActive} />
            <div style={{ position: "relative" }}>
              <Icon size={22} color={iconColor} strokeWidth={iconStroke} />
              {item.badgeCount ? (
                <NotificationBadge count={item.badgeCount} />
              ) : null}
            </div>
            <NavLabel active={isActive} disabled={item.disabled}>
              {item.label}
            </NavLabel>
          </NavBtn>
        );
      })}
    </Nav>
  );
}
