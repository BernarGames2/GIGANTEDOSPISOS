/**
 * Cena 3D dos ambientes do simulador (roda no navegador, via render/run.mjs).
 *
 * Para cada ambiente são gerados passes alinhados pixel a pixel:
 *   beauty  → imagem final (com parede pintada e piso neutro)
 *   fg      → beauty com transparência onde há piso/parede revestível (móveis por cima)
 *   floorMask / wallMask → onde o piso e as paredes revestíveis aparecem
 *   shade   → luz e sombra sobre piso/paredes (sol, sombras de contato, oclusão)
 *   light   → excesso de luz (manchas de sol), aplicado com "screen"
 *   refl    → reflexo espelhado do ambiente no piso (com Fresnel)
 * e os quadriláteros de projeção de cada superfície (homografia no site).
 *
 * Coordenadas em metros: x → direita, y → cima, câmera olhando para −z.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

RectAreaLightUniformsLib.init();

const QUALITY = {
  full: { w: 1600, h: 1000, beauty: 40, shade: 24, mask: 12, refl: 16 },
  preview: { w: 800, h: 500, beauty: 3, shade: 1, mask: 1, refl: 1 },
  draft: { w: 800, h: 500, beauty: 4, shade: 2, mask: 2, refl: 2 },
};

const canvas = document.createElement("canvas");
document.body.append(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnvironment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

/* ---------- carregamento ---------- */

const gltfLoader = new GLTFLoader();
const hdrLoader = new HDRLoader();
const modelCache = new Map();
const hdrCache = new Map();

async function loadModel(name) {
  if (!modelCache.has(name)) modelCache.set(name, gltfLoader.loadAsync(`/render/.cache/${name}.glb`));
  const gltf = await modelCache.get(name);
  const obj = gltf.scene.clone(true);
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return obj;
}

async function loadSky(name) {
  if (!hdrCache.has(name)) {
    hdrCache.set(
      name,
      hdrLoader.loadAsync(`/render/.cache/${name}.hdr`).then((t) => {
        t.mapping = THREE.EquirectangularReflectionMapping;
        return t;
      }),
    );
  }
  return hdrCache.get(name);
}

/** Textura do site (SVG) rasterizada para uso em madeira/pedra dos móveis. */
const svgCache = new Map();
async function svgTexture(id, repeatU, repeatV) {
  if (!svgCache.has(id)) {
    svgCache.set(
      id,
      (async () => {
        const img = new Image();
        img.src = `/public/texturas/${id}.svg`;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = 1024;
        c.height = Math.round((1024 * img.naturalHeight) / img.naturalWidth);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        return c;
      })(),
    );
  }
  const c = await svgCache.get(id);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.repeat.set(repeatU, repeatV);
  return t;
}

/* ---------- utilitários de modelagem ---------- */

const std = (color, roughness = 0.6, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const phys = (color, roughness = 0.4, extra = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0, ...extra });

function add(parent, geo, mat, [x, y, z] = [0, 0, 0], opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (opts.rot) m.rotation.set(...opts.rot);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.receive ?? true;
  if (opts.tag) m.userData.tag = opts.tag;
  parent.add(m);
  return m;
}

/** Caixa por limites [x0,x1]×[y0,y1]×[z0,z1], opcionalmente arredondada. */
function box(parent, [x0, x1], [y0, y1], [z0, z1], mat, radius = 0, opts = {}) {
  const w = x1 - x0;
  const h = y1 - y0;
  const d = z1 - z0;
  const r = Math.min(radius, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
  const geo = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  return add(parent, geo, mat, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], opts);
}

/**
 * Parede com aberturas (janelas/portas), extrudada para dentro do ambiente.
 * origin: canto inferior externo; u: direção ao longo da parede; a face
 * interna fica no plano da parede.
 */
function wall(parent, { origin, u, length, height, holes = [], thickness = 0.15, mat, tag }) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(length, 0);
  shape.lineTo(length, height);
  shape.lineTo(0, height);
  shape.closePath();
  for (const [u0, u1, v0, v1] of holes) {
    const hole = new THREE.Path();
    hole.moveTo(u0, v0);
    hole.lineTo(u0, v1);
    hole.lineTo(u1, v1);
    hole.lineTo(u1, v0);
    hole.closePath();
    shape.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  const uDir = new THREE.Vector3(...u);
  const vDir = new THREE.Vector3(0, 1, 0);
  const nDir = new THREE.Vector3().crossVectors(uDir, vDir);
  const m = new THREE.Mesh(geo, mat);
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(uDir, vDir, nDir));
  m.position.set(...origin).addScaledVector(nDir, -thickness);
  m.castShadow = true;
  m.receiveShadow = true;
  m.userData.tag = tag;
  parent.add(m);
  return m;
}

/** Troca a cor base (e o brilho aveludado, se houver) de um modelo. */
function tint(obj, color, sheen) {
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.material = o.material.clone();
    o.material.color?.set(color);
    if (sheen && o.material.sheenColor) o.material.sheenColor.set(sheen);
  });
  return obj;
}

/** Posiciona um modelo: base no chão (ou em y), centro em x/z, largura desejada. */
function place(obj, { x, z, y = 0, rotY = 0, width, height }) {
  obj.rotation.y = rotY;
  obj.updateMatrixWorld(true);
  let b = new THREE.Box3().setFromObject(obj);
  const size = b.getSize(new THREE.Vector3());
  const s = width ? width / size.x : height ? height / size.y : 1;
  obj.scale.multiplyScalar(s);
  obj.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(obj);
  const c = b.getCenter(new THREE.Vector3());
  obj.position.x += x - c.x;
  obj.position.z += z - c.z;
  obj.position.y += y - b.min.y;
  return obj;
}

/** Cortina com pregas (plano ondulado) paralela a uma parede lateral. */
function curtain(parent, { x, z0, z1, y0, y1, color }) {
  const len = Math.abs(z1 - z0);
  const geo = new THREE.PlaneGeometry(len, y1 - y0, 60, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    pos.setZ(i, 0.035 * Math.sin((px / len) * Math.PI * 2 * (len / 0.14)));
  }
  geo.computeVertexNormals();
  const m = add(parent, geo, std(color, 0.95, 0, { side: THREE.DoubleSide }), [x, (y0 + y1) / 2, (z0 + z1) / 2], {
    rot: [0, Math.PI / 2, 0],
  });
  return m;
}

/** Arte abstrata (cores da marca) para quadros. */
function artTexture() {
  const c = document.createElement("canvas");
  c.width = 900;
  c.height = 600;
  const g = c.getContext("2d");
  g.fillStyle = "#efe7d6";
  g.fillRect(0, 0, 900, 600);
  g.fillStyle = "#1e3d28";
  g.fillRect(90, 110, 330, 400);
  g.fillStyle = "#f0b429";
  g.beginPath();
  g.arc(560, 260, 150, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#c6432a";
  g.beginPath();
  g.moveTo(460, 520);
  g.lineTo(640, 340);
  g.lineTo(820, 520);
  g.fill();
  g.strokeStyle = "#16241c";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(90, 540);
  g.lineTo(820, 540);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function frameArt(parent, { x, y, z, w, h }) {
  box(parent, [x - w / 2, x + w / 2], [y - h / 2, y + h / 2], [z, z + 0.035], std("#2a2420", 0.5), 0.004);
  add(parent, new THREE.PlaneGeometry(w - 0.1, h - 0.1), std("#ffffff", 0.9, 0, { map: artTexture() }), [x, y, z + 0.037], {
    cast: false,
  });
}

function downlight(parent, lights, { x, z, H, intensity = 6, angle = 0.9 }) {
  add(parent, new THREE.CylinderGeometry(0.06, 0.06, 0.01, 24), std("#fff6e5", 0.4, 0, { emissive: "#fff1d6", emissiveIntensity: 3 }), [
    x,
    H - 0.004,
    z,
  ], { cast: false });
  const s = new THREE.SpotLight("#ffe2b8", intensity, 7, angle / 2, 1, 2);
  s.position.set(x, H - 0.02, z);
  s.target.position.set(x, 0, z);
  parent.add(s, s.target);
  lights.push(s);
}

/** Luz do sol com sombras suaves (a posição varia levemente entre amostras). */
function sun(parent, { from, to, intensity, bounds }) {
  const l = new THREE.DirectionalLight("#ffe4c0", intensity);
  l.position.set(...from);
  l.target.position.set(...to);
  l.castShadow = true;
  l.shadow.mapSize.set(4096, 4096);
  l.shadow.bias = -0.0002;
  l.shadow.normalBias = 0.02;
  const cam = l.shadow.camera;
  cam.left = -bounds;
  cam.right = bounds;
  cam.top = bounds;
  cam.bottom = -bounds;
  cam.near = 0.5;
  cam.far = 40;
  parent.add(l, l.target);
  l.userData.base = l.position.clone();
  return l;
}

/** Luz difusa de céu entrando por uma janela. */
function skyFill(parent, { pos, lookAt, w, h, intensity }) {
  const l = new THREE.RectAreaLight("#e6eeff", intensity, w, h);
  l.position.set(...pos);
  l.lookAt(...lookAt);
  parent.add(l);
}

/* ---------- ambientes ---------- */

const PAINT = "#e8e0d0";
const CEILING = "#f3f0ea";

async function baseRoom({ W, D, H, zFront, camera, walls, sky, envIntensity = 0.6 }) {
  const scene = new THREE.Scene();
  const world = new THREE.Group();
  scene.add(world);
  scene.environment = roomEnvironment;
  scene.environmentIntensity = envIntensity;
  scene.background = await loadSky(sky);
  scene.backgroundIntensity = 0.9;

  const floor = add(scene, new THREE.PlaneGeometry(W, D + zFront + 1), std("#b8a88f", 0.55), [0, 0, (zFront + 1 - D) / 2], {
    rot: [-Math.PI / 2, 0, 0],
    cast: false,
    tag: "floor",
  });

  const paint = std(PAINT, 0.92);
  const wallMeshes = {};
  if (walls.back !== false) {
    wallMeshes.back = wall(world, { origin: [-W / 2, 0, -D], u: [1, 0, 0], length: W, height: H, holes: walls.back?.holes, mat: paint, tag: "back" });
  }
  if (walls.left !== false) {
    wallMeshes.left = wall(world, { origin: [-W / 2, 0, zFront + 1], u: [0, 0, -1], length: D + zFront + 1, height: H, holes: walls.left?.holes, mat: paint, tag: "left" });
  }
  if (walls.right !== false) {
    wallMeshes.right = wall(world, { origin: [W / 2, 0, -D], u: [0, 0, 1], length: D + zFront + 1, height: H, holes: walls.right?.holes, mat: paint, tag: "right" });
  }
  if (walls.ceiling !== false) {
    box(world, [-W / 2 - 0.2, W / 2 + 0.2], [H, H + 0.15], [-D - 0.2, zFront + 1], std(CEILING, 0.95), 0, { tag: "ceiling" });
  }
  // Rodapés
  const bb = std("#f3efe7", 0.45);
  if (walls.back !== false) box(world, [-W / 2, W / 2], [0, 0.08], [-D, -D + 0.014], bb);
  if (walls.left !== false) box(world, [-W / 2, -W / 2 + 0.014], [0, 0.08], [-D, zFront], bb);
  if (walls.right !== false) box(world, [W / 2 - 0.014, W / 2], [0, 0.08], [-D, zFront], bb);

  const cam = new THREE.PerspectiveCamera(camera.fov, 1.6, 0.05, 80);
  cam.position.set(...camera.pos);
  cam.lookAt(camera.pos[0], camera.pos[1], camera.pos[2] - 1);
  cam.updateMatrixWorld(true);

  return { scene, world, floor, walls: wallMeshes, camera: cam, lights: [], W, D, H, zFront };
}

/** Luz suave vinda de trás da câmera (o restante da casa). */
function frontFill(parent, { W, H, z, intensity = 1.2 }) {
  const l = new THREE.RectAreaLight("#fff3e2", intensity, W * 0.9, H * 0.8);
  l.position.set(0, H * 0.55, z);
  l.lookAt(0, H * 0.45, z - 5);
  parent.add(l);
}

async function buildSala() {
  const W = 5.2;
  const D = 6.0;
  const H = 2.8;
  const r = await baseRoom({
    W,
    D,
    H,
    zFront: 0.3,
    camera: { pos: [0.35, 1.3, 0], fov: 50 },
    // Parede esquerda: u começa em z = zFront + 1 = 1,3 e avança para −z → janela de z −2,9 a −5,0.
    walls: { left: { holes: [[4.2, 6.3, 0.45, 2.45]] } },
    sky: "skyField",
  });
  const { world } = r;
  r.jitter = sunJitter(
    sun(world, { from: [-7.5, 6.2, -0.8], to: [0.4, 0, -3.2], intensity: 11, bounds: 7 }),
    0.18,
  );
  skyFill(world, { pos: [-W / 2 + 0.05, 1.45, -3.95], lookAt: [0, 1.2, -3.95], w: 2.1, h: 2.0, intensity: 4 });
  curtain(world, { x: -W / 2 + 0.09, z0: -2.45, z1: -2.85, y0: 0.05, y1: 2.6, color: "#e4d8c3" });
  curtain(world, { x: -W / 2 + 0.09, z0: -5.05, z1: -5.45, y0: 0.05, y1: 2.6, color: "#e4d8c3" });
  box(world, [-W / 2 + 0.02, -W / 2 + 0.05], [2.62, 2.66], [-5.6, -2.3], std("#2b2b28", 0.4, 0.6));

  const sofa = place(tint(await loadModel("sofa"), "#2f5a41", "#6f9a7c"), { x: 0.55, z: -D + 0.52, width: 2.3 });
  world.add(sofa);
  const pouf = place(tint(await loadModel("pouf"), "#d69a2a"), { x: -0.55, z: -3.95, width: 0.55 });
  world.add(pouf);
  const chair = place(await loadModel("chair"), { x: 1.85, z: -3.85, rotY: -2.3, width: 0.8 });
  world.add(chair);
  const plant = place(await loadModel("plant"), { x: -2.05, z: -5.5, height: 1.05 });
  world.add(plant);

  // Mesa de centro (pedestal) com tampo de madeira
  const oak = std("#ffffff", 0.5, 0, { map: await svgTexture("vinilico-carvalho-claro", 0.9, 0.45) });
  add(world, new THREE.CylinderGeometry(0.46, 0.46, 0.035, 64), oak, [0.55, 0.405, -4.45]);
  add(world, new THREE.CylinderGeometry(0.06, 0.08, 0.37, 32), std("#1d1d1b", 0.35, 0.7), [0.55, 0.2, -4.45]);
  add(world, new THREE.CylinderGeometry(0.24, 0.26, 0.025, 48), std("#1d1d1b", 0.35, 0.7), [0.55, 0.0125, -4.45]);
  const books = std("#c6432a", 0.7);
  box(world, [0.35, 0.62], [0.423, 0.455], [-4.52, -4.33], books, 0.004);
  box(world, [0.37, 0.6], [0.455, 0.48], [-4.5, -4.35], std("#e9e2d2", 0.7), 0.004);

  // Mesa lateral + luminária
  add(world, new THREE.CylinderGeometry(0.22, 0.22, 0.03, 48), std("#1d1d1b", 0.3, 0.7), [2.15, 0.56, -5.62]);
  add(world, new THREE.CylinderGeometry(0.02, 0.02, 0.55, 16), std("#1d1d1b", 0.3, 0.7), [2.15, 0.28, -5.62]);
  add(world, new THREE.CylinderGeometry(0.16, 0.18, 0.02, 32), std("#1d1d1b", 0.3, 0.7), [2.15, 0.01, -5.62]);
  const lamp = place(await loadModel("lamp"), { x: 2.15, z: -5.62, y: 0.575, height: 0.5 });
  world.add(lamp);

  frameArt(world, { x: 0.55, y: 1.72, z: -D + 0.001, w: 1.3, h: 0.86 });
  frontFill(world, { W, H, z: 0.25 });
  for (const [x, z] of [
    [-1.2, -2.2],
    [1.4, -2.2],
    [-1.2, -4.6],
    [1.4, -4.6],
  ]) {
    downlight(world, r.lights, { x, z, H, intensity: 3 });
  }
  r.wallSurfaces = ["back"];
  return r;
}

function sunJitter(light, radius) {
  const base = light.userData.base.clone();
  return (i, n) => {
    if (n <= 1) return;
    const a = i * 2.39996;
    const rr = radius * Math.sqrt((i + 0.5) / n);
    light.position.set(base.x + Math.cos(a) * rr, base.y + Math.sin(a) * rr, base.z + Math.sin(a) * rr * 0.5);
  };
}

async function buildCozinha() {
  const W = 4.4;
  const D = 5.3;
  const H = 2.8;
  const r = await baseRoom({
    W,
    D,
    H,
    zFront: 0.3,
    camera: { pos: [-0.15, 1.32, 0], fov: 52 },
    walls: { left: { holes: [[3.4, 4.8, 1.0, 2.3]] } },
    sky: "skyField",
  });
  const { world } = r;
  r.jitter = sunJitter(sun(world, { from: [-7, 7.5, 0.5], to: [0.2, 0, -3.3], intensity: 5, bounds: 7 }), 0.18);
  skyFill(world, { pos: [-W / 2 + 0.05, 1.65, -2.8], lookAt: [0, 1.4, -2.8], w: 1.4, h: 1.3, intensity: 4 });

  const z0 = -D;
  const green = phys("#1f4a33", 0.38, { clearcoat: 0.35, clearcoatRoughness: 0.3 });
  const carcass = std("#1a3a28", 0.6);
  const brass = std("#c9a24a", 0.28, 1);
  const quartz = phys("#ece8e0", 0.18, { clearcoat: 0.2 });
  const steel = std("#c8cbcb", 0.3, 1);

  const runX = [-W / 2, 1.22];
  box(world, runX, [0, 0.1], [z0, z0 + 0.54], std("#15291d", 0.7));
  box(world, runX, [0.1, 0.86], [z0, z0 + 0.58], carcass);
  const doors = 6;
  const dw = (runX[1] - runX[0]) / doors;
  for (let i = 0; i < doors; i++) {
    const x0 = runX[0] + i * dw + 0.002;
    box(world, [x0, x0 + dw - 0.004], [0.105, 0.855], [z0 + 0.58, z0 + 0.6], green, 0.004);
    const hx = i % 2 === 0 ? x0 + dw - 0.07 : x0 + 0.07;
    add(world, new THREE.CylinderGeometry(0.007, 0.007, 0.2, 12), brass, [hx, 0.66, z0 + 0.625]);
  }
  box(world, [runX[0], runX[1] + 0.02], [0.86, 0.892], [z0, z0 + 0.63], quartz, 0.003);
  // Cuba e torneira
  box(world, [-1.25, -0.7], [0.886, 0.8935], [z0 + 0.12, z0 + 0.5], std("#3b3f41", 0.35, 0.8), 0.01);
  const faucet = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.975, 0.89, z0 + 0.08),
    new THREE.Vector3(-0.975, 1.2, z0 + 0.1),
    new THREE.Vector3(-0.975, 1.28, z0 + 0.2),
    new THREE.Vector3(-0.975, 1.2, z0 + 0.3),
    new THREE.Vector3(-0.975, 1.12, z0 + 0.31),
  ]);
  add(world, new THREE.TubeGeometry(faucet, 40, 0.013, 12), brass);
  // Cooktop
  box(world, [0.05, 0.65], [0.892, 0.898], [z0 + 0.08, z0 + 0.56], phys("#0e0e0e", 0.06, { clearcoat: 1 }), 0.004);
  // Coifa
  box(world, [0.08, 0.62], [1.62, 1.72], [z0, z0 + 0.5], steel, 0.01);
  add(world, new THREE.CylinderGeometry(0.1, 0.24, 0.22, 4, 1, false, Math.PI / 4), steel, [0.35, 1.83, z0 + 0.25]);
  box(world, [0.27, 0.43], [1.94, H], [z0, z0 + 0.16], steel);
  // Prateleiras de madeira com objetos
  const oak = std("#ffffff", 0.5, 0, { map: await svgTexture("vinilico-carvalho-claro", 1.4, 0.3) });
  for (const y of [1.55, 1.95]) box(world, [-2.05, -0.55], [y, y + 0.04], [z0, z0 + 0.27], oak, 0.004);
  const ceramic = std("#f2eee6", 0.3);
  for (let i = 0; i < 4; i++) add(world, new THREE.CylinderGeometry(0.11, 0.1, 0.02, 40), ceramic, [-1.8, 1.6 + i * 0.02, z0 + 0.14]);
  add(world, new THREE.CylinderGeometry(0.05, 0.05, 0.18, 32), phys("#e8e3d8", 0.1, { transmission: 0, transparent: true, opacity: 0.55 }), [-1.4, 1.68, z0 + 0.14]);
  add(world, new THREE.CylinderGeometry(0.045, 0.045, 0.14, 32), std("#c6432a", 0.45), [-1.25, 1.66, z0 + 0.14]);
  add(world, new THREE.CylinderGeometry(0.06, 0.05, 0.16, 32), std("#1f4a33", 0.45), [-0.9, 2.07, z0 + 0.14]);
  add(world, new THREE.CylinderGeometry(0.1, 0.1, 0.03, 40), std("#b88a5e", 0.6), [-1.55, 2.005, z0 + 0.14]);
  const flowers = place(await loadModel("flowers"), { x: -0.25, z: z0 + 0.3, y: 0.892, height: 0.45 });
  world.add(flowers);
  // Tábua e utensílios
  box(world, [0.8, 1.15], [0.892, 0.912], [z0 + 0.08, z0 + 0.34], oak, 0.006);
  // Geladeira
  const fx = [1.32, W / 2];
  box(world, fx, [0, 2.02], [z0, z0 + 0.72], steel, 0.02);
  box(world, [fx[0] - 0.001, fx[1] + 0.001], [1.3, 1.31], [z0 + 0.1, z0 + 0.721], std("#8d9191", 0.4, 1));
  add(world, new THREE.CylinderGeometry(0.01, 0.01, 0.5, 12), std("#9ea2a2", 0.25, 1), [fx[0] + 0.08, 1.62, z0 + 0.76]);
  add(world, new THREE.CylinderGeometry(0.01, 0.01, 0.6, 12), std("#9ea2a2", 0.25, 1), [fx[0] + 0.08, 0.85, z0 + 0.76]);
  box(world, fx, [2.02, H], [z0, z0 + 0.72], carcass);
  box(world, [fx[0] + 0.002, fx[1] - 0.002], [2.03, H - 0.01], [z0 + 0.72, z0 + 0.74], green, 0.004);
  // Pendentes
  for (const x of [-1.0, 0.25]) {
    add(world, new THREE.CylinderGeometry(0.004, 0.004, 0.75, 8), std("#111", 0.5), [x, H - 0.375, -3.9]);
    add(world, new THREE.SphereGeometry(0.17, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), std("#1d1d1b", 0.35, 0.6, { side: THREE.DoubleSide }), [x, 1.9, -3.9]);
    add(world, new THREE.SphereGeometry(0.05, 20, 12), std("#fff", 0.3, 0, { emissive: "#ffd9a0", emissiveIntensity: 6 }), [x, 1.93, -3.9], { cast: false });
    const pl = new THREE.PointLight("#ffd9a0", 2.2, 5, 2);
    pl.position.set(x, 1.85, -3.9);
    world.add(pl);
  }
  for (const [x, z] of [
    [-1.2, -2.2],
    [1.1, -2.2],
    [-1.2, -4.3],
    [0.6, -4.3],
  ]) {
    downlight(world, r.lights, { x, z, H, intensity: 2.5 });
  }
  r.wallSurfaces = ["back"];
  return r;
}

async function buildBanheiro() {
  const W = 2.7;
  const D = 3.7;
  const H = 2.6;
  const r = await baseRoom({
    W,
    D,
    H,
    zFront: 0.9,
    camera: { pos: [0.05, 1.38, 0.75], fov: 58 },
    // Parede direita: u começa em z = −3,7 → janela alta de z −3,0 a −2,3.
    walls: { right: { holes: [[0.7, 1.4, 1.8, 2.3]] } },
    sky: "skyField",
    envIntensity: 0.7,
  });
  const { world, scene } = r;
  r.jitter = sunJitter(sun(world, { from: [7, 6.2, -4.8], to: [-0.5, 0, -2.4], intensity: 7, bounds: 6 }), 0.15);
  skyFill(world, { pos: [W / 2 - 0.05, 2.05, -2.65], lookAt: [0, 1.5, -2.65], w: 0.7, h: 0.5, intensity: 6 });
  frontFill(world, { W, H, z: 0.8, intensity: 1.4 });

  const z0 = -D;
  const ceramic = phys("#fbfaf6", 0.1, { clearcoat: 1, clearcoatRoughness: 0.08 });
  const black = std("#1d1d1b", 0.35, 0.8);
  const brass = std("#c9a24a", 0.25, 1);

  // Bancada suspensa de madeira, tampo claro e cuba de apoio
  const wood = std("#ffffff", 0.55, 0, { map: await svgTexture("porcelanato-madeira-freijo", 1.1, 0.35) });
  box(world, [-1.3, -0.02], [0.42, 0.82], [z0, z0 + 0.5], wood, 0.012);
  box(world, [-0.665, -0.655], [0.44, 0.8], [z0 + 0.5, z0 + 0.503], std("#3d2a1b", 0.6));
  box(world, [-1.32, 0], [0.82, 0.85], [z0, z0 + 0.52], phys("#efebe4", 0.2, { clearcoat: 0.4 }), 0.004);
  const basinPts = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    basinPts.push(new THREE.Vector2(0.03 + 0.21 * Math.sin((t * Math.PI) / 2), 0.14 * t));
  }
  add(world, new THREE.LatheGeometry(basinPts, 64), phys("#fbfaf7", 0.1, { clearcoat: 1, side: THREE.DoubleSide }), [-0.66, 0.85, z0 + 0.27]);
  const spout = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.66, 1.22, z0),
    new THREE.Vector3(-0.66, 1.22, z0 + 0.15),
    new THREE.Vector3(-0.66, 1.19, z0 + 0.18),
  ]);
  add(world, new THREE.TubeGeometry(spout, 16, 0.011, 12), brass);
  box(world, [-0.74, -0.58], [1.26, 1.3], [z0, z0 + 0.03], brass, 0.008);

  // Espelho (reflete o próprio banheiro via cube camera) com luz de fundo
  add(world, new THREE.CylinderGeometry(0.44, 0.44, 0.01, 64), std("#fff", 0.2, 0, { emissive: "#ffe6bd", emissiveIntensity: 2.5 }), [-0.66, 1.66, z0 + 0.012], {
    rot: [Math.PI / 2, 0, 0],
    cast: false,
  });
  const mirrorMat = std("#e9eeee", 0.02, 1);
  const mirror = add(world, new THREE.CylinderGeometry(0.42, 0.42, 0.012, 64), mirrorMat, [-0.66, 1.66, z0 + 0.03], { rot: [Math.PI / 2, 0, 0] });
  r.afterBuild = () => {
    const rt = new THREE.WebGLCubeRenderTarget(512);
    const cube = new THREE.CubeCamera(0.05, 20, rt);
    cube.position.set(-0.66, 1.5, z0 + 1.2);
    mirror.visible = false;
    cube.update(renderer, scene);
    mirror.visible = true;
    mirrorMat.envMap = rt.texture;
    mirrorMat.envMapIntensity = 1;
    mirrorMat.needsUpdate = true;
  };

  world.add(place(await loadModel("flowers"), { x: -1.12, z: z0 + 0.3, y: 0.85, height: 0.34 }));
  box(world, [-0.25, -0.08], [0.85, 0.9], [z0 + 0.1, z0 + 0.36], std("#e8dfcf", 0.95), 0.02);
  box(world, [-0.25, -0.08], [0.9, 0.95], [z0 + 0.1, z0 + 0.36], std("#9fb3a4", 0.95), 0.02);

  // Bacia suspensa na parede esquerda + placa de acionamento
  const tx = -W / 2;
  box(world, [tx, tx + 0.56], [0.12, 0.42], [-2.72, -2.36], ceramic, 0.12);
  box(world, [tx + 0.02, tx + 0.56], [0.42, 0.445], [-2.73, -2.35], ceramic, 0.018);
  box(world, [tx, tx + 0.012], [1.0, 1.16], [-2.63, -2.45], black, 0.01);

  // Box: vidro com perfil preto, chuveiro de teto e nicho
  const glass = phys("#dfeceb", 0.04, { transparent: true, opacity: 0.14, depthWrite: false });
  const pane = box(world, [0.3, 0.31], [0.02, 2.05], [z0, z0 + 1.2], glass, 0, { cast: false });
  pane.userData.glass = true;
  box(world, [0.29, 0.32], [0, 0.02], [z0, z0 + 1.2], black);
  box(world, [0.295, 0.315], [2.05, 2.07], [z0, z0 + 1.2], black);
  box(world, [0.295, 0.315], [0.02, 2.05], [z0 + 1.19, z0 + 1.205], black);
  add(world, new THREE.CylinderGeometry(0.14, 0.14, 0.015, 40), black, [0.85, 2.3, z0 + 0.5]);
  add(world, new THREE.CylinderGeometry(0.008, 0.008, 0.3, 12), black, [0.85, 2.45, z0 + 0.5]);
  add(world, new THREE.CylinderGeometry(0.045, 0.045, 0.02, 24), black, [0.85, 1.12, z0 + 0.01], { rot: [Math.PI / 2, 0, 0] });
  box(world, [0.55, 1.2], [1.25, 1.27], [z0, z0 + 0.12], black);
  add(world, new THREE.CylinderGeometry(0.035, 0.035, 0.17, 24), std("#c6432a", 0.4), [0.68, 1.355, z0 + 0.06]);
  add(world, new THREE.CylinderGeometry(0.035, 0.035, 0.13, 24), std("#efe9dc", 0.4), [0.8, 1.335, z0 + 0.06]);
  world.add(place(await loadModel("plant"), { x: 1.05, z: -1.95, height: 0.75 }));

  downlight(world, r.lights, { x: -0.66, z: -3.1, H, intensity: 3 });
  downlight(world, r.lights, { x: 0.85, z: -3.1, H, intensity: 2.5 });
  downlight(world, r.lights, { x: 0, z: -1.6, H, intensity: 2 });
  r.wallSurfaces = ["back", "left", "right"];
  return r;
}

async function buildExterna() {
  const W = 6.4;
  const D = 6.4;
  const H = 3.0;
  const r = await baseRoom({
    W,
    D,
    H,
    zFront: 0.3,
    camera: { pos: [0.45, 1.42, 0], fov: 52 },
    walls: { left: false, ceiling: false, right: { holes: [] } },
    sky: "skyField",
    envIntensity: 0.35,
  });
  const { world, scene } = r;
  scene.backgroundIntensity = 1.0;
  scene.environmentIntensity = 0.5;
  const sunLight = sun(world, { from: [-6, 9, 2.5], to: [0.5, 0, -3.5], intensity: 6.5, bounds: 9 });
  sunLight.color.set("#fff1de");
  r.jitter = sunJitter(sunLight, 0.22);
  world.add(new THREE.HemisphereLight("#dce6f2", "#cdb89c", 0.9));

  // Pergolado: vigas e ripas de madeira
  const timber = std("#ffffff", 0.6, 0, { map: await svgTexture("porcelanato-madeira-freijo", 0.4, 2) });
  for (const x of [-W / 2 + 0.1, W / 2 - 0.1]) box(world, [x - 0.1, x + 0.1], [H - 0.25, H], [-D, 0.6], timber);
  for (let x = -W / 2; x < W / 2; x += 0.24) box(world, [x, x + 0.1], [H, H + 0.14], [-D, 0.6], timber);
  box(world, [-W / 2, -W / 2 + 0.16], [0, H], [-1.6, -1.44], timber);
  box(world, [-W / 2, -W / 2 + 0.16], [0, H], [-D + 0.02, -D + 0.18], timber);

  // Floreira baixa no lado aberto
  const concrete = std("#ffffff", 0.85, 0, { map: await svgTexture("porcelanato-cimento-grafite", 0.5, 2) });
  box(world, [-W / 2, -W / 2 + 0.42], [0, 0.55], [-D + 0.2, -1.62], concrete, 0.01);
  for (const [z, h] of [
    [-5.4, 1.2],
    [-4.2, 1.0],
    [-2.8, 1.25],
  ]) {
    world.add(place(await loadModel("plant"), { x: -W / 2 + 0.22, z, y: 0.5, height: h }));
  }

  // Churrasqueira em alvenaria
  const brick = std("#e6dfd2", 0.9);
  const granite = phys("#ffffff", 0.22, { map: await svgTexture("soleira-granito", 4, 1.2), clearcoat: 0.3 });
  const bx = [0.9, W / 2];
  box(world, bx, [0, 0.9], [-D, -D + 0.65], brick);
  box(world, [bx[0] - 0.02, bx[1]], [0.9, 0.94], [-D, -D + 0.68], granite, 0.004);
  box(world, [1.55, 2.75], [0.94, 1.78], [-D, -D + 0.6], brick);
  box(world, [1.7, 2.6], [1.0, 1.62], [-D + 0.3, -D + 0.605], std("#1a1512", 0.9));
  box(world, [1.72, 2.58], [1.0, 1.6], [-D + 0.25, -D + 0.3], std("#8a4a33", 0.9));
  for (let i = 0; i < 6; i++) box(world, [1.72, 2.58], [1.12 + i * 0.001, 1.125 + i * 0.001], [-D + 0.32 + i * 0.045, -D + 0.33 + i * 0.045], std("#555", 0.4, 0.9));
  box(world, [1.45, 2.85], [1.78, 1.9], [-D, -D + 0.68], granite, 0.01);
  box(world, [1.75, 2.55], [1.9, H], [-D, -D + 0.45], brick);

  // Mesa de madeira + bancos
  const tableWood = std("#ffffff", 0.5, 0, { map: await svgTexture("porcelanato-madeira-freijo", 1.8, 0.5) });
  const tx = [-1.75, 0.25];
  const tz = [-4.35, -3.45];
  box(world, tx, [0.72, 0.77], tz, tableWood, 0.01);
  for (const x of [tx[0] + 0.08, tx[1] - 0.14]) for (const z of [tz[0] + 0.06, tz[1] - 0.12]) box(world, [x, x + 0.06], [0, 0.72], [z, z + 0.06], std("#2a211a", 0.5));
  for (const z of [[-4.95, -4.6], [-3.2, -2.85]]) {
    box(world, [tx[0] + 0.1, tx[1] - 0.1], [0.42, 0.46], z, tableWood, 0.008);
    for (const x of [tx[0] + 0.2, tx[1] - 0.26]) box(world, [x, x + 0.06], [0, 0.42], [z[0] + 0.05, z[1] - 0.05], std("#2a211a", 0.5));
  }
  world.add(place(await loadModel("lantern"), { x: 1.3, z: -3.6, height: 0.6 }));
  const flowers = place(await loadModel("flowers"), { x: -0.75, z: -3.9, y: 0.77, height: 0.36 });
  world.add(flowers);
  r.wallSurfaces = ["back"];
  return r;
}

const builders = { sala: buildSala, cozinha: buildCozinha, banheiro: buildBanheiro, externa: buildExterna };

/* ---------- passes ---------- */

function halton(i, b) {
  let f = 1;
  let r = 0;
  while (i > 0) {
    f /= b;
    r += f * (i % b);
    i = Math.floor(i / b);
  }
  return r;
}

function makeComposer(room, w, h) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(1);
  composer.setSize(w, h);
  composer.addPass(new RenderPass(room.scene, room.camera));
  const gtao = new GTAOPass(room.scene, room.camera, w, h);
  gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 });
  gtao.blendIntensity = 0.85;
  composer.addPass(gtao);
  composer.addPass(new OutputPass());
  return composer;
}

function accumulate(room, w, h, n, draw) {
  const gl = renderer.getContext();
  const acc = new Float32Array(w * h * 4);
  const buf = new Uint8Array(w * h * 4);
  for (let i = 0; i < n; i++) {
    const jx = n > 1 ? halton(i + 1, 2) - 0.5 : 0;
    const jy = n > 1 ? halton(i + 1, 3) - 0.5 : 0;
    room.camera.setViewOffset(w, h, jx, jy, w, h);
    room.jitter?.(i, n);
    draw();
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    for (let k = 0; k < acc.length; k++) acc[k] += buf[k];
  }
  room.camera.clearViewOffset();
  const inv = 1 / (n * 255);
  for (let k = 0; k < acc.length; k++) acc[k] *= inv;
  return acc; // linhas de baixo para cima (convenção do WebGL)
}

function swapMaterials(room, pick) {
  const saved = [];
  room.scene.traverse((o) => {
    if (!o.isMesh) return;
    const next = pick(o);
    if (next === undefined) return;
    saved.push([o, o.material, o.visible]);
    if (next === null) o.visible = false;
    else o.material = next;
  });
  return () => saved.forEach(([o, m, v]) => ((o.material = m), (o.visible = v)));
}

function maskMaterial(orig, color) {
  const src = Array.isArray(orig) ? orig[0] : orig;
  return new THREE.MeshBasicMaterial({
    color,
    map: src.map ?? null,
    alphaMap: src.alphaMap ?? null,
    alphaTest: src.alphaTest || (src.transparent || src.alphaMap ? 0.5 : 0),
    side: src.side,
  });
}

function renderMask(room, w, h, n, whiteTags) {
  const restore = swapMaterials(room, (o) => {
    if (o.userData.glass) return null;
    return maskMaterial(o.material, whiteTags.includes(o.userData.tag) ? "#ffffff" : "#000000");
  });
  const bg = room.scene.background;
  const env = room.scene.environment;
  room.scene.background = new THREE.Color("#000");
  room.scene.environment = null;
  renderer.toneMapping = THREE.NoToneMapping;
  const acc = accumulate(room, w, h, n, () => renderer.render(room.scene, room.camera));
  renderer.toneMapping = THREE.NeutralToneMapping;
  room.scene.background = bg;
  room.scene.environment = env;
  restore();
  const out = new Float32Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = acc[i * 4];
  return out;
}

function projectPlane(camera, corners, w, h) {
  return corners.map((p) => {
    const v = new THREE.Vector3(...p).project(camera);
    return [((v.x + 1) / 2) * w, ((1 - v.y) / 2) * h];
  });
}

function planesMeta(room, w, h) {
  const { W, D, H, camera } = room;
  const zn = camera.position.z - 0.45; // borda próxima: sempre à frente da câmera
  const planes = {
    floor: { corners: [[-W / 2, 0, -D], [W / 2, 0, -D], [W / 2, 0, zn], [-W / 2, 0, zn]], widthCm: W * 100, heightCm: (D + zn) * 100, align: "0 0" },
    back: { corners: [[-W / 2, H, -D], [W / 2, H, -D], [W / 2, 0, -D], [-W / 2, 0, -D]], widthCm: W * 100, heightCm: H * 100, align: "0 100%" },
    left: { corners: [[-W / 2, H, zn], [-W / 2, H, -D], [-W / 2, 0, -D], [-W / 2, 0, zn]], widthCm: (D + zn) * 100, heightCm: H * 100, align: "100% 100%" },
    right: { corners: [[W / 2, H, -D], [W / 2, H, zn], [W / 2, 0, zn], [W / 2, 0, -D]], widthCm: (D + zn) * 100, heightCm: H * 100, align: "0 100%" },
  };
  for (const p of Object.values(planes)) {
    p.quad = projectPlane(camera, p.corners, w, h).map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]);
    delete p.corners;
  }
  return planes;
}

/* ---------- saída ---------- */

function toDataURL(w, h, fill) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const src = (h - 1 - y) * w; // WebGL → imagem (inverte linhas)
    for (let x = 0; x < w; x++) fill(src + x, (y * w + x) * 4, img.data, x, y);
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lum = (a, i) => 0.2126 * a[i * 4] + 0.7152 * a[i * 4 + 1] + 0.0722 * a[i * 4 + 2];

function quantile(values, q) {
  if (!values.length) return 1;
  const sorted = Float32Array.from(values).sort();
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
}

async function renderRoom(id, quality) {
  const q = QUALITY[quality];
  const { w, h } = q;
  renderer.setSize(w, h, false);
  const room = await builders[id]();
  room.camera.updateMatrixWorld(true);
  room.afterBuild?.();
  const composer = makeComposer(room, w, h);

  const beauty = accumulate(room, w, h, q.beauty, () => composer.render());
  if (quality === "preview") {
    return { passes: { beauty: toDataURL(w, h, (s, d, o) => ((o[d] = beauty[s * 4] * 255), (o[d + 1] = beauty[s * 4 + 1] * 255), (o[d + 2] = beauty[s * 4 + 2] * 255), (o[d + 3] = 255))) } };
  }

  const wallTags = room.wallSurfaces;
  const floorMask = renderMask(room, w, h, q.mask, ["floor"]);
  const wallMask = renderMask(room, w, h, q.mask, wallTags);

  // Sombreamento: piso e paredes revestíveis viram branco fosco.
  const white = std("#ffffff", 1);
  let restore = swapMaterials(room, (o) => (o.userData.tag === "floor" || wallTags.includes(o.userData.tag) ? white : undefined));
  const shade = accumulate(room, w, h, q.shade, () => composer.render());
  restore();

  // Reflexo: o mundo espelhado sob o piso, visto pela mesma câmera.
  room.world.scale.y = -1;
  room.floor.visible = false;
  room.world.updateMatrixWorld(true);
  const refl = accumulate(room, w, h, q.refl, () => composer.render());
  room.world.scale.y = 1;
  room.floor.visible = true;

  // Normalização do sombreamento por superfície (luz "típica" ≈ branco).
  const floorL = [];
  const wallL = [];
  for (let i = 0; i < w * h; i++) {
    if (floorMask[i] > 0.95) floorL.push(lum(shade, i));
    else if (wallMask[i] > 0.95) wallL.push(lum(shade, i));
  }
  // Referência = luz "comum" da superfície (mediana); acima disso vira camada de luz.
  const refFloor = quantile(floorL, 0.55) / 0.95;
  const refWall = quantile(wallL, 0.55) / 0.95;

  // Fresnel por pixel (mais reflexo em ângulos rasantes).
  const inv = new THREE.Matrix4().copy(room.camera.projectionMatrixInverse);
  const camMatrix = room.camera.matrixWorld;
  const v = new THREE.Vector3();
  const fresnel = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      v.set(((x + 0.5) / w) * 2 - 1, -(((y + 0.5) / h) * 2 - 1), 0.5).applyMatrix4(inv).applyMatrix4(camMatrix);
      v.sub(room.camera.position).normalize();
      const cos = Math.max(0, -v.y);
      fresnel[(h - 1 - y) * w + x] = Math.min(1, (0.05 + 0.95 * Math.pow(1 - cos, 5)) * 2.6);
    }
  }

  const passes = {
    beauty: toDataURL(w, h, (s, d, o) => {
      o[d] = beauty[s * 4] * 255;
      o[d + 1] = beauty[s * 4 + 1] * 255;
      o[d + 2] = beauty[s * 4 + 2] * 255;
      o[d + 3] = 255;
    }),
    fg: toDataURL(w, h, (s, d, o) => {
      o[d] = beauty[s * 4] * 255;
      o[d + 1] = beauty[s * 4 + 1] * 255;
      o[d + 2] = beauty[s * 4 + 2] * 255;
      o[d + 3] = (1 - clamp01(floorMask[s] + wallMask[s])) * 255;
    }),
    floorMask: toDataURL(w, h, (s, d, o) => ((o[d] = o[d + 1] = o[d + 2] = 255), (o[d + 3] = floorMask[s] * 255))),
    wallMask: toDataURL(w, h, (s, d, o) => ((o[d] = o[d + 1] = o[d + 2] = 255), (o[d + 3] = wallMask[s] * 255))),
    shade: toDataURL(w, h, (s, d, o) => {
      const ref = floorMask[s] >= wallMask[s] ? refFloor : refWall;
      const g = clamp01(lum(shade, s) / ref) * 255;
      o[d] = o[d + 1] = o[d + 2] = g;
      o[d + 3] = 255;
    }),
    light: toDataURL(w, h, (s, d, o) => {
      const ref = floorMask[s] >= wallMask[s] ? refFloor : refWall;
      const g = clamp01((lum(shade, s) / ref - 1) * 0.9) * 255;
      o[d] = o[d + 1] = o[d + 2] = g;
      o[d + 3] = 255;
    }),
    refl: toDataURL(w, h, (s, d, o) => {
      const k = fresnel[s] * floorMask[s];
      o[d] = refl[s * 4] * 255 * k;
      o[d + 1] = refl[s * 4 + 1] * 255 * k;
      o[d + 2] = refl[s * 4 + 2] * 255 * k;
      o[d + 3] = 255;
    }),
  };

  return { passes, meta: { width: w, height: h, wallSurfaces: wallTags, planes: planesMeta(room, w, h) } };
}

window.renderer3d = {
  async inspect() {
    const out = {};
    for (const name of ["sofa", "chair", "plant", "pouf", "lamp", "flowers", "lantern"]) {
      const o = await loadModel(name);
      const b = new THREE.Box3().setFromObject(o);
      const s = b.getSize(new THREE.Vector3());
      out[name] = { size: s.toArray().map((n) => +n.toFixed(3)), min: b.min.toArray().map((n) => +n.toFixed(3)) };
    }
    return out;
  },
  preview: async (id) => (await renderRoom(id, "preview")).passes.beauty,
  render: (id, quality = "full") => renderRoom(id, quality),
};
