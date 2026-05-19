import { styled } from "@/theme/stitches.config";

export const Badge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2px 8px",
  borderRadius: "$pill",
  fontSize: "$xs",
  fontWeight: "$semibold",
  lineHeight: 1.4,
  letterSpacing: "0.03em",

  variants: {
    color: {
      primary: { backgroundColor: "rgba(0,43,92,0.10)", color: "$primary" },
      secondary: {
        backgroundColor: "rgba(197,160,89,0.15)",
        color: "$secondaryDark",
      },
      success: { backgroundColor: "$successBg", color: "$success" },
      error: { backgroundColor: "$errorBg", color: "$error" },
      warning: { backgroundColor: "$warningBg", color: "#856404" },
      info: { backgroundColor: "$infoBg", color: "$info" },
      neutral: { backgroundColor: "#f1f3f5", color: "$textSecondary" },
    },
    dot: {
      true: {
        paddingLeft: "6px",
        "&::before": {
          content: "''",
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "currentColor",
          marginRight: 5,
          flexShrink: 0,
        },
      },
    },
  },

  defaultVariants: {
    color: "neutral",
  },
});

type NotificationBadgeProps = {
  count: number;
};

const NotifDot = styled("span", {
  position: "absolute",
  top: "-4px",
  right: "-4px",
  minWidth: "18px",
  height: "18px",
  backgroundColor: "$error",
  color: "#fff",
  borderRadius: "$pill",
  fontSize: "10px",
  fontWeight: "$bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 4px",
  border: "2px solid $bgPaper",
  lineHeight: 1,
});

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;
  return <NotifDot>{count > 99 ? "99+" : count}</NotifDot>;
}
