"use client";

import { useTranslations } from "next-intl";

import { forwardRef, useState } from "react";

import Input, { type InputProps } from "./Input";
import { VisibilityIcon, VisibilityOffIcon } from "@/icons";

interface PasswordInputProps extends Omit<InputProps, "type" | "rightSlot" | "numericOnly"> {
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
}

const EyeIcon = () => <VisibilityIcon className="size-24" />;

const EyeOffIcon = () => <VisibilityOffIcon className="size-24" />;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showPasswordAriaLabel, hidePasswordAriaLabel, ...props },
  ref,
) {
  const tr = useTranslations("common");
  const resolvedShowLabel = showPasswordAriaLabel ?? tr("password.show");
  const resolvedHideLabel = hidePasswordAriaLabel ?? tr("password.hide");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-icon-default"
          aria-label={showPassword ? resolvedHideLabel : resolvedShowLabel}
          tabIndex={-1}
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
