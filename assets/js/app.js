const $ = id => document.getElementById(id);
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const wa = t => 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(t);
/* Fotos en assets/img (ancho y alto reales para que la página no "salte" al cargar) */
const DIM = { hero: [860, 1221], g1: [720, 1007], g2: [720, 960], g3: [720, 960], s1: [760, 570], s2: [760, 570], c_monos: [640, 640], c_rodetes: [640, 640], c_trenzas: [640, 640] };
const pic = (k, cls, alt, lazy) => {
  const i = el('img', cls); i.src = 'assets/img/' + k + '.webp'; i.alt = alt; i.decoding = 'async';
  if (DIM[k]) { i.width = DIM[k][0]; i.height = DIM[k][1]; }
  if (lazy) i.loading = 'lazy';
  return i;
};
/* Llamadas a la API con tiempo máximo: si Google tarda o falla, se pasa a WhatsApp */
const getJSON = (url, opt) => {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 10000);
  return fetch(url, { ...opt, signal: c.signal }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).finally(() => clearTimeout(t));
};

/* ====== PESTAÑAS ====== */
const TABS = [['inicio', 'Inicio'], ['tienda', 'Tienda'], ['porque', 'Por qué elegirnos'], ['contacto', 'Contacto']];
['tabs', 'tabs-m'].forEach(id => TABS.forEach(([k, t]) => { const a = el('a', 'tab', t); a.href = '#' + k; a.dataset.tab = k; $(id).append(a); }));
let SHOP_IDS = [];
function route(e) {
  const h = location.hash.slice(1), pages = [...document.querySelectorAll('.page')];
  let page = pages.find(p => p.dataset.page === h), anchor = null;
  if (!page) { const t = h && $(h), pp = t && t.closest('.page'); if (pp) { page = pp; anchor = t; } else page = pages[0]; }
  const k = page.dataset.page, tab = SHOP_IDS.includes(k) ? 'tienda' : k;
  pages.forEach(p => p.classList.toggle('on', p === page));
  document.querySelectorAll('[data-tab]').forEach(a => a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  document.title = ((TABS.find(t => t[0] === k) || [])[1] || page.dataset.title) + ' · Atelier Ramirez, posticería valenciana';
  if (e) { const f = anchor || page.querySelector('h1'); if (f) { if (!f.hasAttribute('tabindex')) f.tabIndex = -1; f.focus({ preventScroll: true }); } }
  if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
  else { window.scrollTo({ top: 0, behavior: 'instant' }); page.scrollIntoView({ behavior: 'instant', block: 'start' }); }
}
addEventListener('hashchange', route);

const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
function renderReviews(d) {
  const g = d && d.google, all = RESENAS.concat((d && d.web) || [], (g && g.reviews) || []);
  const box = $('res-resumen'); box.innerHTML = '';
  const left = el('div');
  if (g && g.rating) left.append(el('p', 'font-display text-4xl', String(g.rating).replace('.', ',') + ' ★'), el('p', 'text-muted', (g.total || '') + ' reseñas en Google'), el('p', 'gattr mt-1', 'Reseñas de Google'));
  else left.append(el('p', 'font-display italic text-2xl', 'Tu opinión nos ayuda mucho'), el('p', 'text-muted', 'Cuéntanos tu experiencia en Google o aquí mismo, en la web.'));
  const right = el('div', 'flex flex-col sm:flex-row gap-3');
  [['Ver reseñas en Google', GOOGLE_URL, 'btn btn-s btn-sm'], ['Escribir una reseña en Google', GOOGLE_RESENA_URL || GOOGLE_URL, 'btn btn-p btn-sm']].forEach(([t, u, c]) => { const a = el('a', c, t); a.href = u; a.target = '_blank'; a.rel = 'noopener'; right.append(a); });
  box.append(left, right);
  const lista = $('lista-resenas'); lista.innerHTML = '';
  if (!all.length) { const c = el('div', 'sm:col-span-2 card p-8'); c.append(el('p', 'font-display italic text-2xl mb-2', 'Muy pronto, sus palabras'), el('p', 'text-muted', 'Aún no hay reseñas publicadas. Si ya nos conoces, nos encantará leer tu experiencia.')); lista.append(c); return; }
  all.forEach(r => {
    const c = el('figure', 'card p-6 flex flex-col gap-3'), n = r.estrellas || 5;
    const s = el('p', 'text-accent text-xl tracking-widest', stars(n)); s.setAttribute('aria-label', n + ' de 5 estrellas');
    const f = el('figcaption', 'text-muted mt-auto text-sm'); f.append(el('b', 'text-ink', r.nombre));
    if (r.detalle) f.append(el('br'), r.fuente === 'Google' ? r.detalle : 'Compró: ' + r.detalle);
    if (r.fuente) f.append(el('br'), el('span', 'gattr', r.fuente === 'Google' ? 'Reseña de Google' : 'Reseña de la web'));
    c.append(s, el('blockquote', 'text-lg italic font-display', '“' + r.texto + '”'), f); lista.append(c);
  });
}
async function loadReviews() {
  if (!CITAS_URL || apiDown) return null;
  try { return await getJSON(CITAS_URL + '?action=reviews'); } catch (e) { return null; }
}

/* ====== FORMULARIOS → WHATSAPP ====== */
function bookForm(host, pf) {
  host.innerHTML = `<form class="card p-6 md:p-8 space-y-5">
    <div><label for="${pf}n" class="lbl">¿Cómo te llamas?</label><input id="${pf}n" class="fld" required autocomplete="given-name" placeholder="Tu nombre"></div>
    <div><label for="${pf}s" class="lbl">¿Qué necesitas?</label><select id="${pf}s" class="fld" required><option value="" disabled selected>Elige una opción</option>${NEEDS.map(o => '<option>' + o + '</option>').join('')}</select></div>
    <div class="grid sm:grid-cols-2 gap-5">
      <div><label for="${pf}d" class="lbl">Día preferido <span class="font-normal text-muted">(opcional)</span></label><input id="${pf}d" type="date" class="fld"></div>
      <div><label for="${pf}h" class="lbl">Horario <span class="font-normal text-muted">(opcional)</span></label><select id="${pf}h" class="fld"><option value="">Me da igual</option><option>Mañana</option><option>Tarde</option></select></div>
    </div>
    <div><label for="${pf}m" class="lbl">¿Algo más que quieras contarnos? <span class="font-normal text-muted">(opcional)</span></label><textarea id="${pf}m" rows="2" class="fld"></textarea></div>
    <p class="text-sm text-muted">Al enviarlo, usaremos tus datos solo para atender tu solicitud. Más información en nuestra <button type="button" class="underline text-accent font-bold" data-legal="lg-priv">política de privacidad</button>.</p>
    <button type="submit" class="btn btn-p w-full"><svg class="w-6 h-6"><use href="#i-wa"/></svg>Enviar por WhatsApp</button>
    <p hidden class="ok text-center font-bold">¡Gracias! Si WhatsApp no se ha abierto, <a target="_blank" rel="noopener" class="underline text-accent">pulsa aquí</a>.</p></form>`;
  const f = host.firstChild, g = k => $(pf + k);
  g('d').min = dkey(new Date());
  f.addEventListener('submit', e => {
    e.preventDefault();
    let t = 'Hola, soy ' + g('n').value.trim() + '. Me gustaría reservar una cita en Atelier Ramirez para: ' + g('s').value.toLowerCase() + '.';
    if (g('d').value) t += ' Día preferido: ' + new Date(g('d').value + 'T12:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) + '.';
    if (g('h').value) t += ' Horario preferido: ' + g('h').value.toLowerCase() + '.';
    if (g('m').value.trim()) t += ' ' + g('m').value.trim();
    const u = wa(t + ' Muchas gracias.');
    const ok = f.querySelector('.ok'); ok.querySelector('a').href = u; ok.hidden = false;
    window.open(u, '_blank', 'noopener');
  });
}
let busy = [], apiDown = false;
const hhmm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const dkey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
async function loadBusy() {
  if (!CITAS_URL) return;
  try {
    const j = await getJSON(CITAS_URL + '?action=busy');
    if (!Array.isArray(j.busy)) throw new Error('respuesta no válida');
    busy = j.busy.map(b => [Date.parse(b.s), Date.parse(b.e)]);
    if (j.horario) CFG.horario = j.horario; if (j.avisoH != null) CFG.avisoH = j.avisoH; if (j.maxDias) CFG.maxDias = j.maxDias;
  } catch (e) { apiDown = true; }
}
function slotsFor(d, dur) {
  if (BLOQUEOS.includes(dkey(d))) return [];
  const out = [], min = Date.now() + CFG.avisoH * 36e5;
  (CFG.horario[d.getDay()] || []).forEach(([a, b]) => {
    for (let t = a; t + dur <= b; t += 60) {
      const s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, t).getTime(), e = s + dur * 6e4;
      out.push({ t, s, ok: s >= min && !busy.some(([bs, be]) => s < be && e > bs) });
    }
  });
  return out;
}
function booking(host, pf) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const st = { m: new Date(today.getFullYear(), today.getMonth(), 1), dur: 60, day: null, slot: null };
  host.innerHTML = `<div class="flex flex-wrap gap-2 mb-5">
      <button type="button" class="chip" data-pane="cal" aria-pressed="true">Reservar en el calendario</button>
      <button type="button" class="chip" data-pane="wa" aria-pressed="false">Reservar por mensaje de WhatsApp</button></div>
    <div data-p="cal" class="card p-6 md:p-8 space-y-8">
      <div><p class="lbl">1. ¿Qué necesitas y cuánto tiempo?</p>
        <select class="fld mb-3" data-f="need" aria-label="Qué necesitas"><option value="" disabled selected>Elige una opción</option>${NEEDS.map(o => '<option>' + o + '</option>').join('')}</select>
        <div class="flex flex-wrap gap-2" data-f="dur"></div>
        <p class="text-sm text-muted mt-2">Cada cita dura como mínimo 1 hora y atendemos a una sola persona a la vez.</p></div>
      <div><p class="lbl">2. Elige día y hora</p>
        <div class="grid sm:grid-cols-5 gap-6">
          <div class="sm:col-span-3"><div class="flex items-center justify-between mb-3">
            <button type="button" class="cal-nav" data-nav="-1" aria-label="Mes anterior">‹</button><p class="font-display text-xl capitalize" data-f="mes"></p><button type="button" class="cal-nav" data-nav="1" aria-label="Mes siguiente">›</button></div>
            <div class="cal-grid" data-f="grid"></div></div>
          <div class="sm:col-span-2"><p class="text-sm font-bold mb-3 capitalize" data-f="dia"></p><div class="grid grid-cols-2 gap-2" data-f="slots"></div></div>
        </div></div>
      <div class="space-y-4"><p class="lbl">3. Tus datos</p>
        <div class="grid sm:grid-cols-2 gap-4"><input class="fld" data-f="name" placeholder="Tu nombre" autocomplete="given-name" aria-label="Tu nombre"><input class="fld" data-f="tel" type="tel" placeholder="Tu teléfono (WhatsApp)" autocomplete="tel" aria-label="Tu teléfono"></div>
        <textarea class="fld" rows="2" data-f="notes" placeholder="¿Algo más que quieras contarnos? (opcional)" aria-label="Notas"></textarea>
        <input class="hidden" data-f="web" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="text-sm text-muted">Al confirmar, usaremos tus datos solo para gestionar tu cita. Más información en nuestra <button type="button" class="underline text-accent font-bold" data-legal="lg-priv">política de privacidad</button>.</p>
        <button type="button" class="btn btn-p w-full" data-f="ok">Confirmar cita</button>
        <p class="text-center font-bold" role="status" aria-live="polite" data-f="msg"></p></div>
      <p class="text-center text-muted">¿No consigues reservar desde el calendario? <a class="underline font-bold text-accent" target="_blank" rel="noopener" href="${wa('Hola, no consigo reservar desde el calendario. Me gustaría reservar una cita en Atelier Ramirez.')}">Reserva por WhatsApp</a></p></div>
    <div data-p="wa" hidden></div>`;
  bookForm(host.querySelector('[data-p=wa]'), pf);
  const q = k => host.querySelector('[data-f=' + k + ']');
  const day = d => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  function paint() {
    const y = st.m.getFullYear(), mo = st.m.getMonth(), maxD = new Date(today.getTime() + CFG.maxDias * 864e5);
    q('dur').innerHTML = '';
    DUR.forEach(([m, l]) => { const b = el('button', 'chip', l); b.type = 'button'; b.dataset.k = 'u' + m; b.setAttribute('aria-pressed', String(m === st.dur)); b.onclick = () => { st.dur = m; st.slot = null; draw(); }; q('dur').append(b); });
    q('mes').textContent = st.m.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    host.querySelector('[data-nav="-1"]').disabled = st.m <= new Date(today.getFullYear(), today.getMonth(), 1);
    host.querySelector('[data-nav="1"]').disabled = new Date(y, mo + 1, 1) > maxD;
    const g = q('grid'); g.innerHTML = '';
    'LMXJVSD'.split('').forEach(l => g.append(el('div', 'cal-dow', l)));
    for (let i = 0, lead = (st.m.getDay() + 6) % 7; i < lead; i++) g.append(el('div'));
    for (let n = 1, dim = new Date(y, mo + 1, 0).getDate(); n <= dim; n++) {
      const d = new Date(y, mo, n), b = el('button', 'cal-day', String(n)); b.type = 'button';
      b.disabled = !(d <= maxD && slotsFor(d, st.dur).some(s => s.ok));
      if (+d === +today) b.classList.add('today');
      const on = !!st.day && dkey(st.day) === dkey(d); b.classList.toggle('sel', on); b.dataset.k = 'd' + n;
      b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', day(d) + (+d === +today ? ' (hoy)' : ''));
      b.onclick = () => { st.day = d; st.slot = null; draw(); }; g.append(b);
    }
    const sl = q('slots'); sl.innerHTML = '';
    if (!st.day) { q('dia').textContent = 'Elige un día disponible'; return; }
    q('dia').textContent = day(st.day);
    const list = slotsFor(st.day, st.dur).filter(s => s.ok);
    if (!list.length) sl.append(el('p', 'text-sm text-muted col-span-2', 'No quedan horas libres este día.'));
    list.forEach(s => { const b = el('button', 'slot', hhmm(s.t)); b.type = 'button'; b.title = hhmm(s.t) + ' – ' + hhmm(s.t + st.dur); const on = !!st.slot && st.slot.s === s.s; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); b.dataset.k = 's' + s.t; b.onclick = () => { st.slot = s; draw(); }; sl.append(b); });
  }
  /* draw() repinta el calendario sin perder el foco del teclado */
  function draw() {
    const ae = document.activeElement, fk = ae && host.contains(ae) ? ae.dataset.k : null;
    paint();
    const n = fk && host.querySelector('[data-k="' + fk + '"]');
    if (n && !n.disabled) n.focus();
  }
  REDRAW.push(draw); draw();
  host.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => { st.m = new Date(st.m.getFullYear(), st.m.getMonth() + Number(b.dataset.nav), 1); draw(); });
  host.querySelectorAll('[data-pane]').forEach(b => b.onclick = () => {
    host.querySelectorAll('[data-pane]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    host.querySelector('[data-p=cal]').hidden = b.dataset.pane !== 'cal'; host.querySelector('[data-p=wa]').hidden = b.dataset.pane !== 'wa';
  });
  q('ok').onclick = async () => {
    const msg = q('msg'), name = q('name').value.trim(), tel = q('tel').value.trim(), need = q('need').value, notes = q('notes').value.trim();
    if (q('web').value) return;
    if (!need) { msg.textContent = 'Elige qué necesitas.'; q('need').focus(); return; }
    if (!st.slot) { msg.textContent = 'Elige un día y una hora.'; return; }
    if (!name || tel.replace(/\D/g, '').length < 6) { msg.textContent = 'Escribe tu nombre y un teléfono de contacto.'; (name ? q('tel') : q('name')).focus(); return; }
    const s = new Date(st.slot.s), when = day(s) + ' a las ' + hhmm(st.slot.t), dur = DUR.find(d => d[0] === st.dur)[1];
    const asWa = () => {
      const u = wa('Hola, soy ' + name + ' (' + tel + '). Me gustaría reservar una cita en Atelier Ramirez el ' + when + ' (' + dur + ') para: ' + need.toLowerCase() + '.' + (notes ? ' ' + notes : '') + ' ¿Me la podéis confirmar? Gracias.');
      const a = el('a', 'underline text-accent', 'pulsa aquí'); a.href = u; a.target = '_blank'; a.rel = 'noopener';
      msg.textContent = 'Tu solicitud está lista. Si WhatsApp no se ha abierto, '; msg.append(a, '.'); window.open(u, '_blank', 'noopener');
    };
    if (!CITAS_URL || apiDown) { asWa(); return; }
    q('ok').disabled = true; msg.textContent = 'Reservando tu cita…';
    try {
      const r = await (getJSON(CITAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ name, phone: tel, need, notes, start: s.toISOString(), minutes: st.dur, web: '' }) }));
      if (r.ok) { busy.push([st.slot.s, st.slot.s + st.dur * 6e4]); st.slot = null; msg.textContent = '¡Cita reservada! Te esperamos el ' + when + ' en C/ Cuenca, 14B (Alaquàs).'; draw(); }
      else { msg.textContent = 'Esa hora acaba de ocuparse. Elige otra, por favor.'; await loadBusy(); st.slot = null; draw(); }
    } catch (e) { apiDown = true; asWa(); }
    q('ok').disabled = false;
  };
}

const REDRAW = [];
loadBusy().then(() => REDRAW.forEach(f => f()));
document.querySelectorAll('[data-form]').forEach(h => booking(h, h.dataset.form));

/* ====== FORMULARIO DE RESEÑA (se guarda para revisión) ====== */
function reviewForm() {
  const h = $('form-resena'); let val = 0;
  h.innerHTML = `<form class="card p-6 md:p-8 space-y-5"><h3 class="font-display text-2xl">Deja tu reseña en la web</h3>
    <div><label class="lbl" for="rn">Tu nombre</label><input id="rn" class="fld" required autocomplete="given-name"></div>
    <div><p class="lbl">¿Qué has comprado o contratado?</p><div class="flex flex-wrap gap-2" data-r="prods"></div></div>
    <div><p class="lbl">Tu valoración</p><div class="flex gap-1" data-r="stars" role="group" aria-label="Valoración de 1 a 5 estrellas"></div></div>
    <div><label class="lbl" for="rt">Tu comentario</label><textarea id="rt" rows="3" class="fld" required></textarea></div>
    <input class="hidden" id="rweb" tabindex="-1" autocomplete="off" aria-hidden="true">
    <label class="flex gap-3 items-start text-sm"><input type="checkbox" id="rc" required class="mt-1 w-5 h-5 flex-none"><span>Autorizo que Atelier Ramirez publique mi nombre, mi valoración y mi comentario en su web.</span></label>
    <button type="submit" class="btn btn-p w-full">Enviar mi reseña</button>
    <p class="text-center font-bold" role="status" aria-live="polite" data-r="msg"></p>
    <p class="text-sm text-muted">Revisamos cada reseña antes de publicarla.</p></form>`;
  const f = h.firstChild, q = k => f.querySelector('[data-r=' + k + ']'), sel = new Set(), sb = [], pb = [];
  const paint = () => { sb.forEach((b, i) => { b.classList.toggle('on', i < val); b.setAttribute('aria-pressed', String(i + 1 === val)); }); pb.forEach(([p, b]) => b.setAttribute('aria-pressed', String(sel.has(p)))); };
  PRODS.forEach(p => { const b = el('button', 'chip', p); b.type = 'button'; b.onclick = () => { sel.has(p) ? sel.delete(p) : sel.add(p); paint(); }; pb.push([p, b]); q('prods').append(b); });
  for (let i = 1; i <= 5; i++) { const b = el('button', 'star', '★'); b.type = 'button'; b.setAttribute('aria-label', i + (i === 1 ? ' estrella' : ' estrellas')); b.onclick = () => { val = i; paint(); }; sb.push(b); q('stars').append(b); }
  paint();
  f.addEventListener('submit', async e => {
    e.preventDefault(); const msg = q('msg'); msg.textContent = '';
    if ($('rweb').value) return;
    if (!val) { msg.textContent = 'Elige tu valoración con las estrellas.'; return; }
    const d = { type: 'review', name: $('rn').value.trim(), products: [...sel].join(', '), stars: val, text: $('rt').value.trim(), web: '' };
    const viaWa = () => {
      const u = wa('Hola, quiero dejar una reseña sobre Atelier Ramirez.\nNombre: ' + d.name + '\nProductos: ' + (d.products || '—') + '\nValoración: ' + d.stars + '/5\nReseña: ' + d.text + '\nAutorizo su publicación en la web.');
      const a = el('a', 'underline text-accent', 'pulsa aquí'); a.href = u; a.target = '_blank'; a.rel = 'noopener';
      msg.textContent = 'Tu reseña está lista para enviar. Si WhatsApp no se ha abierto, '; msg.append(a, '.'); window.open(u, '_blank', 'noopener');
    };
    if (!CITAS_URL || apiDown) { viaWa(); return; }
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true; msg.textContent = 'Enviando tu reseña…';
    try {
      const r = await (getJSON(CITAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) }));
      if (r.ok) { f.reset(); sel.clear(); val = 0; paint(); msg.textContent = '¡Gracias! Tu reseña se publicará en cuanto la revisemos.'; }
      else msg.textContent = 'No hemos podido guardar tu reseña. Inténtalo de nuevo, por favor.';
    } catch (err) { apiDown = true; viaWa(); }
    btn.disabled = false;
  });
}
reviewForm();
renderReviews();
loadReviews().then(d => d && renderReviews(d));

/* ====== TIENDA ====== */
const swatches = () => { const w = el('div', 'flex flex-wrap gap-2 items-center'); TONOS.forEach(([n, c]) => { const s = el('span', 'sw'); s.style.background = c; s.title = n; s.setAttribute('role', 'img'); s.setAttribute('aria-label', n); w.append(s); }); return w; };
SHOP_IDS = SHOP.map(c => c.id);
function shopNav(active) {
  const n = el('nav', 'flex flex-wrap gap-2 mt-6'); n.setAttribute('aria-label', 'Categorías de la tienda');
  [['tienda', 'Todos']].concat(SHOP.map(c => [c.id, c.chip])).forEach(([k, t]) => { const a = el('a', 'chip', t); a.href = '#' + k; if (k === active) a.setAttribute('aria-current', 'page'); n.append(a); });
  return n;
}
function card(c, x, withImg) {
  const k = el('article', 'card flex flex-col overflow-hidden');
  if (withImg) { k.append(pic(c.img, 'w-full aspect-[4/3] object-cover', c.alt, true)); }
  const b = el('div', 'p-6 flex flex-col gap-3 grow');
  b.append(el('span', 'pill self-start', c.chip + ' · ' + x.tag), el('h3', 'font-display text-xl', x.t), el('p', 'text-muted text-[.95rem]', x.d));
  if (x.tonos) b.append(el('p', 'text-sm font-bold', 'Tonalidades'), swatches());
  if (c.plazo) b.append(el('p', 'plazo', 'Plazo de entrega: hasta 60 días'));
  b.append(el('p', 'price text-lg mt-auto pt-2', x.p));
  const a = el('a', 'btn btn-p btn-sm', c.cta);
  if (c.go) a.href = '#contacto'; else { a.target = '_blank'; a.rel = 'noopener'; a.href = wa('Hola, me gustaría información sobre: ' + x.t + ' (tienda de Atelier Ramirez).'); }
  b.append(a); k.append(b); return k;
}
$('nav-todos').append(shopNav('tienda'));
SHOP.forEach(c => {
  /* tarjeta de la portada */
  const tile = el('a', 'card overflow-hidden block'); tile.href = '#' + c.id;
  const ti = pic(c.img, 'w-full aspect-[4/3] object-cover', c.alt, true);
  const tb = el('div', 'p-4'); tb.append(el('h3', 'font-display text-lg md:text-xl', c.chip), el('p', 'text-muted text-sm font-bold', c.desde));
  tile.append(ti, tb); $('tiles').append(tile);
  /* pestaña "Todos": todos los productos agrupados */
  const g = el('section'), head = el('div', 'flex items-end justify-between gap-4 mb-5 flex-wrap'), h2 = el('h2', 'h2'); h2.innerHTML = c.n + ' <em>' + c.em + '</em>';
  const more = el('a', 'font-bold text-accent underline', 'Ver ' + c.chip.toLowerCase() + ' →'); more.href = '#' + c.id; head.append(h2, more);
  const gr = el('div', 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5'); c.sec.forEach(x => gr.append(card(c, x, true))); g.append(head, gr); $('shop-all').append(g);
  /* pestaña propia de cada categoría */
  const p = el('div', 'page'); p.dataset.page = c.id; p.dataset.title = c.n + ' ' + c.em;
  const top = el('section', 'wrap sec'); top.style.paddingBottom = '2rem';
  top.append(el('p', 'eb', 'Tienda online'), shopNav(c.id));
  const split = el('div', 'grid md:grid-cols-5 gap-8 items-center mt-8');
  const im = pic(c.img, 'md:col-span-2 w-full aspect-[4/3] md:aspect-square object-cover rounded-3xl', c.alt, true);
  const tx = el('div', 'md:col-span-3'), h1 = el('h1', 'h1 mb-4'); h1.innerHTML = c.n + ' <em>' + c.em + '</em>';
  tx.append(h1, el('p', 'lead max-w-xl mb-4', c.intro), el('span', 'pill', c.desde)); split.append(im, tx); top.append(split);
  const list = el('section', 'wrap pb-16 md:pb-24'), grid = el('div', 'grid sm:grid-cols-2 gap-5');
  c.sec.forEach(x => { const k = card(c, x, false); if (c.sec.length === 1) k.classList.add('sm:col-span-2'); grid.append(k); });
  if (c.plazo) { const nb = el('div', 'card p-6 mb-8'); nb.append(el('p', 'font-bold text-lg mb-1', 'Plazo de entrega: hasta 60 días'), el('p', 'text-muted', 'Es un trabajo totalmente artesanal: cada pieza se elabora a mano y a tu medida, y no puede hacerse rápido y mal. Te confirmamos la fecha prevista antes de cerrar tu pedido.')); list.append(nb); }
  list.append(grid, el('p', 'text-muted mt-10 text-sm max-w-2xl', 'Precios en euros. Antes de cerrar tu pedido te confirmamos el precio final, los gastos de envío (si los hay) y la fecha prevista de entrega.'));
  const cta = el('section', 'band sec'), cw = el('div', 'wrap text-center'), ch = el('h2', 'h2 mb-4'); ch.innerHTML = '¿Dudas sobre <em>qué elegir</em>?';
  const cb = el('a', 'btn btn-inv'); cb.target = '_blank'; cb.rel = 'noopener'; cb.href = wa('Hola, me gustaría que me asesoréis sobre ' + c.chip.toLowerCase() + '.'); cb.textContent = 'Pedir asesoramiento por WhatsApp';
  cw.append(ch, el('p', 'mb-7 opacity-85 text-lg max-w-xl mx-auto', 'Te orientamos sobre tono, tamaño y tipo de pieza, sin compromiso.'), cb); cta.append(cw);
  p.append(top, list, cta); document.querySelector('main').append(p);
});

/* ====== AVISO LEGAL ====== */
const lg = $('legal');
document.addEventListener('click', e => {
  const b = e.target.closest('[data-legal]');
  if (b) { const id = b.dataset.legal; lg.querySelectorAll('details').forEach(d => d.open = d.id === id); lg.showModal(); $(id).scrollIntoView(); }
  else if (e.target === lg) lg.close();
});
$('lg-x').addEventListener('click', () => lg.close());
route();
