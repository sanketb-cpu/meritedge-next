'use client';
import { useEffect, useRef, useState } from 'react';

const PATHS = {
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M10 12h5M10 16h5"/>',
  chat: '<path d="M4 5h16v11H8l-4 4z"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>',
  book: '<path d="M4 4v16M9 4v16M14 4l5 16"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M16 4a3 3 0 0 1 0 6M18 15c2 1 3 3 3 5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  gift2: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
};

export function Icon({ name, color = '#A1A1B5', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }} />
  );
}

export function Spinner() {
  return <span className="spin" aria-hidden="true" />;
}

/** Full-screen step-by-step progress window */
export function ProgressOverlay({ title, steps, ms, onDone }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (k > steps.length) return;
    const t = setTimeout(() => {
      if (k === steps.length) onDone();
      else setK(k + 1);
    }, k === steps.length ? 250 : ms / steps.length);
    return () => clearTimeout(t);
  }, [k, steps.length, ms, onDone]);
  return (
    <div className="overlay" role="status" aria-live="polite">
      <div className="ovbox">
        <b>{title}…</b>
        {steps.map((s, j) => (
          <div key={s} className={'ovrow' + (j < k ? ' done' : j === k ? ' now' : '')}>
            <span className="ic">{j < k ? '✓' : ''}</span>{s}
          </div>
        ))}
        <div className="ovbar"><i style={{ width: (Math.min(k, steps.length) / steps.length) * 100 + '%' }} /></div>
      </div>
    </div>
  );
}

/** Animates a number from 0 to value */
export function CountUp({ value, ms = 900 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms); const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <>{v}</>;
}

const COLORS = ['#8B5CF6', '#3B82F6', '#F97316', '#10B981', '#F472B6', '#FDE047'];

/** Falling confetti, used on the success screen */
export function Confetti({ count = 14 }) {
  const ref = useRef(
    Array.from({ length: count }, (_, i) => ({
      left: Math.round(Math.random() * 96) + '%', top: Math.round(10 + Math.random() * 70) + '%',
      bg: COLORS[i % COLORS.length], delay: i * 120 + 'ms', rot: Math.round(Math.random() * 90 - 45),
    }))
  );
  return (
    <div className="confetti" aria-hidden="true">
      {ref.current.map((c, i) => (
        <span key={i} style={{ left: c.left, top: c.top, background: c.bg, animationDelay: c.delay, rotate: c.rot + 'deg' }} />
      ))}
    </div>
  );
}

/** Burst of particles from a point on screen (the countdown "blast") */
export function blast(x, y) {
  const add = (css) => { const el = document.createElement('div'); el.style.cssText = css; document.body.appendChild(el); return el; };
  const ring = add(`position:fixed;left:${x}px;top:${y}px;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:4px solid #A78BFA;z-index:70;pointer-events:none;transition:transform .7s cubic-bezier(.1,.8,.2,1),opacity .7s`);
  const flash = add(`position:fixed;inset:0;z-index:69;pointer-events:none;background:radial-gradient(circle at ${x}px ${y}px, rgba(167,139,250,.55), transparent 55%);transition:opacity .9s`);
  requestAnimationFrame(() => { ring.style.transform = 'scale(40)'; ring.style.opacity = '0'; flash.style.opacity = '0'; });
  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 160 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.55;
    const sz = 6 + Math.random() * 10;
    const p = add(`position:fixed;left:${x}px;top:${y}px;width:${sz}px;height:${sz * (Math.random() < 0.5 ? 0.45 : 1)}px;border-radius:${Math.random() < 0.4 ? '50%' : '2px'};background:${COLORS[i % COLORS.length]};z-index:71;pointer-events:none;transition:transform 1.1s cubic-bezier(.1,.7,.2,1),opacity 1.1s ease-in`);
    requestAnimationFrame(() => { p.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 120}px) rotate(${Math.random() * 720 - 360}deg)`; p.style.opacity = '0'; });
    setTimeout(() => p.remove(), 1300);
  }
  setTimeout(() => { ring.remove(); flash.remove(); }, 1000);
}
