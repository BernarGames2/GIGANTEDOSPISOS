#!/usr/bin/env node
/**
 * Renderiza os ambientes do simulador (three.js em Chromium headless) e gera
 * as camadas usadas pelo site em public/ambientes/<ambiente>/.
 *
 *   node render/run.mjs inspect            → medidas dos modelos 3D
 *   node render/run.mjs preview sala       → prévia rápida (render/.out/preview-sala.png)
 *   node render/run.mjs render [sala ...]  → render final + pós-processamento
 *
 * Requer Chromium (Playwright). Caminho via CHROMIUM_PATH, se necessário.
 */
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { downloadAssets } from "./assets.mjs";
import { postprocess } from "./postprocess.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "render/.out");
mkdirSync(outDir, { recursive: true });

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".glb": "model/gltf-binary",
  ".hdr": "application/octet-stream",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

function serve() {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
    const file = join(root, path);
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const args = process.argv.slice(2);
const draft = args.includes("--draft");
const [mode = "render", ...rest] = args.filter((a) => !a.startsWith("--"));
await downloadAssets();
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
page.on("console", (m) => console.log(`[page] ${m.text()}`));
page.on("pageerror", (e) => console.log(`[page error] ${e.message}`));
await page.goto(`${base}/render/index.html`);
await page.waitForFunction(() => window.renderer3d !== undefined, null, { timeout: 120000 });

const rooms = rest.length ? rest : ["sala", "cozinha", "banheiro", "externa"];

try {
  if (mode === "inspect") {
    console.log(JSON.stringify(await page.evaluate(() => window.renderer3d.inspect()), null, 2));
  } else if (mode === "preview") {
    for (const id of rooms) {
      const t = Date.now();
      const url = await page.evaluate((room) => window.renderer3d.preview(room), id);
      writeFileSync(join(outDir, `preview-${id}.png`), Buffer.from(url.split(",")[1], "base64"));
      console.log(`prévia ${id}: ${((Date.now() - t) / 1000).toFixed(1)}s`);
    }
  } else {
    for (const id of rooms) {
      const t = Date.now();
      const result = await page.evaluate(([room, q]) => window.renderer3d.render(room, q), [id, draft ? "draft" : "full"]);
      const dir = join(outDir, id);
      mkdirSync(dir, { recursive: true });
      for (const [name, url] of Object.entries(result.passes)) {
        writeFileSync(join(dir, `${name}.png`), Buffer.from(url.split(",")[1], "base64"));
      }
      writeFileSync(join(dir, "meta.json"), JSON.stringify(result.meta, null, 2));
      console.log(`render ${id}: ${((Date.now() - t) / 1000).toFixed(0)}s`);
    }
    await postprocess(rooms);
  }
} finally {
  await browser.close();
  server.close();
}
