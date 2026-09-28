import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "whatsapp" | "outline-light" | "outline-dark" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold tracking-[-0.01em] transition duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-gold-500 text-ink-900 shadow-gold hover:bg-gold-400 hover:-translate-y-0.5",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark hover:-translate-y-0.5",
  "outline-light": "border border-white/30 text-cream-50 hover:border-gold-400 hover:text-gold-300",
  "outline-dark": "border border-ink-900/20 text-ink-900 hover:border-brand-700 hover:bg-brand-700 hover:text-cream-50",
  ghost: "text-brand-700 hover:bg-brand-100",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}

export function ButtonLink({
  variant,
  size,
  icon,
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
    </a>
  );
}

export function Button({
  variant,
  size,
  icon,
  children,
  className,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}
