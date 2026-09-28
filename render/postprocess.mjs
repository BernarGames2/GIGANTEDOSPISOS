/**
 * Converte os passes PNG do render em arquivos leves para o site
 * (public/ambientes/<ambiente>/*.webp) e grava a geometria de projeção em
 * src/content/ambientes.json.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export async function postprocess(rooms) {
  const jsonPath = join(root, "src/content/ambientes.json");
  const all = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : {};

  for (const id of rooms) {
    const src = join(root, "render/.out", id);
    const dst = join(root, "public/ambientes", id);
    mkdirSync(dst, { recursive: true });
    const p = (name) => join(src, `${name}.png`);

    // Duas resoluções: "lg" (1600 px) para telas grandes e "sm" (960 px) para celular.
    for (const [suffix, width] of [["", undefined], ["-sm", 960]]) {
      const img = (name) => (width ? sharp(p(name)).resize(width) : sharp(p(name)));
      const out = (name) => join(dst, `${name}${suffix}.webp`);
      await img("beauty").webp({ quality: 84 }).toFile(out("beauty"));
      await img("fg").webp({ quality: 84, alphaQuality: 92 }).toFile(out("fg"));
      await img("floorMask").webp({ lossless: true }).toFile(out("floor-mask"));
      await img("wallMask").webp({ lossless: true }).toFile(out("wall-mask"));
      await img("shade").grayscale().webp({ quality: 88 }).toFile(out("shade"));
      await img("light").grayscale().webp({ quality: 80 }).toFile(out("light"));
      await img("refl").webp({ quality: 80 }).toFile(out("refl"));
      await img("refl").blur(width ? 4 : 6).webp({ quality: 75 }).toFile(out("refl-soft"));
    }
    // Miniatura para o hero e para as abas do simulador.
    await sharp(p("beauty")).resize(640).webp({ quality: 78 }).toFile(join(dst, "thumb.webp"));

    all[id] = JSON.parse(readFileSync(join(src, "meta.json"), "utf8"));
    console.log(`pós-processado: ${id}`);
  }

  writeFileSync(jsonPath, JSON.stringify(all, null, 2) + "\n");
}

// Uso direto: node render/postprocess.mjs [sala cozinha ...]
if (import.meta.url === `file://${process.argv[1]}`) {
  const rooms = process.argv.slice(2);
  await postprocess(rooms.length ? rooms : ["sala", "cozinha", "banheiro", "externa"]);
}
