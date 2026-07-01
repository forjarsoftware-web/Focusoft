// ===== Focusoft — landing interactions =====

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
// Close menu when a link is tapped (mobile)
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Scroll reveal
const revealables = document.querySelectorAll('.card, .tl-item, .section-head, .about-copy, .about-visual, .cta-inner');
revealables.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealables.forEach(el => io.observe(el));
