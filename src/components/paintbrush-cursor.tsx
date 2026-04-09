"use client";

import { useEffect, useRef } from "react";

export function PaintbrushCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.left = `${e.clientX + 4}px`;
        el.style.top = `${e.clientY - 20}px`;
      });
    };
    document.addEventListener("mousemove", move);
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        fontSize: "22px",
        lineHeight: 1,
        pointerEvents: "none",
        zIndex: 9999,
        userSelect: "none",
        transform: "rotate(-20deg)",
        left: "-100px",
        top: "-100px",
      }}
    >
      🖌️
    </div>
  );
}
