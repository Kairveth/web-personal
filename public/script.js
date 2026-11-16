(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  }

  // Registro del hero: simulación local, no llama a ningún servidor.
  const list = document.getElementById('registro');
  const resend = document.getElementById('reenviar');
  const outage = document.getElementById('caida');
  const avisos = document.getElementById('avisos');
  if (list && resend && outage && avisos) {
    const MAX_LINES = 5;
    const canTransition = Boolean(document.startViewTransition);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let received = Number(avisos.textContent) || 0;
    let outages = 0;

    const line = (code, status, statusClass, text, flash) => {
      const li = document.createElement('li');
      li.className = flash ? `fresh ${flash}` : 'fresh';
      const time = document.createElement('time');
      time.textContent = new Date().toLocaleTimeString('es-ES', { hour12: false });
      const c = document.createElement('code');
      c.textContent = code;
      const b = document.createElement('b');
      b.className = statusClass;
      b.textContent = status;
      const s = document.createElement('span');
      s.textContent = text;
      li.append(time, c, b, s);
      return li;
    };

    const push = (li) => {
      const apply = () => {
        list.classList.add('live');
        list.append(li);
        while (list.children.length > MAX_LINES) list.firstElementChild.remove();
      };
      if (canTransition && !reduce.matches) document.startViewTransition(apply).ready.catch(() => {});
      else { list.classList.add('no-vt'); apply(); }
    };

    resend.addEventListener('click', () => {
      received += 1;
      avisos.textContent = String(received);
      avisos.classList.remove('bump');
      void avisos.offsetWidth;
      avisos.classList.add('bump');
      push(line('POST /apexrest/pagos', '200', 's2', 'reenvío: ya existía, sin duplicado', 'f-ok'));
    });

    outage.addEventListener('click', async () => {
      if (outage.getAttribute('aria-disabled') === 'true') return;
      outage.setAttribute('aria-disabled', 'true');
      const retries = outages++ % 2 ? 2 : 1;
      push(line('GET erp/clientes/4471', '503', 's5', 'ERP caído', 'f-fault'));
      for (let i = 1; i <= retries; i++) {
        await wait(900);
        push(line('queueable', `↻ ${i}/3`, 's3', 'reintento programado'));
        if (i < retries) { await wait(900); push(line('GET erp/clientes/4471', '503', 's5', 'sigue caído', 'f-fault')); }
      }
      await wait(1100);
      push(line('GET erp/clientes/4471', '200', 's2', 'cliente sincronizado', 'f-ok'));
      outage.setAttribute('aria-disabled', 'false');
    });
  }

  const projects = [...document.querySelectorAll('.project[data-cat]')];
  const tagsOf = (p) => p.dataset.cat.split(',').map((t) => t.trim()).filter(Boolean);
  const cats = [...new Set(projects.flatMap(tagsOf))].sort((a, b) => (b === 'Salesforce') - (a === 'Salesforce') || a.localeCompare(b, 'es'));
  const bar = document.querySelector('.filters');
  if (bar && cats.length > 1) {
    const chips = ['Todos', ...cats].map((c) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = c; b.dataset.filter = c;
      b.setAttribute('aria-pressed', String(c === 'Todos')); b.classList.toggle('is-active', c === 'Todos');
      return b;
    });
    bar.append(...chips);
    bar.hidden = false;
    bar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chips.forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      const f = chip.dataset.filter;
      const apply = () => projects.forEach((p) => { p.hidden = f !== 'Todos' && !tagsOf(p).includes(f); });
      if (document.startViewTransition && !reduce.matches) document.startViewTransition(apply).ready.catch(() => {}); else apply();
    });
  }

  const copy = document.getElementById('copiar');
  if (copy) {
    copy.addEventListener('click', async () => {
      const original = copy.textContent;
      try {
        await navigator.clipboard.writeText(copy.dataset.mail);
        copy.textContent = 'Copiado';
      } catch (err) {
        copy.textContent = 'No se pudo copiar';
      }
      setTimeout(() => { copy.textContent = original; }, 1800);
    });
  }

  console.info('Hola. El código de esta web está en https://github.com/Kairveth/web-personal');
})();
