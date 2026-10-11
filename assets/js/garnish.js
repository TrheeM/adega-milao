/* =========================================================
   Guarnição 3D do topo (Three.js): barras de gelo de sabor,
   cubos de gelo, fruta (laranja / limão / cereja) e folhas.
   Carregado só depois da página pronta. A garrafa é foto (main.js).
   ========================================================= */
import * as THREE from '../vendor/three/three.module.min.js';
import { RoundedBoxGeometry } from '../vendor/three/RoundedBoxGeometry.js';
import { RoomEnvironment } from '../vendor/three/RoomEnvironment.js';

const DEG = Math.PI / 180;

function fresnel(mat, { power = 2.4, strength = 0.7, rim = '#ffffff', rimMix = 0.3 } = {}) {
    mat.onBeforeCompile = sh => {
        sh.uniforms.uRim = { value: new THREE.Color(rim) };
        sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `#include <opaque_fragment>
            float frN = clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0);
            float fr = pow(1.0 - frN, ${power.toFixed(2)});
            gl_FragColor.a = clamp(gl_FragColor.a + fr * ${strength.toFixed(2)}, 0.0, 1.0);
            gl_FragColor.rgb += uRim * fr * ${rimMix.toFixed(2)};`);
    };
    mat.customProgramCacheKey = () => `fr${power}${strength}${rimMix}`;
    return mat;
}

function stage(renderer) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();
    const key = new THREE.DirectionalLight('#ffd9a0', 2.4); key.position.set(3, 5, 4);
    const rim = new THREE.DirectionalLight('#9fd4ff', 2.2); rim.position.set(-4, 2, -3);
    const fill = new THREE.DirectionalLight('#ffb36b', 0.9); fill.position.set(-3, -1, 4);
    scene.add(key, rim, fill);
    return scene;
}

// noisy rounded box, so ice never looks machine-made
function iceBox(w, h, d, r) {
    const g = new RoundedBoxGeometry(w, h, d, 4, r);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        const n = Math.sin(x * 9.1 + y * 4.7) * Math.cos(z * 7.3 - x * 3.1) * 0.035;
        p.setXYZ(i, x * (1 + n), y * (1 - n * 0.4), z * (1 + n * 0.8));
    }
    g.computeVertexNormals();
    return g;
}

// frost texture for the flavored ice bar: cloudy core, tiny trapped bubbles, vertical streaks
function frostTex() {
    const c = document.createElement('canvas'); c.width = 128; c.height = 384;
    const g = c.getContext('2d');
    const gx = g.createLinearGradient(0, 0, 128, 0);
    gx.addColorStop(0, 'rgba(255,255,255,.55)'); gx.addColorStop(0.22, 'rgba(255,255,255,.12)');
    gx.addColorStop(0.5, 'rgba(255,255,255,.32)'); gx.addColorStop(0.78, 'rgba(255,255,255,.1)'); gx.addColorStop(1, 'rgba(255,255,255,.5)');
    g.fillStyle = gx; g.fillRect(0, 0, 128, 384);
    g.globalAlpha = 0.5;
    for (let i = 0; i < 90; i++) {
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(20 + Math.random() * 88, Math.random() * 384, Math.random() * 2.4 + 0.6, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 0.18; g.strokeStyle = '#fff'; g.lineWidth = 2;
    for (let i = 0; i < 7; i++) { const x = 18 + Math.random() * 92; g.beginPath(); g.moveTo(x, 10); g.lineTo(x + (Math.random() - 0.5) * 14, 374); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

function citrusTex(rind, pith, pulp) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = rind; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
    g.fillStyle = pith; g.beginPath(); g.arc(128, 128, 114, 0, Math.PI * 2); g.fill();
    const n = 10;
    for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2 + 0.05, a1 = ((i + 1) / n) * Math.PI * 2 - 0.05;
        const gr = g.createRadialGradient(128, 128, 10, 128, 128, 104);
        gr.addColorStop(0, pulp); gr.addColorStop(1, 'rgba(255,255,255,.35)');
        g.fillStyle = pulp;
        g.beginPath(); g.moveTo(128 + Math.cos((a0 + a1) / 2) * 12, 128 + Math.sin((a0 + a1) / 2) * 12);
        g.arc(128, 128, 104, a0, a1); g.closePath(); g.fill();
        g.globalAlpha = 0.35; g.fillStyle = gr; g.fill(); g.globalAlpha = 1;
    }
    g.fillStyle = pith; g.beginPath(); g.arc(128, 128, 9, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

function normalize(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const ctr = box.getCenter(new THREE.Vector3());
    const wrap = new THREE.Group();
    obj.position.sub(ctr);
    wrap.add(obj);
    wrap.scale.setScalar(1 / Math.max(size.x, size.y, size.z));
    return wrap;
}

/**
 * @param {object} o
 * @param {HTMLElement} o.hero  @param {HTMLCanvasElement} o.back  @param {HTMLCanvasElement} o.front
 * @param {HTMLElement} o.stage @param {Array} o.HERO  @param {boolean} o.reduceMotion
 */
export function initGarnish({ hero, back, front, stage: stageEl, HERO, reduceMotion }) {
    const small = innerWidth < 700;
    const mk = (canvas, cap) => {
        const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        r.setPixelRatio(Math.min(devicePixelRatio, cap));
        return r;
    };
    const rb = mk(back, small ? 1.25 : 1.5), rf = mk(front, small ? 1.25 : 1.5);
    const sb = stage(rb), sf = stage(rf);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    /* ---- normal ice: clear cube ---- */
    const cubeGeo = iceBox(1, 1, 1, 0.16);
    const cubeMat = fresnel(new THREE.MeshPhysicalMaterial({
        color: '#eaf7ff', roughness: 0.06, transparent: true, opacity: 0.16,
        clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 3, depthWrite: false,
    }), { strength: 0.5, rim: '#f2fbff', rimMix: 0.9, power: 1.8 });
    const cubeCoreMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', emissive: '#cfeeff', emissiveIntensity: 0.25, roughness: 1, transparent: true, opacity: 0.16, depthWrite: false });
    const cubeCoreGeo = new THREE.IcosahedronGeometry(0.34, 1);
    function makeCube() {
        const g = new THREE.Group();
        const m = new THREE.Mesh(cubeGeo, cubeMat); m.renderOrder = 2;
        const core = new THREE.Mesh(cubeCoreGeo, cubeCoreMat); core.renderOrder = 1; core.scale.set(1, 0.8, 0.9);
        g.add(core, m);
        return g;
    }

    /* ---- flavored ice: the big copão bar (shared colored material, tweened on switch) ---- */
    const barGeo = iceBox(0.4, 1, 0.3, 0.07);
    const barCoreGeo = new THREE.BoxGeometry(0.3, 0.9, 0.2);
    const frost = frostTex();
    const barMat = fresnel(new THREE.MeshPhysicalMaterial({
        color: HERO[0].ice, roughness: 0.22, transparent: true, opacity: 0.74,
        clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.6, depthWrite: false,
        emissive: HERO[0].ice, emissiveIntensity: 0.18,
    }), { strength: 0.35, rim: '#ffffff', rimMix: 0.55, power: 2.2 });
    const barFrostMat = new THREE.MeshBasicMaterial({ map: frost, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
    const barCoreMat = new THREE.MeshStandardMaterial({ color: HERO[0].ice, roughness: 0.9, transparent: true, opacity: 0.55, depthWrite: false });
    function makeBar() {
        const g = new THREE.Group();
        const core = new THREE.Mesh(barCoreGeo, barCoreMat); core.renderOrder = 1;
        const shell = new THREE.Mesh(barGeo, barMat); shell.renderOrder = 2;
        const fr = new THREE.Mesh(barGeo, barFrostMat); fr.renderOrder = 3; fr.scale.setScalar(1.002);
        g.add(core, shell, fr);
        return g;
    }

    /* ---- fruit ---- */
    const citrus = {
        orange: { rind: '#f0821a', pith: '#fde7c2', pulp: '#f79a24' },
        lime: { rind: '#3f8f24', pith: '#eef7d2', pulp: '#a9d24a' },
    };
    const citrusMats = {};
    const citrusGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 48);
    function makeCitrus(kind) {
        if (!citrusMats[kind]) {
            const c = citrus[kind];
            const face = new THREE.MeshPhysicalMaterial({ map: citrusTex(c.rind, c.pith, c.pulp), roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25, transparent: true, opacity: 0.96 });
            const side = new THREE.MeshStandardMaterial({ color: c.rind, roughness: 0.55 });
            citrusMats[kind] = [side, face, face];
        }
        return new THREE.Mesh(citrusGeo, citrusMats[kind]);
    }
    let cherryProto = null;
    function makeCherryFallback() {
        const g = new THREE.Group();
        const mat = new THREE.MeshPhysicalMaterial({ color: '#8e0a1c', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 24), mat); s.scale.y = 0.9;
        const stem = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.28, 0), new THREE.Vector3(0.05, 0.55, 0), new THREE.Vector3(0.22, 0.72, 0)), 12, 0.02, 6), new THREE.MeshStandardMaterial({ color: '#5a3a14', roughness: 0.7 }));
        g.add(s, stem);
        return g;
    }
    function makeFruit(kind) {
        if (kind === 'cherry') return normalize(cherryProto ? cherryProto.clone(true) : makeCherryFallback());
        return normalize(makeCitrus(kind));
    }
    function loadCherry() {
        Promise.all([import('../vendor/three/GLTFLoader.js'), import('../vendor/three/DRACOLoader.js')]).then(([{ GLTFLoader }, { DRACOLoader }]) => {
            const draco = new DRACOLoader().setDecoderPath(new URL('../vendor/three/draco/', import.meta.url).href);
            new GLTFLoader().setDRACOLoader(draco).load(new URL('../models/cherry.glb', import.meta.url).href, gltf => {
                cherryProto = gltf.scene;
                draco.dispose();
                items.forEach(it => { if (it.kind === 'fruit' && it.fruitKind === 'cherry') setFruit(it, 'cherry', true); });
            }, undefined, () => {});
        }).catch(() => {});
    }
    function makeLeaf() {
        const s = new THREE.Shape();
        s.moveTo(0, -0.5); s.bezierCurveTo(0.38, -0.3, 0.42, 0.25, 0, 0.5); s.bezierCurveTo(-0.42, 0.25, -0.38, -0.3, 0, -0.5);
        const geo = new THREE.ShapeGeometry(s, 24);
        const p = geo.attributes.position, uv = geo.attributes.uv;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i);
            p.setZ(i, -x * x * 0.9 + Math.sin((y + 0.5) * Math.PI) * 0.08);
            uv.setXY(i, x + 0.5, y + 0.5);
        }
        geo.computeVertexNormals();
        const c = document.createElement('canvas'); c.width = c.height = 256;
        const g = c.getContext('2d');
        const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, '#2f7a2a'); gr.addColorStop(0.5, '#4fa33c'); gr.addColorStop(1, '#2f7a2a');
        g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
        g.strokeStyle = 'rgba(220,255,200,.55)'; g.lineWidth = 4; g.beginPath(); g.moveTo(128, 256); g.lineTo(128, 0); g.stroke();
        g.lineWidth = 2;
        for (let y = 40; y < 240; y += 34) { g.beginPath(); g.moveTo(128, y + 26); g.quadraticCurveTo(170, y + 10, 214, y - 6); g.moveTo(128, y + 26); g.quadraticCurveTo(86, y + 10, 42, y - 6); g.stroke(); }
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
        return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, roughness: 0.55, side: THREE.DoubleSide }));
    }

    // fewer, bigger pieces: two copão bars up front, one behind; normal ice stays cubed
    const LAYOUT = [
        { layer: 'fg', kind: 'fruit', top: 47, left: 28, size: 128 },
        { layer: 'fg', kind: 'bar', top: 58, left: 19, size: 210, tilt: -18 },
        { layer: 'fg', kind: 'cube', top: 36, left: 58, size: 104 },
        { layer: 'fg', kind: 'fruit', top: 12, left: 49, size: 100 },
        { layer: 'fg', kind: 'bar', top: 50, left: 71, size: 190, tilt: 16 },
        { layer: 'fg', kind: 'cube', top: 74, left: 40, size: 86 },
        { layer: 'bg', kind: 'bar', top: 12, left: 37, size: 120, tilt: 24 },
        { layer: 'bg', kind: 'fruit', top: 52, left: 57, size: 64 },
        { layer: 'bg', kind: 'cube', top: 80, left: 62, size: 66 },
        { layer: 'leaf', kind: 'leaf', top: 10, left: 15, size: 64 },
        { layer: 'leaf', kind: 'leaf', top: 30, left: 88, size: 90 },
        { layer: 'leaf', kind: 'leaf', top: 70, left: 82, size: 80 },
        { layer: 'leaf', kind: 'leaf', top: 86, left: 12, size: 96 },
    ];
    const items = LAYOUT.map((l, i) => {
        const holder = new THREE.Group();
        const it = { ...l, i, holder, baseX: 0, baseY: 0, rx: 0, ry: 0, angle: Math.random() * 360, sw: null, fruitKind: null, model: null, tilt: (l.tilt || 0) * DEG };
        if (l.kind === 'cube') it.model = makeCube();
        else if (l.kind === 'bar') it.model = makeBar();
        else if (l.kind === 'leaf') it.model = normalize(makeLeaf());
        holder.add(it.model || new THREE.Group());
        (l.layer === 'fg' ? sf : sb).add(holder);
        return it;
    });
    function setFruit(it, kind, force) {
        if (it.fruitKind === kind && !force) return;
        if (it.model) it.holder.remove(it.model);
        it.model = makeFruit(kind);
        it.fruitKind = kind;
        it.holder.add(it.model);
    }
    items.filter(it => it.kind === 'fruit').forEach(it => setFruit(it, HERO[0].fruit));

    /* ---- sizing ---- */
    let W = 1, H = 1, upp = 0.01, stageBox = { x: 0, y: 0, w: 1, h: 1 }, heroTop = 0;
    function resize() {
        const r = hero.getBoundingClientRect();
        W = r.width; H = r.height;
        heroTop = r.top + scrollY;
        rb.setSize(W, H, false); rf.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        upp = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / H;
        const s = stageEl.getBoundingClientRect();
        stageBox = { x: s.left - r.left, y: s.top - r.top, w: s.width, h: s.height };
        const sizeK = W < 700 ? 0.6 : W < 1100 ? 0.8 : 1;
        items.forEach(it => { it.scale = it.size * sizeK * upp * (it.kind === 'cube' ? 0.62 : it.kind === 'bar' ? 0.9 : it.kind === 'leaf' ? 0.9 : 0.85); });
    }

    // phones: garnish gathers around the bottle stage so the title stays clean
    const homeX = it => W < 700 ? stageBox.x + (it.left / 100) * stageBox.w * 1.1 - stageBox.w * 0.05 : (it.left / 100) * W + it.size / 2;
    const homeY = it => W < 700 ? stageBox.y + (it.top / 100) * stageBox.h : (it.top / 100) * H + it.size / 2;
    const toWorld = (px, py) => [(px - W / 2) * upp, -(py - H / 2) * upp];

    /* ---- switch: implode to the centre, swap, explode back (Soda brief) ---- */
    let switching = false;
    function switchTo(idx) {
        if (switching) return;
        switching = true;
        const h = HERO[idx];
        const c = new THREE.Color(h.ice);
        [barMat.color, barMat.emissive, barCoreMat.color].forEach(col => gsap.to(col, { r: c.r, g: c.g, b: c.b, duration: 0.9, delay: 0.35, ease: 'power2.inOut' }));
        const movers = items.filter(it => it.kind !== 'leaf');
        let done = 0;
        movers.forEach(it => {
            const centerX = W / 2 - homeX(it), centerY = H / 2 - homeY(it);
            const a0 = it.angle;
            const nextX = (Math.random() - 0.5) * 200, nextY = (Math.random() - 0.5) * 200;
            it.sw = { x: it.baseX + it.rx, y: it.baseY + it.ry, s: 1, a: a0 };
            gsap.timeline()
                .to(it.sw, { x: centerX, y: centerY, a: a0 + 45, s: 0.1, duration: 0.5, ease: 'power2.in', onComplete() { if (it.kind === 'fruit') setFruit(it, h.fruit); } })
                .to(it.sw, { duration: 0.3 })
                .to(it.sw, {
                    x: nextX, y: nextY, a: a0 + 90, s: 1, duration: 0.9, ease: 'back.out(1.5)',
                    onComplete() {
                        it.angle = a0 + 90; it.baseX = nextX; it.baseY = nextY; it.rx = 0; it.ry = 0; it.sw = null;
                        if (++done === movers.length) switching = false;
                    },
                });
        });
    }

    /* ---- per-frame placement (cursor repulsion, float, parallax) ---- */
    const durs = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];
    function place(it, time, cm, mouse) {
        const k = W < 700 ? 0.62 : 1;
        const par = it.layer === 'fg' ? 60 : it.layer === 'bg' ? -30 : -15;
        const hx = homeX(it) + cm.x * par, hy = homeY(it) + cm.y * par;
        if (it.kind === 'leaf') {
            const dur = 10 + (it.i - 9) * 2;
            const ph = (time + (it.i - 9) * 1.2) * (Math.PI * 2 / dur);
            const [x, y] = toWorld(hx + Math.cos(ph * 0.5) * 15, hy + Math.sin(ph) * 20);
            it.holder.position.set(x, y, -1);
            it.holder.rotation.set(0.6, Math.sin(ph * 0.3) * 0.5, Math.sin(ph * 0.3) * 15 * DEG + it.i);
            it.holder.scale.setScalar(it.scale);
            return;
        }
        if (it.sw) {
            const [x, y] = toWorld(hx + it.sw.x, hy + it.sw.y);
            it.holder.position.set(x, y, 0);
            it.holder.scale.setScalar(it.scale * it.sw.s);
            if (it.kind === 'bar') it.holder.rotation.set(Math.sin(it.sw.a * DEG) * 0.4, it.sw.a * DEG, it.tilt + it.sw.a * DEG * 0.5);
            else it.holder.rotation.set(it.sw.a * DEG * 0.5 + 0.9, it.sw.a * DEG, 0);
            return;
        }
        const cx = hx + it.baseX + it.rx, cy = hy + it.baseY + it.ry;
        const dx = mouse.px - cx, dy = mouse.py - heroTop - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let tx = 0, ty = 0, speed = 1;
        const R = 400 * k;
        if (dist < R && !reduceMotion) {
            const f = (R - dist) / R;
            tx = (dx / dist) * f * -80; ty = (dy / dist) * f * -80;
            speed = 1 + f * 5;
        }
        it.rx += (tx - it.rx) * 0.1;
        it.ry += (ty - it.ry) * 0.1;
        if (!reduceMotion) it.angle += (it.kind === 'bar' ? 0.12 : 0.2) * speed;
        const ph = (time + it.i * 0.7) * (Math.PI * 2 / durs[it.i % 9]);
        const fy = reduceMotion ? 0 : Math.sin(ph) * 15;
        const fa = reduceMotion ? 0 : Math.cos(ph) * 6;
        const [x, y] = toWorld(hx + it.baseX + it.rx, hy + it.baseY + it.ry + fy);
        it.holder.position.set(x, y, 0);
        it.holder.scale.setScalar(it.scale);
        const a = it.angle * DEG;
        if (it.kind === 'bar') it.holder.rotation.set(Math.sin(a * 0.7) * 0.35, a, it.tilt + fa * DEG);
        else it.holder.rotation.set(a * 0.5 + 0.9, a, fa * DEG);
    }

    function render(time, cm, mouse) {
        items.forEach(it => place(it, time, cm, mouse));
        rb.render(sb, camera);
        rf.render(sf, camera);
    }

    resize();
    rb.compile(sb, camera);
    rf.compile(sf, camera);
    (window.requestIdleCallback || setTimeout)(loadCherry, { timeout: 3000 });

    return { resize, render, switchTo, busy: () => switching };
}
