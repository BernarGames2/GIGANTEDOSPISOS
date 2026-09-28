"use client";

import { RotateCcw, SearchX } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useMemo, useState } from "react";
import {
  categoryLabels,
  environmentLabels,
  priceTierLabels,
  products,
  type Category,
  type Environment,
  type PriceTier,
} from "@/content/products";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 8;

interface Filters {
  category: Category | "all";
  environment: Environment | "all";
  tier: PriceTier | "all";
}

const initialFilters: Filters = { category: "all", environment: "all", tier: "all" };

interface Option<T> {
  value: T;
  label: string;
}

function FilterGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <p id={id} className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active ? "text-cream-50" : "bg-white text-ink-700 ring-1 ring-ink-900/10 hover:ring-brand-300",
              )}
            >
              {active ? (
                <m.span
                  layoutId={`${id}-pill`}
                  transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-brand-800"
                />
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

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (filters.category === "all" || p.category === filters.category) &&
          (filters.environment === "all" || p.environments.includes(filters.environment)) &&
          (filters.tier === "all" || p.priceTier === filters.tier),
      ),
    [filters],
  );
  const shown = filtered.slice(0, visible);
  const hasFilters = filters.category !== "all" || filters.environment !== "all" || filters.tier !== "all";

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE);
  };
  const reset = () => update(initialFilters);

  return (
    <div className="mt-10 lg:mt-12">
      <div className="flex flex-col gap-5 rounded-3xl bg-cream-100 p-4 sm:p-6 lg:flex-row lg:flex-wrap lg:gap-x-10">
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
        <FilterGroup<PriceTier | "all">
          label="Faixa de preço"
          value={filters.tier}
          onChange={(tier) => update({ tier })}
          options={[
            { value: "all", label: "Todas" },
            ...([1, 2, 3] as PriceTier[]).map((t) => ({
              value: t,
              label: `${priceTierLabels[t].symbol} ${priceTierLabels[t].label}`,
            })),
          ]}
        />
      </div>

      <div className="mt-6 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600" aria-live="polite">
          {filtered.length === 0
            ? "Nenhum produto encontrado"
            : `Mostrando ${shown.length} de ${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`}
        </p>
        {hasFilters ? (
          <Button variant="ghost" onClick={reset} className="h-10" icon={<RotateCcw className="size-4" aria-hidden="true" />}>
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center rounded-3xl border-2 border-dashed border-cream-300 px-6 py-14 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-cream-100 text-brand-700">
            <SearchX className="size-7" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-title font-semibold text-brand-800">Nenhum produto com esses filtros</h3>
          <p className="mt-2 max-w-md text-ink-600">
            Este catálogo é uma amostra. Tente outra combinação ou consulte a equipe sobre outras opções.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outline-dark" onClick={reset} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
              Limpar filtros
            </Button>
            <ButtonLink
              variant="whatsapp"
              href={whatsappLink("Olá! Não encontrei no catálogo do site o que procuro. Vocês podem me ajudar?")}
              icon={<WhatsAppIcon className="size-5" />}
            >
              Perguntar no WhatsApp
            </ButtonLink>
          </div>
        </m.div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <m.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {visible < filtered.length ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline-dark" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Carregar mais ({filtered.length - visible})
          </Button>
        </div>
      ) : filtered.length > PAGE_SIZE ? (
        <p className="mt-10 text-center text-sm text-ink-500">Você viu todos os itens desta seleção.</p>
      ) : null}
    </div>
  );
}
