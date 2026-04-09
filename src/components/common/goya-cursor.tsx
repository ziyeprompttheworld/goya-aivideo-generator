'use client';

import { useEffect, useRef } from 'react';

/**
 * GoyaCursor
 * 
 * Combines:
 * - azumbrunnen radial glow blob (36px, lazy lag)
 * - Goya director's viewfinder ring (snappy, slow-rotating)
 * - Pinpoint center dot
 *
 * States:
 * - default   : glow 36px white soft + ring 36px rotating 8°/s
 * - hover link: glow 56px #008fff + ring 52px fast-rotating 90°/s
 * - hover text: glow collapses to 2×22px vertical bar (IBM cursor)
 * - hover input: blue blinking bar (terminal feel)
 */
export function GoyaCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow   = glowRef.current;
    const ring   = ringRef.current;
    if (!cursor || !glow || !ring) return;

    let mx = -100, my = -100;
    let gx = -100, gy = -100;
    let rx = -100, ry = -100;
    let rotAngle = 0;
    let rafId = 0;
    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = '1';
        gx = mx; gy = my;
        rx = mx; ry = my;
      }

      const el = document.elementFromPoint(mx, my) as HTMLElement | null;
      if (!el) return;

      const tag      = el.tagName.toLowerCase();
      const isLink   = !!el.closest('a, button, [role="button"], label');
      const isInput  = ['input', 'textarea'].includes(tag);
      const isText   = !isLink && !isInput &&
        !!el.closest('p, li, span, h1, h2, h3, h4, blockquote');

      document.body.dataset.cur = isInput ? 'input'
        : isLink  ? 'link'
        : isText  ? 'text'
        : 'default';
    };

    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = '1'; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const tick = () => {
      const state = document.body.dataset.cur ?? 'default';
      const isLink = state === 'link';

      // Glow: dreamy lag
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;

      // Ring: snappier
      rx += (mx - rx) * 0.25;
      ry += (my - ry) * 0.25;

      // Dot: instant
      cursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

      // Offset
      glow.style.transform = `translate3d(${gx - mx}px, ${gy - my}px, 0) translate(-50%, -50%)`;
      
      // Rotation + dynamic positioning
      rotAngle += isLink ? 0.12 : 0.018;
      ring.style.transform = `translate3d(${rx - mx}px, ${ry - my}px, 0) translate(-50%, -50%) rotate(${rotAngle}rad)`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId);
      delete document.body.dataset.cur;
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }

        #az-cursor {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.3s ease;
          will-change: transform;
        }

        /* Glow blob */
        #az-glow {
          position: absolute;
          width: 38px; height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at center,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.08) 40%,
            rgba(0,143,255,0.05)   70%,
            transparent 100%
          );
          pointer-events: none;
        }
          transition:
            width  0.45s cubic-bezier(0.25,0.1,0.25,1),
            height 0.45s cubic-bezier(0.25,0.1,0.25,1),
            background 0.35s ease;
        }

        /* Ring */
        #az-ring {
          position: absolute;
          width: 36px; height: 36px;
          transform: translate(-50%, -50%);
          transition:
            width  0.30s cubic-bezier(0.25,0.1,0.25,1),
            height 0.30s cubic-bezier(0.25,0.1,0.25,1),
            opacity 0.25s ease;
          opacity: 0.9;
        }

        /* Center dot removed */

        /* ── Link hover ── */
        [data-cur="link"] #az-glow {
          width: 56px; height: 56px;
          background: radial-gradient(circle at center,
            rgba(0,143,255,0.22) 0%,
            rgba(0,143,255,0.09) 45%,
            rgba(0,143,255,0.03) 70%,
            transparent 100%
          );
        }
        [data-cur="link"] #az-ring { width: 52px; height: 52px; opacity: 1; }

        /* ── Text hover: glow + ring shrink slightly, stay visible ── */
        [data-cur="text"] #az-glow {
          width: 26px; height: 26px;
          background: radial-gradient(circle at center,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.08) 50%,
            transparent 100%
          );
        }
        [data-cur="text"] #az-ring { width: 26px; height: 26px; opacity: 0.6; }

        /* ── Input hover: blue glow, ring stays, dot goes blue ── */
        [data-cur="input"] #az-glow {
          width: 32px; height: 32px;
          background: radial-gradient(circle at center,
            rgba(0,143,255,0.16) 0%,
            rgba(0,143,255,0.06) 55%,
            transparent 100%
          );
        }
        [data-cur="input"] #az-ring { width: 30px; height: 30px; opacity: 0.7; }
      `}</style>

      <div id="az-cursor" ref={cursorRef}>
        {/* Glow blob — azumbrunnen radial glow */}
        <div id="az-glow" ref={glowRef} />

        {/* Viewfinder ring — Goya director's frame */}
        <svg
          id="az-ring"
          ref={ringRef}
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer thin circle */}
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="rgba(255,255,255,0.40)"
            strokeWidth="0.7"
          />
          {/* Cardinal tick marks */}
          <line x1="18" y1="2.5"  x2="18" y2="8"    stroke="rgba(255,255,255,0.40)" strokeWidth="0.7"/>
          <line x1="18" y1="28"   x2="18" y2="33.5"  stroke="rgba(255,255,255,0.40)" strokeWidth="0.7"/>
          <line x1="2.5" y1="18"  x2="8"   y2="18"   stroke="rgba(255,255,255,0.40)" strokeWidth="0.7"/>
          <line x1="28"  y1="18"  x2="33.5" y2="18"  stroke="rgba(255,255,255,0.40)" strokeWidth="0.7"/>
          {/* Corner L-brackets in #008fff */}
          <path d="M4,9 L4,4 L9,4"        fill="none" stroke="#008fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27,4 L32,4 L32,9"     fill="none" stroke="#008fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4,27 L4,32 L9,32"     fill="none" stroke="#008fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27,32 L32,32 L32,27"  fill="none" stroke="#008fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </>
  );
}
