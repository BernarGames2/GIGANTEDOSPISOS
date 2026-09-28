import { site } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

/** Faixa exibida apenas no modo apresentação (site.pitchMode). */
export function PitchBanner() {
  if (!site.pitchMode) return null;
  return (
    <div className="bg-gold-500 px-4 py-2 text-center text-xs font-medium text-ink-900 sm:text-sm">
      <strong className="font-semibold">Proposta de novo site</strong> para a {site.name}. Itens destacados como{" "}
      <Placeholder className="border-ink-900/60 bg-white/50">[este]</Placeholder> aguardam dados reais da loja.
    </div>
  );
}
