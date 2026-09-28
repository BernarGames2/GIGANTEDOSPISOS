#!/usr/bin/env node
/**
 * Gera a imagem de compartilhamento (Open Graph, 1200 × 630) em
 * public/og-gigante-dos-pisos.png com a logo e os números reais da loja
 * (lidos de src/content/site.ts — rode de novo sempre que eles mudarem).
 *
 *   npm run og
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { site } from "../src/content/site.ts";

const root = path.resolve(import.meta.dirname, "..");
const logoFile = path.join(root, "public", site.images.logo.src);
const logoMime = logoFile.endsWith(".svg") ? "image/svg+xml" : "image/png";
const logo = `data:${logoMime};base64,${fs.readFileSync(logoFile).toString("base64")}`;

// Fontes embutidas (baixadas pelo Node e inseridas como data URI).
async function googleFonts(query) {
  const ua = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
  let css = await (await fetch(`https://fonts.googleapis.com/css2?${query}&display=block`, { headers: { "user-agent": ua } })).text();
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
  for (const url of urls) {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    css = css.replaceAll(url, `data:font/woff2;base64,${buf.toString("base64")}`);
  }
  return css;
}
const fontCss = await googleFonts("family=Inter:wght@400;500&family=Poppins:wght@600");

const html = /* html */ `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>${fontCss}</style>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Inter, sans-serif;
    background: linear-gradient(165deg, #123322 0%, #0f2b1c 100%); color: #d7cfbb;
    display: grid; grid-template-columns: 430px 1fr; align-items: center; gap: 64px; padding: 0 84px; }
  .logo { width: 100%; height: auto; }
  .eyebrow { display: flex; align-items: center; gap: 14px; font-size: 20px; font-weight: 500;
    letter-spacing: .16em; text-transform: uppercase; color: #f8d98a; }
  .eyebrow::before { content: ""; width: 40px; height: 2px; background: rgb(248 217 138 / .6); }
  h1 { margin-top: 22px; font-family: Poppins, sans-serif; font-weight: 600; font-size: 60px; line-height: 1.08;
    letter-spacing: -.02em; color: #faf6ec; }
  h1 span { color: #f5c64f; }
  .facts { margin-top: 36px; padding-top: 28px; border-top: 1px solid rgb(215 207 187 / .18);
    display: flex; gap: 36px; font-size: 22px; }
  .facts b { display: block; font-family: Poppins, sans-serif; font-weight: 600; font-size: 34px; color: #faf6ec; }
  .phone { margin-top: 30px; font-size: 24px; color: #faf6ec; font-weight: 500; }
</style></head>
<body>
  <img class="logo" src="${logo}" alt="">
  <div>
    <p class="eyebrow">${site.city} – ${site.state}</p>
    <h1>Pisos, revestimentos e <span>acabamento.</span></h1>
    <div class="facts">
      <p><b>${site.yearsInBusiness} anos</b>de mercado</p>
      <p><b>${site.google.ratingLabel} ★</b>no Google</p>
      <p><b>${site.instagram.followersLabel}</b>no Instagram</p>
    </div>
    <p class="phone">${site.phone.display}</p>
  </div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
if (!loaded.includes("Poppins") || !loaded.includes("Inter")) throw new Error("Fontes não carregaram — verifique a conexão.");
const out = path.join(root, "public/og-gigante-dos-pisos.png");
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`og: ${path.relative(root, out)}`);
