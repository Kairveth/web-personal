(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('visible'));
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
      if (document.startViewTransition) document.startViewTransition(apply).ready.catch(() => {}); else apply();
    });
  }

  const copy = document.getElementById('copiar');
  if (copy) {
    copy.addEventListener('click', async () => {
      const original = copy.textContent;
      try {
        await navigator.clipboard.writeText('pedroralvarez@outlook.es');
        copy.textContent = 'Copiado';
      } catch (err) {
        copy.textContent = 'No se pudo copiar';
      }
      setTimeout(() => { copy.textContent = original; }, 1800);
    });
  }
})();
