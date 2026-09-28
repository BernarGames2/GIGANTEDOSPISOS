/**
 * Recursos 3D usados SOMENTE para renderizar as imagens dos ambientes do
 * simulador (os modelos não são publicados no site). Licenças e créditos em
 * CREDITOS.md.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KHRONOS = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";
const THREE_HDR = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular";

export const assets = {
  sofa: { url: `${KHRONOS}/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb`, license: "CC-BY-4.0", credit: "GlamVelvetSofa — Eric Chadwick / Wayfair (Khronos glTF Sample Assets)" },
  chair: { url: `${KHRONOS}/SheenChair/glTF-Binary/SheenChair.glb`, license: "CC0-1.0", credit: "SheenChair — Eric Chadwick / Wayfair (Khronos glTF Sample Assets)" },
  plant: { url: `${KHRONOS}/DiffuseTransmissionPlant/glTF-Binary/DiffuseTransmissionPlant.glb`, license: "CC-BY-4.0 / CC0-1.0", credit: "DiffuseTransmissionPlant — Eric Chadwick, Rico Cilliers (Khronos glTF Sample Assets)" },
  pouf: { url: `${KHRONOS}/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb`, license: "CC-BY-4.0", credit: "SpecularSilkPouf — Eric Chadwick / Wayfair (Khronos glTF Sample Assets)" },
  lamp: { url: `${KHRONOS}/IridescenceLamp/glTF-Binary/IridescenceLamp.glb`, license: "CC-BY-4.0", credit: "IridescenceLamp — Eric Chadwick / Wayfair (Khronos glTF Sample Assets)" },
  flowers: { url: `${KHRONOS}/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb`, license: "CC0-1.0", credit: "GlassVaseFlowers — Eric Chadwick, Rico Cilliers (Khronos glTF Sample Assets)" },
  lantern: { url: `${KHRONOS}/Lantern/glTF-Binary/Lantern.glb`, license: "CC0-1.0", credit: "Lantern — sbtron, Frank Galligan (Khronos glTF Sample Assets)" },
  skyField: { url: `${THREE_HDR}/spruit_sunrise_1k.hdr`, license: "CC0-1.0", credit: "Spruit Sunrise — Poly Haven (via three.js)" },
};

export const cacheDir = join(dirname(fileURLToPath(import.meta.url)), ".cache");

export async function downloadAssets() {
  mkdirSync(cacheDir, { recursive: true });
  for (const [name, a] of Object.entries(assets)) {
    const file = join(cacheDir, `${name}${a.url.endsWith(".hdr") ? ".hdr" : ".glb"}`);
    if (existsSync(file)) continue;
    const res = await fetch(a.url);
    if (!res.ok) throw new Error(`Falha ao baixar ${name}: ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`baixado: ${name}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await downloadAssets();
}
