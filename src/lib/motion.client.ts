/* Cliente — boot de Lenis + GSAP ScrollTrigger + utilidades.
 * Carga una sola vez en <head> con type="module" en Base.astro.
 * Respeta prefers-reduced-motion.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
let lenis: Lenis | null = null;
function bootLenis() {
  if (reduced) return;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.4,
    lerp: 0.1,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Intercept anchor links
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    const a = t.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id) as HTMLElement | null;
    if (el) {
      e.preventDefault();
      lenis!.scrollTo(el, { offset: -64 });
    }
  });
}

/* ---------- Reveal (IntersectionObserver) ---------- */
function bootReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  if (reduced) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

/* ---------- SplitHeading: char-by-char reveal ---------- */
function bootSplitHeadings() {
  const els = document.querySelectorAll<HTMLElement>('[data-split]');
  els.forEach((el) => {
    const split = new SplitType(el, { types: 'lines,words,chars', tagName: 'span' });
    if (reduced) return;
    gsap.set(split.chars, { yPercent: 110, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.012,
          duration: 0.9,
          ease: 'expo.out',
        });
      },
      once: true,
    });
  });
}

/* ---------- Magnetic buttons ---------- */
function bootMagnetic() {
  if (reduced) return;
  const els = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength || '18');
    let raf = 0;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        gsap.to(el, { x: (x / r.width) * strength, y: (y / r.height) * strength, duration: 0.6, ease: 'power3.out' });
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ---------- Counters ---------- */
function bootCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-counter]');
  els.forEach((el) => {
    const target = parseFloat(el.dataset.counter || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(state, {
          v: target,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = state.v.toFixed(decimals) + suffix;
          },
        });
      },
      once: true,
    });
  });
}

/* ---------- Parallax (data-parallax="speed") ---------- */
function bootParallax() {
  if (reduced) return;
  const els = document.querySelectorAll<HTMLElement>('[data-parallax]');
  els.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2');
    gsap.fromTo(el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/* ---------- Pinned horizontal scroll ---------- */
function bootHorizontalPin() {
  if (reduced) return;
  const sections = document.querySelectorAll<HTMLElement>('[data-pin-horizontal]');
  sections.forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-pin-track]');
    if (!track) return;
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  });
}

/* ---------- Cursor ring ---------- */
function bootCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (reduced) return;
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');
  const pos = { x: -100, y: -100 };
  const target = { x: -100, y: -100 };
  window.addEventListener('mousemove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });
  gsap.ticker.add(() => {
    pos.x += (target.x - pos.x) * 0.18;
    pos.y += (target.y - pos.y) * 0.18;
    ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
  });
  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}

/* ---------- Header on scroll ---------- */
function bootHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY || 0;
    header.classList.toggle('is-scrolled', y > 16);
    header.classList.toggle('is-hidden', y > last + 8 && y > 200);
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Page-enter curtain ---------- */
function bootCurtain() {
  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  if (!curtain) return;
  if (reduced) { curtain.remove(); return; }
  gsap.timeline({ defaults: { ease: 'expo.inOut' } })
    .to(curtain, { yPercent: -100, duration: 1.0, delay: 0.25 })
    .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1.0, stagger: 0.08 }, '-=0.6')
    .from('[data-hero-sub]', { y: 30, opacity: 0, duration: 0.8 }, '-=0.7')
    .from('[data-hero-cta]', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.55')
    .from('[data-hero-meta]', { opacity: 0, duration: 0.6 }, '-=0.4');
  curtain.addEventListener('transitionend', () => curtain.remove(), { once: true });
  setTimeout(() => curtain?.remove(), 2400);
}

/* ---------- Marquee duration based on width ---------- */
function bootMarquee() {
  const tracks = document.querySelectorAll<HTMLElement>('.marquee__track');
  tracks.forEach((t) => {
    const dur = parseFloat(t.dataset.duration || '40');
    t.style.animationDuration = `${dur}s`;
  });
}

/* ---------- Init ---------- */
function init() {
  bootLenis();
  bootCurtain();
  bootHeader();
  bootReveal();
  bootSplitHeadings();
  bootMagnetic();
  bootCounters();
  bootParallax();
  bootHorizontalPin();
  bootMarquee();
  bootCursor();
  // After all sections registered, refresh once for safety
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
