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