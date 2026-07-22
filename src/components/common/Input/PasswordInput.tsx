"use client";

import { forwardRef, useState } from "react";

import Input, { type InputProps } from "./Input";
import Image from "next/image";

type PasswordInputProps = Omit<InputProps, "type" | "rightSlot" | "numericOnly">;

const EyeIcon = () => (
  <Image src="/icons/ic_visibility_on.svg" alt="" width={24} height={24} aria-hidden />
);

const EyeOffIcon = () => (
  <Image src="/icons/ic_visibility_off.svg" alt="" width={24} height={24} aria-hidden />
);

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
