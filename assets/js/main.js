(() => {
  'use strict';

  const WHATSAPP = '5531992749195';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no rodapé ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header ao rolar ---------- */
  const header = document.querySelector('.header');
  // Rolando para baixo → menu vira "vidro" apagado; rolando para cima → volta ao normal
  let lastY = window.scrollY;
  let headerTicking = false;
  const updateHeader = () => {
    const y = window.scrollY;
    const delta = y - lastY;
    header.classList.toggle('is-scrolled', y > 24);
    const menuOpen = document.getElementById('nav').classList.contains('is-open');
    if (y < 120 || menuOpen) header.classList.remove('is-glass');
    else if (delta > 6) header.classList.add('is-glass');
    else if (delta < -6) header.classList.remove('is-glass');
    if (Math.abs(delta) > 6) lastY = y;
    headerTicking = false;
  };
  updateHeader();
  window.addEventListener('scroll', () => {
    if (!headerTicking) { requestAnimationFrame(updateHeader); headerTicking = true; }
  }, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    if (open) header.classList.remove('is-glass');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  /* ---------- Reveal ao rolar ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger leve para itens irmãos
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 60}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Manifesto: palavras acendem com o scroll ---------- */
  const manifesto = document.querySelector('[data-words]');
  if (manifesto) {
    const words = manifesto.textContent.trim().split(/\s+/);
    manifesto.setAttribute('aria-label', words.join(' '));
    manifesto.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    const spans = manifesto.querySelectorAll('.w');

    if (reduceMotion) {
      spans.forEach((s) => s.classList.add('on'));
    } else {
      let ticking = false;
      const paint = () => {
        const r = manifesto.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
        const lit = Math.round(progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle('on', i < lit));
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(paint); ticking = true; }
      }, { passive: true });
      paint();
    }
  }

  /* ---------- Parallax suave na banda ---------- */
  const bandImg = document.querySelector('.band img');
  if (bandImg && !reduceMotion) {
    let ticking = false;
    const move = () => {
      const r = bandImg.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const p = (r.top + r.height) / (window.innerHeight + r.height); // 1 → 0
        bandImg.style.transform = `translate3d(0, ${(p - 1) * 16}%, 0)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(move); ticking = true; }
    }, { passive: true });
    move();
  }

  /* ---------- Link ativo no menu ---------- */
  const links = [...document.querySelectorAll('.nav__list a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const rules = {
      nome: (v) => (v.trim().length >= 2 ? '' : 'Informe seu nome.'),
      telefone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Informe um telefone com DDD, ex.: (31) 99999-9999.'),
      email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Verifique o e-mail, ex.: nome@email.com.'),
      mensagem: (v) => (v.trim().length >= 5 ? '' : 'Escreva uma breve mensagem.'),
    };

    const validate = (input) => {
      const msg = rules[input.name] ? rules[input.name](input.value) : '';
      const field = input.closest('.field');
      field.classList.toggle('has-error', Boolean(msg));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      field.querySelector('.field__error').textContent = msg;
      return !msg;
    };

    // máscara de telefone
    const tel = form.elements.telefone;
    tel.addEventListener('input', () => {
      const d = tel.value.replace(/\D/g, '').slice(0, 11);
      let out = d;
      if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      tel.value = out;
    });

    [...form.elements].forEach((el) => {
      if (!rules[el.name]) return;
      el.addEventListener('blur', () => validate(el));
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validate(el); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = [...form.elements].filter((el) => rules[el.name]);
      const invalid = inputs.filter((el) => !validate(el));
      if (invalid.length) { invalid[0].focus(); return; }

      const { nome, telefone, email, mensagem } = form.elements;
      const text = [
        'Olá, Xavier & Teixeira Advogados!',
        '',
        `*Nome:* ${nome.value.trim()}`,
        `*Telefone:* ${telefone.value.trim()}`,
        email.value.trim() ? `*E-mail:* ${email.value.trim()}` : null,
        '',
        `*Mensagem:* ${mensagem.value.trim()}`,
      ].filter((l) => l !== null).join('\n');

      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      form.reset();
    });
  }
})();
