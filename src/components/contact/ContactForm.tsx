"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";

const needs = ["Piso", "Revestimento", "Materiais de construção", "Acabamentos", "Instalação", "Outro assunto"];

const field =
  "mt-1.5 block w-full rounded-xl border-0 bg-white px-4 py-3 text-ink-900 shadow-sm ring-1 ring-ink-900/15 placeholder:text-ink-300 focus:ring-2 focus:ring-brand-600 focus:outline-none";

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
    <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-cream-100 p-5 sm:p-7" aria-describedby="form-nota">
      <p className="font-display text-lg font-semibold text-brand-800">Mande sua mensagem</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink-700">
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
        <label className="block text-sm font-medium text-ink-700">
          Assunto
          <select name="assunto" className={field} defaultValue={needs[0]}>
            {needs.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink-700 sm:col-span-2">
          Mensagem
          <textarea
            name="mensagem"
            rows={4}
            className={field}
            placeholder="Ex.: preciso de piso para uma sala de 20 m², estilo madeira clara."
          />
        </label>
      </div>
      {error ? (
        <p id="form-erro" role="alert" className="mt-3 text-sm font-medium text-mascot-600">
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-nota" className="text-xs text-ink-500">
          Ao enviar, o WhatsApp abre com a mensagem pronta. Nenhum dado fica salvo no site.
        </p>
        <Button type="submit" variant="whatsapp" icon={<Send className="size-4" aria-hidden="true" />}>
          Enviar pelo WhatsApp
        </Button>
      </div>
    </form>
  );
}
