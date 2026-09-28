import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "green" | "cream" | "whatsapp" | "outline-dark" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg font-display font-semibold transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "btn-gold",
  green: "btn-green",
  cream: "btn-cream",
  whatsapp: "btn-whatsapp",
  "outline-dark": "border border-green-900/35 text-green-900 hover:border-green-900 hover:bg-green-900/5",
  "outline-light": "border border-sand/35 text-cream-50 hover:border-sand/70 hover:bg-cream-50/5",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "gold", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  children: ReactNode;
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconAfter,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = rest.href?.startsWith("http");
  return (
    <a
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      {...rest}
    >
      {icon}
      {children}
      {iconAfter}
    </a>
  );
}

export function Button({
  variant,
  size,
  icon,
  iconAfter,
  children,
  className,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconAfter}
    </button>
  );
}
