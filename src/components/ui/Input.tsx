import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { styled } from "@/theme/stitches.config";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$2",
  width: "100%",
});

const Label = styled("label", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textSecondary",
  letterSpacing: "0.02em",
});

const InputWrap = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
});

const StyledInput = styled("input", {
  width: "100%",
  padding: "$4",
  paddingRight: "$4",
  backgroundColor: "$bgPaper",
  border: "1.5px solid $divider",
  borderRadius: "$md",
  fontSize: "$md",
  color: "$textPrimary",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",

  "&:focus": {
    borderColor: "$primary",
    boxShadow: "0 0 0 3px rgba(0,43,92,0.10)",
  },

  "&::placeholder": {
    color: "$textDisabled",
  },

  "&:disabled": {
    backgroundColor: "#f8f9fa",
    cursor: "not-allowed",
    opacity: 0.7,
  },

  variants: {
    hasIcon: {
      true: { paddingRight: "46px" },
    },
    error: {
      true: {
        borderColor: "$error",
        "&:focus": {
          borderColor: "$error",
          boxShadow: "0 0 0 3px rgba(220,53,69,0.10)",
        },
      },
    },
  },
});

const IconButton = styled("button", {
  position: "absolute",
  right: "$3",
  top: "50%",
  transform: "translateY(-50%)",
  color: "$textDisabled",
  padding: "$1",
  borderRadius: "$sm",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  "&:hover": { color: "$textSecondary" },
});

const ErrorText = styled("span", {
  fontSize: "$xs",
  color: "$error",
  fontWeight: "$medium",
});

const HintText = styled("span", {
  fontSize: "$xs",
  color: "$textDisabled",
});

type InputProps = React.ComponentProps<typeof StyledInput> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <Wrapper>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <InputWrap>
          <StyledInput
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            hasIcon={isPassword}
            error={!!error}
            {...props}
          />
          {isPassword && (
            <IconButton
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          )}
        </InputWrap>
        {error && <ErrorText role="alert">{error}</ErrorText>}
        {!error && hint && <HintText>{hint}</HintText>}
      </Wrapper>
    );
  },
);

Input.displayName = "Input";
