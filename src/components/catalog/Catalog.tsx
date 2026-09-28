"use client";

import { ArrowCounterClockwise, MagnifyingGlass, WhatsappLogo } from "@phosphor-icons/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  categoryLabels,
  environmentLabels,
  priceRanges,
  products,
  type Category,
  type Environment,
  type PriceRange,
} from "@/content/products";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 8;

interface Filters {
  category: Category | "all";
  environment: Environment | "all";
  range: PriceRange | "all";
}

const initialFilters: Filters = { category: "all", environment: "all", range: "all" };

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <p id={id} className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
      {/* Quebra em linhas (nada escondido na borda da tela, inclusive no celular). */}
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors sm:px-4",
                active ? "text-cream-50" : "bg-cream-50 text-ink-700 ring-1 ring-green-900/15 hover:text-green-900 hover:ring-green-900/40",
              )}
            >
              {active ? (
                <m.span layoutId={`${id}-pill`} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className="absolute inset-0 rounded-md bg-green-900" />
              ) : null}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Catalog() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const range = priceRanges.find((r) => r.id === filters.range);
    return products.filter(
      (p) =>
        (filters.category === "all" || p.category === filters.category) &&
        (filters.environment === "all" || p.environments.includes(filters.environment)) &&
        (!range || range.test(p.price)),
    );
  }, [filters]);
  const shown = filtered.slice(0, visible);
  const hasFilters = filters.category !== "all" || filters.environment !== "all" || filters.range !== "all";

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE);
  };
  const reset = () => update(initialFilters);

  return (
    <div className="mt-12 lg:mt-14">
      <div>
        <div className="card-light flex flex-col gap-6 rounded-2xl p-5 sm:p-7 lg:flex-row lg:flex-wrap lg:gap-x-12">
          <FilterGroup
            label="Categoria"
            value={filters.category}
            onChange={(category) => update({ category })}
            options={[
              { value: "all", label: "Todos" },
              ...(Object.keys(categoryLabels) as Category[]).map((c) => ({ value: c, label: categoryLabels[c] })),
            ]}
          />
          <FilterGroup
            label="Ambiente"
            value={filters.environment}
            onChange={(environment) => update({ environment })}
            options={[
              { value: "all", label: "Todos" },
              ...(Object.keys(environmentLabels) as Environment[]).map((e) => ({ value: e, label: environmentLabels[e] })),
            ]}
          />
          <FilterGroup
            label="Preço por m²/unidade"
            value={filters.range}
            onChange={(range) => update({ range })}
            options={[{ value: "all", label: "Todos" }, ...priceRanges.map((r) => ({ value: r.id, label: r.label }))]}
          />
        </div>
      </div>

      <div className="mt-8 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p className="text-ink-600" aria-live="polite">
          {filtered.length === 0
            ? "Nenhum produto encontrado"
            : `Mostrando ${shown.length} de ${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`}
        </p>
        {hasFilters ? (
          <Button variant="outline-dark" onClick={reset} className="h-11" icon={<ArrowCounterClockwise weight="bold" className="size-4" aria-hidden="true" />}>
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="mt-6">
          <div className="card-light flex flex-col items-center rounded-2xl px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-green-900/[0.06] text-green-800">
              <MagnifyingGlass weight="bold" className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-title font-semibold text-green-900">Nenhum produto com esses filtros</h3>
            <p className="mt-2 max-w-md text-ink-600">
              Tente outra combinação — ou fale com a equipe: o mix completo da loja é maior do que esta vitrine.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="outline-dark" onClick={reset} icon={<ArrowCounterClockwise weight="bold" className="size-4" aria-hidden="true" />}>
                Limpar filtros
              </Button>
              <ButtonLink
                variant="whatsapp"
                href={whatsappLink("Olá! Não encontrei no site o produto que procuro. Vocês podem me ajudar?")}
                icon={<WhatsappLogo weight="bold" className="size-5" />}
              >
                Perguntar no WhatsApp
              </ButtonLink>
            </div>
          </div>
        </m.div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[480px]:gap-6 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <m.li
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {visible < filtered.length ? (
        <div className="mt-12 flex justify-center">
          <Button variant="outline-dark" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Carregar mais produtos ({filtered.length - visible})
          </Button>
        </div>
      ) : filtered.length > PAGE_SIZE ? (
        <p className="mt-12 text-center text-ink-500">Você viu todos os itens desta seleção.</p>
      ) : null}
    </div>
  );
}
