/* ─────────────────────────────────────────
   MindCheck — Main JavaScript
   main.js  (shared across all pages)
───────────────────────────────────────── */

// ─── NAV SCROLL EFFECT ───
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
})();


// ─── HERO CARD: PROGRESS BAR ANIMATION ───
(function () {
  const pf = document.getElementById('pf');
  if (!pf) return;

  // Small delay so the animation is visible after page load
  setTimeout(() => {
    pf.style.width = '30%';
  }, 400);
})();


// ─── HERO CARD: INTERACTIVE OPTIONS ───
(function () {
  const optionItems = document.querySelectorAll('.card-options .option-item');
  if (!optionItems.length) return;

  optionItems.forEach(function (opt) {
    opt.addEventListener('click', function () {
      const siblings = opt.closest('.card-options').querySelectorAll('.option-item');
      siblings.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
    });
  });
})();


// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


// ─── UTILITY: Fade-in on scroll (used on how-cards, q-items) ───
(function () {
  const targets = document.querySelectorAll('.how-card, .q-item');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  // Set initial state
  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();