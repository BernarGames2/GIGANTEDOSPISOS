"use client";

import { List, Phone, WhatsappLogo, X } from "@phosphor-icons/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open
          ? "border-gold-500/25 bg-green-950/95 shadow-[0_14px_40px_-16px_rgb(5_16_10/0.8)] backdrop-blur-md"
          : "border-transparent bg-green-900",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/#inicio" className="rounded-md" aria-label={`${site.name} — início`}>
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={`/${l.href}`}
                  className="group relative rounded-md px-3.5 py-2 font-display text-[0.92rem] font-bold text-sand transition-colors hover:text-cream-50"
                >
                  {l.label}
                  <span className="diamond absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 scale-0 bg-gold-500 transition-transform duration-200 group-hover:scale-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 rounded-md px-3 py-2 font-display text-sm font-bold text-cream-50 hover:text-gold-300 xl:inline-flex"
          >
            <Phone weight="bold" className="size-5 text-gold-400" aria-hidden="true" />
            {site.phone.display}
          </a>
          <span className="hidden min-[400px]:block">
            <ButtonLink href={whatsappLink()} className="h-11 px-4" icon={<WhatsappLogo weight="bold" className="size-5" />}>
              Orçamento
            </ButtonLink>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex size-11 items-center justify-center rounded-md text-cream-50 hover:bg-green-800 lg:hidden"
          >
            {open ? <X weight="bold" className="size-6" aria-hidden="true" /> : <List weight="bold" className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <m.nav
            id="menu-mobile"
            aria-label="Menu"
            key="menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-sand/10 lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={`/${l.href}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 font-display text-lg font-bold text-cream-50 hover:bg-green-800"
                  >
                    <span className="diamond size-2 bg-gold-500" aria-hidden="true" />
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-3 grid gap-2 border-t border-sand/10 pt-4 sm:grid-cols-2">
                <ButtonLink href={whatsappLink()} variant="whatsapp" icon={<WhatsappLogo weight="bold" className="size-5" />}>
                  Falar no WhatsApp
                </ButtonLink>
                <ButtonLink href={site.phone.href} variant="outline-light" icon={<Phone weight="bold" className="size-5" />}>
                  {site.phone.display}
                </ButtonLink>
              </li>
            </ul>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
