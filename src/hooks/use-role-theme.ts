import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/types/domain";

type RoleAccent = {
  main: string;
  light: string;
  dark: string;
  roleText: string;
};

const roleAccents: Record<UserRole, RoleAccent> = {
  coach: {
    main: "#E09F3E",
    light: "#F3BC6A",
    dark: "#B86C12",
    roleText: "#2B1F0C",
  },
  coachee: {
    main: "#0F4C5C",
    light: "#8CCED8",
    dark: "#08323D",
    roleText: "#06232B",
  },
  customer: {
    main: "#1E293B",
    light: "#556070",
    dark: "#0F172A",
    roleText: "#FFFDF8",
  },
  employee: {
    main: "#FFFDF8",
    light: "#E9E1D0",
    dark: "#A4AEBB",
    roleText: "#1E293B",
  },
};

const palette = {
  primary: {
    main: "#0F4C5C",
    light: "#2A7D8C",
    dark: "#08323D",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#E09F3E",
    light: "#F3BC6A",
    dark: "#B86C12",
    contrastText: "#1B1B1B",
  },
  background: { default: "#F7F3EA", paper: "#FFFDF8", dark: "#10212B" },
  text: { primary: "#1E293B", secondary: "#556070", disabled: "#A4AEBB" },
  status: {
    success: "#2F855A",
    error: "#C2410C",
    warning: "#CA8A04",
    info: "#0E7490",
  },
  divider: "rgba(15, 76, 92, 0.12)",
};

export function useRoleTheme() {
  const { role } = useAuth();
  return useMemo(() => {
    const accent = role ? roleAccents[role] : roleAccents.coachee;
    return { palette, roleAccent: accent };
  }, [role]);
}
