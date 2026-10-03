"use client";

import React, { forwardRef } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "destructive" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  iconOnly?: boolean;
}

/**
 * Standardized 5-Variant Button Styling Engine
 * Consolidated from 15 disparate styles into 5 accessible, brand-consistent variants:
 * 1. primary: Main CTA with signature gradient, high visual hierarchy
 * 2. secondary: Supporting action with gentle teal tint
 * 3. outline: Low-emphasis action with clean neutral border
 * 4. destructive: Critical/SOS/Delete actions with high-visibility rose
 * 5. icon: Compact utility control with accessible min 44x44px touch targets
 */
export function getButtonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
): string {
  // Base tokens shared across ALL button variants
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]";

  // 5 Standardized Variants
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 " +
      "text-white border border-transparent shadow-sm hover:shadow-md",
    secondary:
      "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 shadow-sm",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm",
    destructive:
      "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 shadow-sm hover:shadow-md " +
      "focus-visible:ring-rose-500",
    icon:
      "p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent",
  };

  // Standardized Sizes (incorporating WCAG AAA 44x44px minimum senior touch targets)
  const sizeClasses: Record<ButtonSize, string> = {
    sm: variant === "icon" ? "min-h-[38px] min-w-[38px] p-2 text-xs" : "text-xs px-3.5 py-1.5 rounded-full min-h-[38px]",
    md: variant === "icon" ? "min-h-[44px] min-w-[44px] p-2.5 text-sm" : "text-sm px-5 py-2.5 rounded-full min-h-[44px]",
    lg: variant === "icon" ? "min-h-[48px] min-w-[48px] p-3 text-base" : "text-base px-6 py-3 rounded-full min-h-[48px]",
  };

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external = false,
      className = "",
      children,
      type = "button",
      disabled,
      ...rest
    },
    ref
  ) => {
    const combinedClasses = getButtonClasses(variant, size, className);

    if (href) {
      if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={combinedClasses}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClasses}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={combinedClasses}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
