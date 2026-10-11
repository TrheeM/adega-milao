/* =========================================================
   Adega Milão — catálogo (UI)
   Produtos, preços e destaques ficam em data.js.
   ========================================================= */
import { WHATSAPP, CATEGORIES, PRODUCTS, HERO, OFFERS, COPAO } from './data.js';

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = () => typeof window.gsap !== 'undefined';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = v => v.toFixed(2).replace('.', ',');
const priceHTML = v => {
    const [i, c] = fmt(v).split(',');
    return `<span class="price"><span class="cur">R$</span>${i}<span class="cents">,${c}</span></span>`;
};
const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
};
const IMG = id => `assets/img/products/${id}.webp`;
const EXT = 'target="_blank" rel="noopener noreferrer"';

/* product photo (or combo composition), always transparent cut-outs */
function photo(p, { alt = true, eager = false } = {}) {
    const a = alt ? esc(label(p)) : '';
    const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
    if (p.parts) {
        return `<span class="stack stack-${p.id}" role="img" aria-label="${a}">${p.parts.map(id =>
            `<img src="${IMG(id)}" alt="" width="200" height="560" ${load} decoding="async">`).join('')}</span>`;
    }
    return `<img class="pimg" src="${IMG(p.id)}" alt="${a}" width="200" height="560" ${load} decoding="async">`;
}

/* ---------- WhatsApp ---------- */
const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const label = p => [p.name, p.size].filter(Boolean).join(' ');
function msgFor(p) {
    if (p.cat === 'combo') return `Olá, Adega Milão! Vi no site o *${p.name}* (${p.style})${p.price ? ` por R$ ${fmt(p.price)}` : ''}. Ainda tem disponível?`;
    return `Olá, Adega Milão! Vi no site e queria saber: tem disponível *${label(p)}*${p.price ? ` (R$ ${fmt(p.price)})` : ''}?`;
}
const GENERAL_MSG = {
    geral: 'Olá, Adega Milão! Vim pelo site e queria fazer um pedido.',
    entrega: 'Olá, Adega Milão! Queria pedir uma entrega aqui em Lorena. Meu endereço é: ',
    loja1: 'Olá, Adega Milão! Vim pelo site. Uma dúvida sobre a Loja 1 (Av. Papa João XXIII, 130):',
    loja2: 'Olá, Adega Milão! Vim pelo site. Uma dúvida sobre a Loja 2 (Av. Bernardino de Campos, 502):',
};
$$('[data-wa]').forEach(a => { a.href = waLink(GENERAL_MSG[a.dataset.wa] || GENERAL_MSG.geral); });

const asked = new Set(store.get('milao-asked', []));
const toastEl = $('#toast');
let toastT;
function toast(text) {
    $('span', toastEl).textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
function markAsked(id) {
    asked.add(id);
    store.set('milao-asked', [...asked]);
    $$(`.asked[data-for="${id}"]`).forEach(el => { el.hidden = false; });
}
document.addEventListener('click', e => {
    const a = e.target.closest('[data-ask]');
    if (!a) return;
    const p = byId[a.dataset.ask];
    if (p) { markAsked(p.id); toast(`Abrindo o WhatsApp: ${p.name}`); }
});

/* ---------- Age gate ---------- */
(() => {
    const dlg = $('#age');
    if (store.get('milao-18', false) || !dlg.showModal) return;
    dlg.showModal();
    dlg.addEventListener('cancel', e => e.preventDefault());
    $('#age-yes').addEventListener('click', () => { store.set('milao-18', true); dlg.close(); });
    $('#age-no').addEventListener('click', () => { $('#age-ask').hidden = true; $('#age-denied').hidden = false; });
})();

/* =========================================================
   Hero: real bottle photo that tilts to the cursor and spins on switch
   ========================================================= */
const heroEl = $('#inicio');
const tiltEl = $('#hero-tilt');
const bottleEls = HERO.map((h, i) => {
    const p = byId[h.id];
    const img = document.createElement('img');
    img.className = 'hero-bottle' + (i === 0 ? ' on' : '');
    img.src = `assets/img/products/${h.id}-lg.webp`;
    img.alt = i === 0 ? label(p) : '';
    img.width = 330; img.height = 1100;
    img.decoding = 'async';
    if (i === 0) img.fetchPriority = 'high'; else img.loading = 'eager';
    tiltEl.appendChild(img);
    return img;
});

const picker = $('#picker');
picker.innerHTML = HERO.map((h, i) => {
    const p = byId[h.id];
    return `<button class="pick" type="button" aria-pressed="${i === 0}" data-index="${i}" aria-label="${esc(label(p))}${p.price ? `, R$ ${fmt(p.price)}` : ''}">
        <img src="${IMG(p.id)}" alt="" width="200" height="560" decoding="async">
        <span class="pick-info"><b>${esc(p.name.replace(' Original Cream Tequila', '').replace(' London Dry', ''))}</b>
        <span class="${p.price ? '' : 'consulte'}">${p.price ? `R$ ${fmt(p.price)}` : 'Consulte'}</span></span>
    </button>`;
}).join('');

let heroIndex = 0;
let garnish = null;
let spinning = false;
const heroAsk = $('#hero-ask');
function setHeroAsk(i) {
    const p = byId[HERO[i].id];
    heroAsk.href = waLink(msgFor(p));
    heroAsk.dataset.ask = p.id;
    heroAsk.setAttribute('aria-label', `Perguntar no WhatsApp se tem ${label(p)}`);
    $('#hero-live').textContent = `Em destaque: ${label(p)}${p.price ? `, R$ ${fmt(p.price)}` : ''}`;
}
setHeroAsk(0);

function swapBottle(from, to) {
    bottleEls[from].classList.remove('on');
    bottleEls[from].alt = '';
    bottleEls[to].classList.add('on');
    bottleEls[to].alt = label(byId[HERO[to].id]);
}

function selectHero(i) {
    i = (i + HERO.length) % HERO.length;
    if (i === heroIndex || spinning || (garnish && garnish.busy())) return;
    const from = heroIndex;
    heroIndex = i;
    $$('.pick', picker).forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
    setHeroAsk(i);
    const h = HERO[i];
    if (!hasGsap() || reduceMotion) {
        heroEl.style.setProperty('--bg-inner', h.theme[0]);
        heroEl.style.setProperty('--bg-mid', h.theme[1]);
        heroEl.style.setProperty('--bg-outer', h.theme[2]);
        heroEl.style.setProperty('--glow', h.glow);
        swapBottle(from, i);
        if (garnish) garnish.switchTo(i);
        return;
    }
    gsap.to(heroEl, { '--bg-inner': h.theme[0], '--bg-mid': h.theme[1], '--bg-outer': h.theme[2], '--glow': h.glow, duration: 1.5, ease: 'power2.inOut' });
    // spin 0→360 with blur, swap at the peak, 360→720 settling back (Soda brief)
    spinning = true;
    const cur = bottleEls[from], next = bottleEls[i];
    gsap.to(tiltEl, { filter: 'blur(15px)', duration: 0.6, ease: 'power2.in' });
    gsap.to(cur, {
        rotation: 360, duration: 0.6, ease: 'power2.in',
        onComplete() {
            swapBottle(from, i);
            gsap.set(cur, { rotation: 0 });
            gsap.to(tiltEl, { filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', onComplete() { tiltEl.style.filter = ''; } });
            gsap.fromTo(next, { rotation: 360 }, {
                rotation: 720, duration: 1.5, ease: 'back.out(0.7)',
                onComplete() { gsap.set(next, { rotation: 0 }); spinning = false; },
            });
        },
    });
    if (garnish) garnish.switchTo(i);
}
picker.addEventListener('click', e => { const c = e.target.closest('.pick'); if (c) selectHero(+c.dataset.index); });
$('#hero-prev').addEventListener('click', () => selectHero(heroIndex - 1));
$('#hero-next').addEventListener('click', () => selectHero(heroIndex + 1));

/* ---------- Bubbles (hero only) ---------- */
const bubbles = (() => {
    const box = $('#bubbles-container');
    let timer = null;
    function createBubble() {
        const b = document.createElement('img');
        b.src = 'assets/img/bubble.png';
        b.alt = '';
        b.className = 'bubble-img';
        const duration = Math.random() * 6 + 4;
        b.style.width = Math.random() * 20 + 10 + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.opacity = String(Math.random() * 0.4 + 0.2);
        b.style.animationDuration = duration + 's';
        box.appendChild(b);
        setTimeout(() => b.remove(), duration * 1000);
    }
    return {
        start() { if (!timer && !reduceMotion) timer = setInterval(createBubble, innerWidth < 700 ? 700 : 400); },
        stop() { clearInterval(timer); timer = null; },
    };
})();

/* ---------- Hero loop: cursor tilt + float, garnish render ---------- */
(() => {
    const mouse = { x: 0, y: 0, px: -9999, py: -9999 };
    const cm = { x: 0, y: 0 };
    addEventListener('pointermove', e => {
        mouse.x = e.clientX / innerWidth - 0.5;
        mouse.y = e.clientY / innerHeight - 0.5;
        mouse.px = e.clientX;
        mouse.py = e.clientY + scrollY;
    }, { passive: true });
    let running = false, raf = 0;
    function frame() {
        const time = performance.now() * 0.001;
        cm.x += (mouse.x - cm.x) * 0.05;
        cm.y += (mouse.y - cm.y) * 0.05;
        const fy = reduceMotion ? 0 : Math.sin(time * Math.PI * 2 / 6) * 14;
        tiltEl.style.transform = `translate3d(0, ${fy.toFixed(2)}px, 0) rotateY(${(cm.x * 26).toFixed(2)}deg) rotateX(${(-cm.y * 12).toFixed(2)}deg)`;
        if (garnish) garnish.render(time, cm, mouse);
        raf = running ? requestAnimationFrame(frame) : 0;
    }
    function setRunning(on) {
        running = on && !document.hidden;
        if (running && !raf) raf = requestAnimationFrame(frame);
        if (running) bubbles.start(); else bubbles.stop();
    }
    new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0 }).observe(heroEl);
    document.addEventListener('visibilitychange', () => setRunning(!document.hidden && heroEl.getBoundingClientRect().bottom > 0));

    // 3D garnish loads after the page is usable, only with WebGL
    function loadGarnish() {
        const probe = document.createElement('canvas');
        if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
        import('./garnish.js').then(({ initGarnish }) => {
            garnish = initGarnish({ hero: heroEl, back: $('#hero-back'), front: $('#hero-front'), stage: $('.hero-stage'), HERO, reduceMotion });
            heroEl.classList.add('garnish-on');
            let rt;
            addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => garnish.resize(), 120); });
            if (!running) frame();
        }).catch(err => console.warn('Guarnição 3D indisponível', err));
    }
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
    if (document.readyState === 'complete') idle(loadGarnish, { timeout: 1500 });
    else addEventListener('load', () => idle(loadGarnish, { timeout: 1500 }), { once: true });
})();

/* ---------- Ofertas ---------- */
(() => {
    const [main, ...rest] = OFFERS.map(id => byId[id]);
    const askBtn = p => `<a class="btn-wa" href="${waLink(msgFor(p))}" ${EXT} data-ask="${p.id}"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg>Tem disponível?</a>`;
    $('#offers').innerHTML = `
        <article class="offer-hero">
            <div class="o-copy">
                <span class="o-flag">Promoção</span>
                <h3>${esc(main.name)}<small>${esc(main.size)} · ${esc(main.style)}</small></h3>
                <p class="o-desc">O whisky do copão, pelo menor preço que já postamos. Corre que é por tempo limitado.</p>
                ${priceHTML(main.price)}
                <div>${askBtn(main)}</div>
            </div>
            <div class="o-render">${photo(main)}</div>
        </article>
        <div class="offer-list">
            ${rest.map(p => `
            <article class="offer-row">
                <div class="o-thumb">${photo(p)}</div>
                <div>
                    <h3>${esc(p.name)}</h3>
                    <p class="o-desc">${esc(p.cat === 'combo' ? p.style : `${p.size} · ${p.style}`)}</p>
                    <div class="o-foot">${p.price ? priceHTML(p.price) : '<span class="consulte">Consulte</span>'}${askBtn(p)}</div>
                </div>
            </article>`).join('')}
        </div>`;
})();

/* ---------- Catálogo ---------- */
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
(() => {
    const shelves = $('#shelves');
    shelves.innerHTML = CATEGORIES.map(c => {
        const items = PRODUCTS.filter(p => p.cat === c.id);
        return `<section class="shelf" data-cat="${c.id}" aria-labelledby="shelf-${c.id}">
            <div class="shelf-head"><h3 id="shelf-${c.id}">${c.name}</h3><span>${items.length} ${items.length === 1 ? 'item' : 'itens'}</span></div>
            <ul class="shelf-row">
            ${items.map(p => `<li class="item" data-id="${p.id}" data-search="${esc(norm(`${p.name} ${p.size} ${p.style} ${c.name}`))}">
                <div class="spot">${photo(p)}</div>
                <div class="ledge" aria-hidden="true"></div>
                <div class="tag">${p.price ? priceHTML(p.price) : '<span class="consulte">Consulte o preço</span>'}${p.promo ? '<span class="t-flag">Oferta</span>' : ''}</div>
                <div class="t-body">
                    <p class="t-name">${esc(p.name)}</p>
                    <p class="t-meta">${p.size ? `<span class="t-size">${esc(p.size)}</span>` : ''}${esc(p.style)}</p>
                    <a class="ask" href="${waLink(msgFor(p))}" ${EXT} data-ask="${p.id}" aria-label="Perguntar no WhatsApp se tem ${esc(label(p))}"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg>Tem disponível?</a>
                    <span class="asked" data-for="${p.id}" ${asked.has(p.id) ? '' : 'hidden'}><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Você já perguntou</span>
                </div>
            </li>`).join('')}
            </ul>
        </section>`;
    }).join('');

    const filters = [{ id: 'all', name: 'Todos' }, { id: 'promo', name: 'Ofertas' }, ...CATEGORIES];
    const count = id => id === 'all' ? PRODUCTS.length : id === 'promo' ? PRODUCTS.filter(p => p.promo).length : PRODUCTS.filter(p => p.cat === id).length;
    const toggles = $('#toggles');
    toggles.innerHTML = filters.map((f, i) => `<button class="toggle" type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${f.name}<span class="n">${count(f.id)}</span></button>`).join('');

    let filter = 'all', query = '';
    const items = $$('.item', shelves);
    const shelfEls = $$('.shelf', shelves);
    const resultCount = $('#result-count');
    const empty = $('#empty-state');
    function apply() {
        const q = norm(query.trim());
        let n = 0;
        items.forEach(li => {
            const p = byId[li.dataset.id];
            const okF = filter === 'all' || (filter === 'promo' ? p.promo : p.cat === filter);
            const okQ = !q || q.split(/\s+/).every(w => li.dataset.search.includes(w));
            li.hidden = !(okF && okQ);
            if (!li.hidden) n++;
        });
        shelfEls.forEach(s => { s.hidden = !$$('.item', s).some(li => !li.hidden); });
        resultCount.textContent = (q || filter !== 'all') ? `${n} ${n === 1 ? 'bebida encontrada' : 'bebidas encontradas'}` : `${n} bebidas no catálogo`;
        empty.classList.toggle('show', n === 0);
        if (n === 0) $('#empty-ask').href = waLink(`Olá, Adega Milão! Procurei no site e não achei: *${query.trim().slice(0, 80) || 'uma bebida'}*. Vocês têm?`);
    }
    toggles.addEventListener('click', e => {
        const b = e.target.closest('.toggle');
        if (!b) return;
        filter = b.dataset.filter;
        $$('.toggle', toggles).forEach(t => t.setAttribute('aria-pressed', String(t === b)));
        apply();
    });
    let st;
    $('#search').addEventListener('input', e => { clearTimeout(st); query = e.target.value; st = setTimeout(apply, 120); });
    apply();
})();

/* ---------- Copão: one big flavored-ice bar, like the real thing ---------- */
(() => {
    const form = $('#copao-form');
    form.addEventListener('submit', e => e.preventDefault());
    for (const [group, opts] of Object.entries(COPAO)) {
        const box = $(`[data-group="${group}"]`, form);
        box.innerHTML = opts.map(o =>
            `<label class="chip"><input type="radio" name="${group}" value="${o.id}"><span><i aria-hidden="true"></i>${esc(o.label)}</span></label>`).join('');
        $$('.chip i', box).forEach((i, k) => i.style.setProperty('--sw', opts[k].color));
    }
    const lines = $('#comanda-lines');
    const send = $('#comanda-send');
    const hint = $('#comanda-hint');
    const drink = $('#cup-drink'), energy = $('#cup-energy');
    const ice = $('#cup-ice'), iceBody = $('#ice-body'), iceCore = $('#ice-core');
    const pick = g => { const v = form.elements[g] && form.elements[g].value; return COPAO[g].find(o => o.id === v); };
    const animate = !reduceMotion && hasGsap();
    const anim = (el, attrs, d = 0.7) => animate ? gsap.to(el, { attr: attrs, duration: d, ease: 'power3.out' }) : Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    // cup bottom 346; liquid top max ~92
    let lastIce = null;
    function update(changed) {
        const b = pick('bebida'), en = pick('energetico'), g = pick('gelo');
        if (b) { drink.setAttribute('fill', b.color); anim(drink, { y: 262, height: 84 }); }
        if (en) { energy.setAttribute('fill', en.color); anim(energy, { y: b ? 92 : 180, height: b ? 170 : 166 }, 0.9); }
        else if (!b) anim(energy, { y: 346, height: 0 });
        if (g && g.id !== lastIce) {
            lastIce = g.id;
            iceBody.setAttribute('fill', g.color);
            iceCore.setAttribute('fill', g.color);
            ice.setAttribute('opacity', '1');
            if (animate) {
                gsap.fromTo(ice, { y: -300, rotation: -18, transformOrigin: '50% 100%' }, { y: 0, rotation: 0, duration: 0.95, ease: 'bounce.out' });
            }
        }
        const rows = [];
        if (b) rows.push(['1x', `Dose de ${b.label}`]);
        if (en) rows.push(['1x', `Energético ${en.label}`]);
        if (g) rows.push(['1x', `Gelo de ${g.label.toLowerCase()}`]);
        lines.innerHTML = rows.length
            ? rows.map(([q, t]) => `<li><span>${q}</span><span>${esc(t)}</span><span class="dots"></span><span>?</span></li>`).join('')
            : '<li class="empty">Escolha a bebida ao lado</li>';
        if (changed && animate) {
            const last = lines.lastElementChild;
            if (last) gsap.fromTo(last, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.45, ease: 'steps(6)' });
        }
        const ready = b && en;
        send.setAttribute('aria-disabled', ready ? 'false' : 'true');
        hint.textContent = ready ? 'A gente responde com o que tem e o valor.' : 'Escolha pelo menos a bebida e o energético.';
        send.href = ready ? waLink(`Olá, Adega Milão! Quero montar um copão:\n- Bebida: ${b.label}\n- Energético: ${en.label}${g ? `\n- Gelo de sabor: ${g.label}` : ''}\nTem tudo disponível? Qual fica o valor?`) : '#';
    }
    form.addEventListener('change', e => update(e.target.name));
    send.addEventListener('click', e => {
        if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); hint.textContent = 'Falta escolher a bebida e o energético.'; return; }
        toast('Abrindo o WhatsApp com a sua comanda');
    });
})();

/* ---------- Header / FAB / nav state ---------- */
(() => {
    const header = $('#header'), fab = $('#fab');
    new IntersectionObserver(([e]) => {
        header.classList.toggle('scrolled', !e.isIntersecting || e.intersectionRatio < 0.92);
        fab.classList.toggle('show', !e.isIntersecting);
    }, { threshold: [0, 0.92] }).observe(heroEl);
    const links = $$('.nav-item');
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'ofertas', 'copao', 'catalogo', 'lojas'].forEach(id => io.observe(document.getElementById(id)));
})();
