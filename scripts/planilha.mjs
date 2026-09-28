#!/usr/bin/env node
/**
 * Planilha de produtos → catálogo do site.
 *
 *   npm run planilha          lê planilha/produtos.xlsx, confere tudo e gera
 *                             src/content/produtos.json (+ texturas das fotos).
 *                             Roda sozinho antes de `npm run build` e `npm run dev`.
 *   npm run planilha:modelo   recria a planilha a partir do catálogo atual
 *                             (não sobrescreve sem --forcar).
 *
 * Fotos das peças: salve em public/produtos/ e escreva o nome do arquivo na
 * coluna "Foto da peça (arquivo)". Ex.: porcelanato-carrara-60x60.jpg
 */
import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

const root = path.resolve(import.meta.dirname, "..");
const XLSX = process.env.PLANILHA ? path.resolve(process.env.PLANILHA) : path.join(root, "planilha/produtos.xlsx");
const OUT_PRODUCTS = path.join(root, "src/content/produtos.json");
const OUT_TEXTURES = path.join(root, "src/content/produtos-texturas.json");
const PHOTO_DIR = path.join(root, "public/produtos");
const ILLUSTRATION_DIR = path.join(root, "public/ilustracoes");

const proceduralTextures = Object.keys(JSON.parse(fs.readFileSync(path.join(root, "src/content/textures.json"), "utf8"))).filter(
  (k) => !k.startsWith("$"),
);
const illustrations = fs
  .readdirSync(ILLUSTRATION_DIR)
  .filter((f) => f.endsWith(".svg") && !/-aplicad[oa]\.svg$/.test(f))
  .map((f) => f.replace(/\.svg$/, ""));

// ---------------------------------------------------------------- colunas
const COLUMNS = [
  { key: "show", header: "Mostrar no site", width: 11, list: "simnao", center: true },
  { key: "name", header: "Nome do produto", width: 36 },
  { key: "category", header: "Categoria", width: 15, list: "categorias" },
  { key: "format", header: "Formato", width: 18 },
  { key: "finish", header: "Acabamento", width: 18, list: "acabamentos", free: true },
  { key: "price", header: "Preço a partir de (R$)", width: 13, price: true },
  { key: "unit", header: "Unidade", width: 10, list: "unidades", center: true },
  { key: "sala", header: "Sala", width: 8, list: "simnao", center: true },
  { key: "cozinha", header: "Cozinha", width: 9, list: "simnao", center: true },
  { key: "banheiro", header: "Banheiro", width: 9, list: "simnao", center: true },
  { key: "externa", header: "Área externa", width: 9, list: "simnao", center: true },
  { key: "simulate", header: "Simulador", width: 14, list: "simulador" },
  { key: "photo", header: "Foto da peça (arquivo)", width: 28 },
  { key: "image", header: "Imagem ilustrativa (se não tiver foto)", width: 30, list: "imagens" },
  { key: "id", header: "Código (não precisa mexer)", width: 30, technical: true },
  { key: "gloss", header: "Reflexo (0 a 1, opcional)", width: 11, technical: true, center: true },
];

const LISTS = {
  simnao: ["Sim", "Não"],
  categorias: ["Piso", "Revestimento", "Acabamento"],
  unidades: ["m²", "barra", "kg", "saco", "peça"],
  simulador: ["Piso", "Parede", "Piso e parede", "Não"],
  acabamentos: ["Polido", "Acetinado", "Fosco", "Brilhante", "Antiderrapante", "Natural", "Lapado"],
  imagens: [...proceduralTextures, ...illustrations],
};

const ENVIRONMENTS = [
  ["sala", "sala"],
  ["cozinha", "cozinha"],
  ["banheiro", "banheiro"],
  ["externa", "externa"],
];
const CATEGORY = { piso: "piso", revestimento: "revestimento", acabamento: "acabamento" };
const UNITS = { "m²": "m²", m2: "m²", "m^2": "m²", barra: "barra", kg: "kg", saco: "saco", "peça": "peça", peca: "peça" };

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const yes = (v) => ["sim", "s", "x", "yes", "1", "true"].includes(norm(v));

function cellText(cell) {
  const v = cell.value;
  if (v == null) return "";
  if (typeof v === "object") {
    if ("richText" in v) return v.richText.map((r) => r.text).join("").trim();
    if ("result" in v) return String(v.result ?? "").trim();
    if ("text" in v) return String(v.text).trim();
    if (v instanceof Date) return v.toISOString();
  }
  return String(v).trim();
}

function cellNumber(cell) {
  const v = cell.value;
  if (typeof v === "number") return v;
  if (v && typeof v === "object" && typeof v.result === "number") return v.result;
  const t = cellText(cell).replace(/r\$|\s/gi, "");
  if (!t) return NaN;
  // "1.234,56" ou "79,90" ou "79.90"
  const n = t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t;
  return Number(n);
}

/** "60 × 60 cm", "20x120", "7,5 x 15 cm", "0,6 x 0,6 m" → [larguraCm, alturaCm] */
function parseFormatCm(format) {
  const m = norm(format).match(/(\d+(?:[.,]\d+)?)\s*[x×*]\s*(\d+(?:[.,]\d+)?)\s*(mm|cm|m)?\b/);
  if (!m) return null;
  const factor = { mm: 0.1, cm: 1, m: 100 }[m[3] ?? "cm"];
  return [Number(m[1].replace(",", ".")) * factor, Number(m[2].replace(",", ".")) * factor];
}

function glossFromFinish(finish) {
  const f = norm(finish);
  if (f.includes("polido")) return 1;
  if (f.includes("brilhante") || f.includes("lapado")) return 0.6;
  if (f.includes("acetinado")) return 0.4;
  return 0;
}

function illustrationFor(name) {
  const hover = ["aplicado", "aplicada"].map((s) => `${name}-${s}.svg`).find((f) => fs.existsSync(path.join(ILLUSTRATION_DIR, f)));
  return { src: `/ilustracoes/${name}.svg`, ...(hover ? { hoverSrc: `/ilustracoes/${hover}` } : null) };
}

// ---------------------------------------------------------------- ler
async function read() {
  if (!fs.existsSync(XLSX)) {
    console.log("planilha: planilha/produtos.xlsx não encontrada — mantendo o catálogo atual.");
    return;
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const ws = wb.getWorksheet("Produtos");
  if (!ws) fail(['A planilha precisa ter uma aba chamada "Produtos".']);

  // Mapeia cabeçalhos (tolerante a acento/maiúscula e à ordem das colunas).
  const colOf = {};
  ws.getRow(1).eachCell((cell, col) => {
    const h = norm(cellText(cell));
    const c = COLUMNS.find((c) => norm(c.header) === h || h.startsWith(norm(c.header).split(" (")[0]));
    if (c && !colOf[c.key]) colOf[c.key] = col;
  });
  const missing = COLUMNS.filter((c) => !c.technical && !colOf[c.key]).map((c) => `"${c.header}"`);
  if (missing.length) fail([`Faltam colunas na aba "Produtos": ${missing.join(", ")}.`]);

  const errors = [];
  const products = [];
  const textures = {};
  const ids = new Set();
  let hidden = 0;
  let photos = 0;

  ws.eachRow({ includeEmpty: false }, (row, r) => {
    if (r === 1) return;
    const get = (k) => (colOf[k] ? row.getCell(colOf[k]) : null);
    const text = (k) => (colOf[k] ? cellText(get(k)) : "");
    const name = text("name");
    const filled = COLUMNS.some((c) => colOf[c.key] && text(c.key));
    if (!filled) return;
    const err = (msg) => errors.push(`Linha ${r}${name ? ` (${name})` : ""}: ${msg}`);

    if (!name) return err('preencha o "Nome do produto".');
    if (text("show") && !yes(text("show"))) {
      hidden++;
      return;
    }

    const category = CATEGORY[norm(text("category"))];
    if (!category) err(`categoria "${text("category")}" inválida — use Piso, Revestimento ou Acabamento.`);

    const format = text("format");
    if (!format) err('preencha o "Formato" (ex.: 60 × 60 cm).');
    const finish = text("finish");
    if (!finish) err('preencha o "Acabamento" (ex.: Polido, Acetinado, Fosco).');

    const price = cellNumber(get("price"));
    if (!(price > 0)) err(`preço "${text("price")}" inválido — use só o número, ex.: 79,90.`);

    const unit = UNITS[norm(text("unit"))] ?? UNITS[text("unit")];
    if (!unit) err(`unidade "${text("unit")}" inválida — use m², barra, kg, saco ou peça.`);

    const environments = ENVIRONMENTS.filter(([k]) => yes(text(k))).map(([, env]) => env);
    if (!environments.length) err("marque \"Sim\" em pelo menos um ambiente (Sala, Cozinha, Banheiro ou Área externa).");

    const simText = norm(text("simulate") || "não");
    const simulate = { piso: ["floor"], parede: ["wall"], "piso e parede": ["floor", "wall"], nao: [] }[simText];
    if (!simulate) err(`"Simulador" deve ser Piso, Parede, Piso e parede ou Não (está "${text("simulate")}").`);

    let id = slug(text("id") || name);
    if (ids.has(id)) {
      if (text("id")) err(`código "${id}" repetido — cada produto precisa de um código diferente.`);
      let n = 2;
      while (ids.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    ids.add(id);

    const product = { id, name, category, environments, format, finish, price: Math.round(price * 100) / 100, unit };

    const photo = text("photo");
    const image = text("image");
    if (photo) {
      if (!fs.existsSync(path.join(PHOTO_DIR, photo))) err(`foto "${photo}" não encontrada em public/produtos/.`);
      photos++;
      if (simulate?.length) {
        const size = parseFormatCm(format);
        if (!size) err('para usar a foto no simulador, escreva o formato com as medidas (ex.: 60 × 60 cm).');
        else {
          textures[id] = { src: `/produtos/${photo}`, size };
          product.texture = id;
        }
      } else {
        product.illustration = { src: `/produtos/${photo}` };
      }
    } else if (image) {
      if (proceduralTextures.includes(image)) product.texture = image;
      else if (illustrations.includes(image)) product.illustration = illustrationFor(image);
      else err(`imagem ilustrativa "${image}" não existe — escolha uma da lista.`);
    } else {
      err('informe a "Foto da peça" ou escolha uma "Imagem ilustrativa".');
    }

    if (simulate?.length) {
      if (!product.texture) err("para aparecer no simulador, o produto precisa de uma foto da peça ou de uma textura ilustrativa.");
      // Revestimento que serve para piso e parede abre primeiro na parede.
      product.simulate = category === "revestimento" && simulate.length === 2 ? ["wall", "floor"] : simulate;
    }

    const glossText = text("gloss");
    if (glossText) {
      const g = cellNumber(get("gloss"));
      if (!(g >= 0 && g <= 1)) err(`"Reflexo" deve ser um número de 0 a 1 (está "${glossText}").`);
      else product.gloss = g;
    } else if (simulate?.includes("floor")) {
      product.gloss = glossFromFinish(finish);
    }

    products.push(product);
  });

  if (errors.length) fail(errors);
  if (!products.length) fail(["Nenhum produto com \"Mostrar no site\" = Sim."]);

  writeJson(OUT_PRODUCTS, products);
  writeJson(OUT_TEXTURES, textures);
  console.log(
    `planilha: ${products.length} produtos no site` +
      (hidden ? `, ${hidden} ${hidden === 1 ? "oculto" : "ocultos"}` : "") +
      (photos ? `, ${photos} com foto` : "") +
      ` → ${path.relative(root, OUT_PRODUCTS)}`,
  );
}

function writeJson(file, data) {
  const json = `${JSON.stringify(data, null, 2)}\n`;
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== json) fs.writeFileSync(file, json);
}

function fail(errors) {
  console.error(`\n${path.relative(root, XLSX)} tem problemas — o catálogo NÃO foi atualizado:\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error("\nCorrija a planilha e rode de novo (npm run planilha).\n");
  process.exit(1);
}

// ---------------------------------------------------------------- modelo
async function template() {
  if (fs.existsSync(XLSX) && !process.argv.includes("--forcar")) {
    console.error("planilha/produtos.xlsx já existe. Para recriar do zero: npm run planilha:modelo -- --forcar");
    process.exit(1);
  }
  const products = JSON.parse(fs.readFileSync(OUT_PRODUCTS, "utf8"));
  const photoTextures = fs.existsSync(OUT_TEXTURES) ? JSON.parse(fs.readFileSync(OUT_TEXTURES, "utf8")) : {};

  const wb = new ExcelJS.Workbook();
  wb.creator = "Gigante dos Pisos";
  wb.created = new Date();

  const GREEN = "FF123322";
  const CREAM = "FFFAF6EC";
  const GOLD = "FFF0B429";
  const thin = { style: "thin", color: { argb: "FFD9CBAD" } };

  // ----- aba de instruções
  const help = wb.addWorksheet("Como preencher", { properties: { tabColor: { argb: GOLD } }, views: [{ showGridLines: false }] });
  help.getColumn(1).width = 3;
  help.getColumn(2).width = 110;
  const lines = [
    ["title", "Planilha de produtos — Gigante dos Pisos"],
    ["text", "Cada linha da aba \"Produtos\" é um produto do catálogo do site. O simulador de ambientes usa os mesmos dados."],
    ["space"],
    ["h", "Como atualizar o site"],
    ["text", "1. Abra a aba \"Produtos\" e altere o que precisar: preço, nome, formato, ambientes…"],
    ["text", "2. Para incluir um produto, preencha uma linha nova no fim da lista. Para tirar do site sem apagar, mude \"Mostrar no site\" para Não."],
    ["text", "3. Salve como .xlsx (no Google Planilhas: Arquivo → Fazer download → Microsoft Excel)."],
    ["text", "4. Envie o arquivo para o GitHub em planilha/produtos.xlsx (Add file → Upload files → Commit changes)."],
    ["text", "5. O site é publicado de novo sozinho em poucos minutos. Se algo estiver errado, o site continua como estava e o aviso diz a linha."],
    ["space"],
    ["h", "O que vai em cada coluna"],
    ["text", "Mostrar no site — Sim ou Não."],
    ["text", "Nome do produto — como o cliente vai ver. Ex.: Porcelanato polido marmorizado."],
    ["text", "Categoria — Piso, Revestimento ou Acabamento (é o filtro do catálogo)."],
    ["text", "Formato — tamanho da peça. Ex.: 60 × 60 cm, 20 × 120 cm, 10 cm × 2,40 m."],
    ["text", "Acabamento — Polido, Acetinado, Fosco, Brilhante, Antiderrapante… (dá para escrever outro)."],
    ["text", "Preço a partir de (R$) — só o número. Ex.: 79,90."],
    ["text", "Unidade — m², barra, kg, saco ou peça."],
    ["text", "Sala / Cozinha / Banheiro / Área externa — Sim nos ambientes em que o produto pode ser usado (filtro do catálogo e do simulador)."],
    ["text", "Simulador — Piso, Parede, Piso e parede, ou Não (acabamentos, argamassa, rejunte…)."],
    ["text", "Foto da peça (arquivo) — nome da foto salva em public/produtos/. Ex.: carrara-60x60.jpg. Use a foto de UMA peça, de frente, sem sombra."],
    ["text", "Imagem ilustrativa — só se ainda não tiver foto: escolha uma textura da lista."],
    ["text", "Código e Reflexo (colunas cinza) — preenchidos automaticamente; não precisa mexer."],
    ["space"],
    ["h", "Dicas"],
    ["text", "• Com foto e formato (ex.: 60 × 60 cm), o simulador usa a foto real da peça no tamanho certo."],
    ["text", "• Não apague a linha de títulos nem mude o nome das colunas."],
    ["text", "• Os preços aparecem como \"a partir de\" — confira antes de publicar."],
  ];
  lines.forEach(([kind, value], i) => {
    const cell = help.getCell(i + 2, 2);
    cell.value = value ?? "";
    cell.alignment = { wrapText: true, vertical: "middle" };
    if (kind === "title") {
      cell.font = { name: "Calibri", size: 20, bold: true, color: { argb: GREEN } };
      help.getRow(i + 2).height = 34;
    } else if (kind === "h") {
      cell.font = { name: "Calibri", size: 14, bold: true, color: { argb: GREEN } };
      cell.border = { bottom: { style: "thin", color: { argb: GOLD } } };
      help.getRow(i + 2).height = 26;
    } else {
      cell.font = { name: "Calibri", size: 12, color: { argb: "FF16241C" } };
      help.getRow(i + 2).height = 20;
    }
  });

  // ----- aba de produtos
  const ws = wb.addWorksheet("Produtos", {
    properties: { tabColor: { argb: GREEN } },
    views: [{ state: "frozen", xSplit: 2, ySplit: 1, activeCell: "B2" }],
  });
  ws.columns = COLUMNS.map((c) => ({ key: c.key, width: c.width }));
  const header = ws.getRow(1);
  COLUMNS.forEach((c, i) => {
    const cell = header.getCell(i + 1);
    cell.value = c.header;
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: c.technical ? "FF45544B" : CREAM } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.technical ? "FFE9DFC9" : GREEN } };
    cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
    cell.border = { top: thin, bottom: thin, left: thin, right: thin };
  });
  header.height = 36;

  const simLabel = (s = []) =>
    s.includes("floor") && s.includes("wall") ? "Piso e parede" : s.includes("floor") ? "Piso" : s.includes("wall") ? "Parede" : "Não";
  const imageOf = (p) => {
    if (p.texture && !photoTextures[p.texture]) return p.texture;
    if (p.illustration?.src?.startsWith("/ilustracoes/")) return path.basename(p.illustration.src, ".svg");
    return "";
  };
  const photoOf = (p) => {
    if (p.texture && photoTextures[p.texture]) return path.basename(photoTextures[p.texture].src);
    if (p.illustration?.src?.startsWith("/produtos/")) return path.basename(p.illustration.src);
    return "";
  };

  products.forEach((p) => {
    ws.addRow({
      show: "Sim",
      name: p.name,
      category: { piso: "Piso", revestimento: "Revestimento", acabamento: "Acabamento" }[p.category],
      format: p.format,
      finish: p.finish,
      price: p.price,
      unit: p.unit,
      sala: p.environments.includes("sala") ? "Sim" : "Não",
      cozinha: p.environments.includes("cozinha") ? "Sim" : "Não",
      banheiro: p.environments.includes("banheiro") ? "Sim" : "Não",
      externa: p.environments.includes("externa") ? "Sim" : "Não",
      simulate: simLabel(p.simulate),
      photo: photoOf(p),
      image: imageOf(p),
      id: p.id,
      gloss: p.gloss ?? null,
    });
  });

  // Formatação e listas suspensas para 500 linhas (espaço para crescer).
  const LAST = 500;
  for (let r = 2; r <= LAST; r++) {
    const row = ws.getRow(r);
    COLUMNS.forEach((c, i) => {
      const cell = row.getCell(i + 1);
      cell.font = { name: "Calibri", size: 11, color: { argb: c.technical ? "FF5A665E" : "FF16241C" } };
      cell.alignment = { vertical: "middle", horizontal: c.center ? "center" : "left" };
      cell.border = { bottom: { style: "thin", color: { argb: "FFE9DFC9" } } };
      if (c.technical) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF6F1E6" } };
      else if (r % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
      if (c.price) cell.numFmt = '"R$" #,##0.00';
      if (c.list) {
        cell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Listas!$${listColumn(c.list)}$2:$${listColumn(c.list)}$${LISTS[c.list].length + 1}`],
          showErrorMessage: !c.free,
          errorStyle: "stop",
          errorTitle: "Valor inválido",
          error: `Escolha uma opção da lista: ${LISTS[c.list].slice(0, 6).join(", ")}${LISTS[c.list].length > 6 ? "…" : ""}`,
        };
      }
      if (c.price) {
        cell.dataValidation = {
          type: "decimal",
          operator: "greaterThan",
          formulae: [0],
          allowBlank: true,
          showErrorMessage: true,
          errorTitle: "Preço inválido",
          error: "Digite só o número, ex.: 79,90",
        };
      }
    });
    row.height = 20;
  }
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLUMNS.length } };

  // ----- listas (oculta)
  const lists = wb.addWorksheet("Listas", { state: "hidden" });
  Object.entries(LISTS).forEach(([name, values], i) => {
    lists.getCell(1, i + 1).value = name;
    values.forEach((v, j) => (lists.getCell(j + 2, i + 1).value = v));
  });

  wb.views = [{ activeTab: 1 }];
  fs.mkdirSync(path.dirname(XLSX), { recursive: true });
  await wb.xlsx.writeFile(XLSX);
  console.log(`planilha: modelo criado com ${products.length} produtos → ${path.relative(root, XLSX)}`);

  function listColumn(name) {
    return String.fromCharCode(65 + Object.keys(LISTS).indexOf(name));
  }
}

if (process.argv.includes("modelo")) await template();
else await read();
