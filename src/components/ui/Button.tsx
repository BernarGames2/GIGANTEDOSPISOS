import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "green" | "whatsapp" | "outline-dark" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg font-display font-bold tracking-[-0.005em] transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "btn-gold",
  green: "btn-green",
  whatsapp: "btn-whatsapp",
  "outline-dark": "border-2 border-green-900/80 text-green-900 hover:bg-green-900 hover:text-cream-50",
  "outline-light": "border-2 border-sand/40 text-cream-50 hover:border-gold-400 hover:text-gold-300",
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
