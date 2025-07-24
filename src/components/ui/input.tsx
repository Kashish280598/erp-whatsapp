import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  endLabel?: React.ReactNode | string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, endLabel, error, startIcon, endIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPasswordInput = type === 'password';

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const preventCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isPasswordInput) {
        e.preventDefault();
      }
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center">
          {label && (
            <label
              htmlFor={props.id}
              className="block text-[13px] font-[600] text-neutral-500 leading-5 mb-2"
            >
              {label}
            </label>
          )}
          {endLabel && (
            endLabel
          )}
        </div>
        <div className="relative">
          {startIcon && (
            <span className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200 text-neutral-500">
              {startIcon}
            </span>
          )}
          <input
            type={isPasswordInput ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              "ellipsis truncate flex !h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-[13px] font-[400] leading-5 placeholder:text-neutral-500",
              "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              isPasswordInput && "pr-10 select-none",
              startIcon && "pl-8 select-none",
              className
            )}
            ref={ref}
            onCopy={preventCopy}
            onCut={preventCopy}
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {isPasswordInput && props.value && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(
                "absolute right-1 pr-2 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200",
                isFocused ? "text-primary" : "text-neutral hover:text-gray-700"
              )}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200">
              {endIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
