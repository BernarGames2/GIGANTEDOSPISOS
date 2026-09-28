"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

const needs = ["Piso", "Revestimento", "Materiais de construção", "Acabamentos", "Instalação", "Outro assunto"];

const field =
  "mt-2 block w-full rounded-lg border-0 bg-green-950/70 px-4 py-3 text-cream-50 ring-1 ring-sand/20 placeholder:text-sand-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-400";

/**
 * Formulário sem back-end: monta a mensagem e abre o WhatsApp.
 * Nenhum dado é enviado ou armazenado pelo site.
 */
export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("nome") ?? "").trim();
    const need = String(data.get("assunto") ?? "");
    const message = String(data.get("mensagem") ?? "").trim();
    if (!name) {
      setError("Informe seu nome para a equipe saber com quem está falando.");
      return;
    }
    setError(null);
    const text = [`Olá! Meu nome é ${name}.`, `Assunto: ${need}.`, message].filter(Boolean).join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="card-dark rounded-2xl p-6 sm:p-7" aria-describedby="form-nota">
        <p className="font-display text-xl font-semibold text-cream-50">Peça seu orçamento</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-sand">
            Nome
            <input
              name="nome"
              autoComplete="name"
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "form-erro" : undefined}
              className={field}
              placeholder="Como podemos te chamar?"
            />
          </label>
          <label className="block text-sm font-semibold text-sand">
            Assunto
            <select name="assunto" className={field} defaultValue={needs[0]}>
              {needs.map((n) => (
                <option key={n} className="bg-green-900">
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-sand sm:col-span-2">
            Mensagem
            <textarea name="mensagem" rows={3} className={field} placeholder="Ex.: piso para uma sala de 20 m², estilo madeira clara." />
          </label>
        </div>
        {error ? (
          <p id="form-erro" role="alert" className="mt-3 text-sm font-semibold text-gold-300">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="form-nota" className="text-xs text-sand-muted">
            O WhatsApp abre com a mensagem pronta. Nenhum dado fica salvo no site.
          </p>
          <Button type="submit" variant="whatsapp" icon={<PaperPlaneTilt weight="bold" className="size-5" aria-hidden="true" />}>
            Enviar pelo WhatsApp
          </Button>
        </div>
      </form>
    </div>
  );
}
