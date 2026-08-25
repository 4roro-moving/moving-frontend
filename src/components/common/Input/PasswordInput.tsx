"use client";

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
  {
    showPasswordAriaLabel = "비밀번호 보이기",
    hidePasswordAriaLabel = "비밀번호 숨기기",
    ...props
  },
  ref,
) {
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
          aria-label={showPassword ? hidePasswordAriaLabel : showPasswordAriaLabel}
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
