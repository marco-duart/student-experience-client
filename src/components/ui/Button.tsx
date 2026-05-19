import { styled } from "@/theme/stitches.config";
import { Spinner } from "./Spinner";

const StyledButton = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$2",
  width: "100%",
  padding: "$4 $6",
  borderRadius: "$md",
  fontSize: "$md",
  fontWeight: "$semibold",
  letterSpacing: "0.01em",
  transition: "all 0.18s ease",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
  WebkitUserSelect: "none",
  minHeight: "52px",

  "&:active": {
    transform: "scale(0.97)",
  },

  "&:disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
    "&:active": { transform: "none" },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary",
        color: "$primaryContrast",
        boxShadow: "0 4px 16px rgba(0,43,92,0.25)",
        "&:hover:not(:disabled)": {
          backgroundColor: "$primaryLight",
          boxShadow: "0 6px 20px rgba(0,43,92,0.30)",
          transform: "translateY(-1px)",
        },
        "&:active:not(:disabled)": {
          backgroundColor: "$primaryDark",
          transform: "translateY(0) scale(0.97)",
        },
      },
      secondary: {
        backgroundColor: "transparent",
        color: "$primary",
        border: "1.5px solid $primary",
        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(0,43,92,0.06)",
        },
      },
      gold: {
        backgroundColor: "$secondary",
        color: "#ffffff",
        boxShadow: "0 4px 16px rgba(197,160,89,0.35)",
        "&:hover:not(:disabled)": {
          backgroundColor: "$secondaryDark",
          transform: "translateY(-1px)",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$textSecondary",
        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(0,0,0,0.05)",
          color: "$textPrimary",
        },
      },
      danger: {
        backgroundColor: "$error",
        color: "#ffffff",
        "&:hover:not(:disabled)": {
          filter: "brightness(0.9)",
        },
      },
    },
    size: {
      sm: {
        padding: "$2 $4",
        fontSize: "$sm",
        minHeight: "38px",
        borderRadius: "$sm",
      },
      md: { padding: "$3 $5", fontSize: "$md", minHeight: "46px" },
      lg: { padding: "$4 $6", fontSize: "$md", minHeight: "52px" },
    },
    fullWidth: {
      false: { width: "auto" },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "lg",
    fullWidth: false,
  },
});

type ButtonProps = React.ComponentProps<typeof StyledButton> & {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  children,
  loading,
  disabled,
  leftIcon,
  rightIcon,
  variant,
  ...props
}: ButtonProps) {
  const spinnerColor =
    variant === "secondary" || variant === "ghost" ? "primary" : "white";

  return (
    <StyledButton disabled={disabled || loading} variant={variant} {...props}>
      {loading ? (
        <Spinner size="sm" color={spinnerColor} inline />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </StyledButton>
  );
}
