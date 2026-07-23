"use client";

import { forwardRef, useState } from "react";

import Input, { type InputProps } from "./Input";
import { VisibilityIcon, VisibilityOffIcon } from "@/icons";

type PasswordInputProps = Omit<InputProps, "type" | "rightSlot" | "numericOnly">;

const EyeIcon = () => <VisibilityIcon className="size-24" />;

const EyeOffIcon = () => <VisibilityOffIcon className="size-24" />;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
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
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        }
        {...props}
      />
    );
  },
);

export default PasswordInput;
