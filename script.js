// Hamburger toggles the main nav
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('#primary-nav');

function toggleNav(open) {
  const isOpen = open ?? nav.dataset.state !== 'open';
  nav.dataset.state = isOpen ? 'open' : 'closed';
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : ''; // prevent background scroll on mobile
}

hamburger?.addEventListener('click', () => toggleNav());

// Close nav on Escape or click outside (mobile)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.dataset.state === 'open') toggleNav(false);
});
document.addEventListener('click', (e) => {
  const clickInside = nav.contains(e.target) || hamburger.contains(e.target);
  if (!clickInside && nav.dataset.state === 'open') toggleNav(false);
});

// Projects submenu (works for both mobile + desktop click)
const submenuToggle = document.querySelector('.submenu-toggle');
const submenu = document.querySelector('.submenu');

function setSubmenu(open) {
  submenuToggle.setAttribute('aria-expanded', String(open));
  submenu.hidden = !open;
  submenu.setAttribute('aria-hidden', String(!open));
}
setSubmenu(false);

submenuToggle?.addEventListener('click', () => {
  const open = submenuToggle.getAttribute('aria-expanded') !== 'true';
  setSubmenu(open);
});

// Optional: close submenu when a submenu link is clicked (mobile UX)
submenu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    setSubmenu(false);
    toggleNav(false);
  }
});

// Highlight current page in the top bar and submenu
(function () {
  const links = document.querySelectorAll('#primary-nav a');
  // Normalize current file (treat "/" as "index.html")
  const currentPath = window.location.pathname;
  const currentFile = currentPath.endsWith('/')
    ? 'index.html'
    : currentPath.split('/').pop();

  let activeLink = null;

  links.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;

    // Resolve relative hrefs to a file name (treat folder routes as index.html)
    const url = new URL(href, window.location.origin);
    const file = url.pathname.endsWith('/')
      ? 'index.html'
      : url.pathname.split('/').pop();

    if (file === currentFile) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page'); // accessibility
      activeLink = a;
    }
  });

    // If we're on a Projects subpage, only auto-open the submenu on mobile
    if (activeLink && activeLink.closest('.submenu')) {
    const isMobile = window.matchMedia('(max-width: 900px)').matches
        || nav?.dataset.state === 'open'; // slide-out nav open counts as mobile UX

    document.querySelector('.submenu-toggle')?.classList.add('active');
    typeof setSubmenu === 'function' && setSubmenu(!!isMobile);
    }

    // Optional: desktop hover behavior (no stickiness)
    const submenuContainer = document.querySelector('.has-submenu');
    const isMobileView = () => window.matchMedia('(max-width: 900px)').matches;

    submenuContainer?.addEventListener('mouseenter', () => {
    if (!isMobileView()) setSubmenu(true);
    });
    submenuContainer?.addEventListener('mouseleave', () => {
    if (!isMobileView()) setSubmenu(false);
    });

    // Keep things correct on resize (e.g., rotate phone / resize browser)
    window.addEventListener('resize', () => {
    if (!submenuContainer) return;
    if (isMobileView()) {
        // let mobile keep submenu closed by default; it opens via click
        setSubmenu(false);
    } else {
        // on desktop, default closed until hovered
        setSubmenu(false);
    }
});

})();

// ===== HERO INTRO SEQUENCE (first landing only) =====
(function () {
  const hero = document.querySelector('.hero');
  const nameEl = document.querySelector('.slide-name');
  const vbar = document.querySelector('.vbar');
  const wrap = document.getElementById('typewrap');
  if (!hero || !nameEl || !vbar || !wrap) return;

  const lines = [...wrap.querySelectorAll('span[data-text]')];

  const TYPE_SPEED = 30;   // ms per character
  const LINE_GAP = 250;    // delay between lines

  // Only play once per session
  const alreadyPlayed = sessionStorage.getItem('introPlayed');

  // Render final state instantly (no typing) if already played
  function snapToEnd() {
    hero.classList.add('played', 'typing');
    // force bar to full height (CSS handles it), and set all lines visible
    lines.forEach((span) => {
      span.textContent = span.getAttribute('data-text') || '';
      span.classList.remove('typing');
    });
  }

  // Simple typewriter for one line
  function typeLine(span, text) {
    return new Promise((resolve) => {
      span.classList.add('typing');
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          span.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, TYPE_SPEED);
        } else {
          span.classList.remove('typing');
          resolve();
        }
      };
      tick();
    });
  }

  async function runIntro() {
    // slide name left
    hero.classList.add('played');

    // wait a bit for the bar to drop start
    setTimeout(() => hero.classList.add('typing'), 500);

    // type lines sequentially
    for (const span of lines) {
      const text = span.getAttribute('data-text') || '';
      await typeLine(span, text);
      await new Promise(r => setTimeout(r, LINE_GAP));
    }

    sessionStorage.setItem('introPlayed', '1');
  }

  // Kick off
  if (alreadyPlayed) {
    snapToEnd();
  } else {
    // Start after DOM is ready & a short beat for a nicer feel
    window.requestAnimationFrame(() => {
      setTimeout(runIntro, 250);
    });
  }
})();
