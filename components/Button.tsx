"use client";

import React, { forwardRef } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "tertiary" | "destructive" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  iconOnly?: boolean;
}

/**
 * Standardized 5-Variant Button Styling Engine for Smitri_NER:
 * 1. primary: Deep Teal #0B534B, high contrast white text, hover #08433C
 * 2. secondary: Emerald Green #10B981, white text, hover #059669
 * 3. outline: Surface / white, #0B534B border & text, hover #E6F4F1
 * 4. tertiary / destructive: Warm Amber #D97706 or SOS Red #DC2626
 * 5. icon: Neutral Slate #5A6A66 with accessible 44x44px touch target
 */
export function getButtonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = ""
): string {
  // Base tokens shared across ALL button variants
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B534B] " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]";

  // Standardized Variants
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white border border-transparent shadow-sm hover:shadow-md",
    secondary:
      "bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white border border-transparent shadow-sm hover:shadow-md",
    outline:
      "bg-white hover:bg-[#E6F4F1] text-[#0B534B] hover:text-[#08433C] border border-[#0B534B] shadow-sm",
    tertiary:
      "bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white border border-transparent shadow-sm",
    destructive:
      "bg-[#DC2626] hover:bg-[#B91C1C] text-white border border-transparent shadow-sm hover:shadow-md focus-visible:ring-red-600",
    icon:
      "p-2.5 rounded-full text-[#5A6A66] hover:text-[#111615] hover:bg-[#EBF0EE] border border-transparent",
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
