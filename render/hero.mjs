#!/usr/bin/env node
/**
 * Gera as imagens do hero (public/ambientes/hero-*.webp) fotografando o
 * próprio simulador com produtos do catálogo aplicados.
 * Requer o site rodando: SITE_URL (padrão http://localhost:3000).
 */
import { chromium } from "playwright-core";
import sharp from "sharp";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const shots = [
  { file: "hero-sala", room: "Sala de estar", floor: "Porcelanato polido marmorizado", wall: null },
  { file: "hero-cozinha", room: "Cozinha", floor: "Porcelanato efeito madeira", wall: "Revestimento metrô verde" },
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
await page.goto(base, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "[data-scene-labels],nextjs-portal{display:none!important}" });
const sim = page.locator("#simulador");
await sim.scrollIntoViewIfNeeded();

for (const s of shots) {
  await sim.getByRole("button", { name: s.room }).click();
  await sim.getByRole("button", { name: "Piso", exact: true }).click();
  await sim.getByRole("button", { name: s.floor, exact: true }).click();
  if (s.wall) {
    await sim.getByRole("button", { name: "Parede", exact: true }).click();
    await sim.getByRole("button", { name: s.wall, exact: true }).click();
  }
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const png = await sim.locator("figure [role=img]").screenshot();
  await sharp(png).resize(1200).webp({ quality: 84 }).toFile(`public/ambientes/${s.file}.webp`);
  console.log(`hero: ${s.file}`);
}
await browser.close();
