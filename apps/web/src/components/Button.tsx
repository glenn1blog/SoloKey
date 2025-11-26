"use client";

import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "lg";
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-[var(--sk-color-primary)] text-[var(--sk-color-text-main)] hover:bg-[#9372ff]",
  secondary:
    "bg-[var(--sk-color-surface-soft)] text-[var(--sk-color-text-main)] border border-[var(--sk-color-border)] hover:border-[var(--sk-color-primary)]",
  ghost: "bg-transparent text-[var(--sk-color-text-muted)] hover:text-[var(--sk-color-text-main)]"
};

const sizeClass = {
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base"
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sk-color-primary)] disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    />
  );
}
