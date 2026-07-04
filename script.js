// ===== Focusoft — interacciones =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Mobile nav toggle ---
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// --- Titular: cada palabra "enfoca" al cargar ---
const heroTitle = document.getElementById('heroTitle');
if (heroTitle && !reduceMotion) {
  const wrapWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part) || part === '') {
            frag.appendChild(document.createTextNode(part));
          } else {
            const s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    });
  };
  wrapWords(heroTitle);
  heroTitle.querySelectorAll('.w').forEach((s, i) => {
    s.style.animationDelay = `${0.08 + i * 0.09}s`;
  });
}

// --- Spotlight: la retícula se enfoca donde está el cursor ---
const hero = document.getElementById('hero');
if (hero && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  let raf = null;
  hero.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      raf = null;
    });
  });
}

// --- Terminal: tipeo del pitch ---
const termBody = document.getElementById('termBody');
if (termBody) {
  const lines = [
    { text: '$ focusoft init tu-web', cls: 't-cmd' },
    { text: '✓ diseño 100% a medida', cls: 't-ok' },
    { text: '✓ responsive · SEO · veloz', cls: 't-ok' },
    { text: '✓ online en 7 días', cls: 't-ok' },
    { text: '→ listo · desde USD 700', cls: 't-out' },
  ];

  if (reduceMotion) {
    termBody.innerHTML = lines
      .map((l) => `<span class="${l.cls}">${l.text}</span>`)
      .join('\n');
  } else {
    const caret = document.createElement('span');
    caret.className = 't-caret';
    caret.textContent = ' ';
    termBody.appendChild(caret);

    let li = 0, ci = 0, current = null;
    const typeNext = () => {
      if (li >= lines.length) return; // deja el caret titilando al final
      if (!current) {
        current = document.createElement('span');
        current.className = lines[li].cls;
        termBody.insertBefore(current, caret);
      }
      const target = lines[li].text;
      if (ci < target.length) {
        current.textContent += target[ci++];
        setTimeout(typeNext, target[ci - 1] === ' ' ? 24 : 34);
      } else {
        termBody.insertBefore(document.createTextNode('\n'), caret);
        current = null; li++; ci = 0;
        setTimeout(typeNext, li === 1 ? 480 : 260);
      }
    };
    setTimeout(typeNext, 700);
  }
}

// --- Scroll reveal (blur → nítido) ---
const revealables = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealables.forEach((el) => el.classList.add('visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealables.forEach((el) => io.observe(el));
}
