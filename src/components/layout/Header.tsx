"use client";

import { Menu, Phone, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

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
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled || open ? "bg-brand-800/95 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-md" : "bg-brand-800",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/#inicio" className="rounded-lg" aria-label={`${site.name} — início`}>
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={`/${l.href}`}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-cream-100/85 transition-colors hover:bg-white/10 hover:text-cream-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-cream-50 hover:text-gold-300 md:inline-flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            {site.phone.display}
          </a>
          <span className="hidden min-[360px]:block">
            <ButtonLink href={whatsappLink()} variant="primary" className="h-10" icon={<WhatsAppIcon className="size-4" />}>
              Orçamento
            </ButtonLink>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex size-11 items-center justify-center rounded-full text-cream-50 hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
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
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={`/${l.href}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-display text-lg font-semibold text-cream-50 hover:bg-white/10"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
                <ButtonLink href={whatsappLink()} variant="whatsapp" icon={<WhatsAppIcon className="size-5" />}>
                  Falar no WhatsApp
                </ButtonLink>
                <ButtonLink href={site.phone.href} variant="outline-light" icon={<Phone className="size-4" aria-hidden="true" />}>
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
