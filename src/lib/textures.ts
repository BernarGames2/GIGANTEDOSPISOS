import photoTextures from "@/content/produtos-texturas.json";
import proceduralTextures from "@/content/textures.json";

/**
 * Texturas: as ilustrativas (textures.json, geradas por script) e as fotos
 * reais das peças cadastradas na planilha (produtos-texturas.json).
 */
const textures = { ...proceduralTextures, ...photoTextures } as unknown as Record<string, TextureSpec | undefined>;

export type TextureId = string;

interface TextureSpec {
  size: number[];
  src?: string;
}

export interface Texture {
  src: string;
  /** Largura/altura (cm) cobertas por um arquivo antes de repetir. */
  widthCm: number;
  heightCm: number;
}

export function getTexture(id: TextureId): Texture {
  const spec = textures[id];
  if (!spec?.size) throw new Error(`Textura desconhecida: ${id}`);
  return {
    src: spec.src ?? `/texturas/${id}.svg`,
    widthCm: spec.size[0],
    heightCm: spec.size[1],
  };
}

/** Estilo CSS de fundo repetido com escala em px por cm. */
export function textureStyle(id: TextureId, pxPerCm: number): React.CSSProperties {
  const t = getTexture(id);
  return {
    backgroundImage: `url(${t.src})`,
    backgroundSize: `${t.widthCm * pxPerCm}px ${t.heightCm * pxPerCm}px`,
    backgroundRepeat: "repeat",
  };
}

/**
 * Fundo para miniaturas responsivas: mostra um recorte de ~45 a 130 cm da
 * textura, independentemente do tamanho da caixa (background-size em %).
 */
export function swatchStyle(id: TextureId, zoom = 1): React.CSSProperties {
  const t = getTexture(id);
  const shownCm = Math.min(Math.max(t.widthCm, 45), 130) / zoom;
  return {
    backgroundImage: `url(${t.src})`,
    backgroundSize: `${(t.widthCm / shownCm) * 100}% auto`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
  };
}
