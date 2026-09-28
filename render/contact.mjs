// Folha de contato dos passes de um ambiente (para revisão): node render/contact.mjs sala
import sharp from "sharp";
const id = process.argv[2] ?? "sala";
const dir = `render/.out/${id}`;
const names = ["beauty", "fg", "floorMask", "wallMask", "shade", "light", "refl"];
const w = 800, h = 500;
const tiles = await Promise.all(names.map(async (n) => ({
  input: await sharp(`${dir}/${n}.png`).resize(w, h).flatten({ background: n === "fg" ? "#ff00ff" : "#000" }).png().toBuffer(),
})));
await sharp({ create: { width: w * 2, height: h * 4, channels: 3, background: "#222" } })
  .composite(tiles.map((t, i) => ({ ...t, left: (i % 2) * w, top: Math.floor(i / 2) * h })))
  .png().toFile(`render/.out/contact-${id}.png`);
console.log("ok");
