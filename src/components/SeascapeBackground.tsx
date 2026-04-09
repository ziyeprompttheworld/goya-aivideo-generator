"use client";

import React, { useEffect, useRef } from "react";

export function SeascapeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Wave state — Seascape style: multiple octaves of slow sinusoidal waves
    // All monochrome, depth via brightness only
    const LAYERS = [
      { amp: 0.045, freq: 2.1, speed: 0.18, phase: 0.0, bright: 0.13 },
      { amp: 0.03, freq: 3.7, speed: 0.28, phase: 1.2, bright: 0.09 },
      { amp: 0.02, freq: 5.9, speed: 0.4, phase: 2.5, bright: 0.07 },
      { amp: 0.014, freq: 9.3, speed: 0.55, phase: 0.8, bright: 0.12 },
      { amp: 0.009, freq: 14.1, speed: 0.7, phase: 3.1, bright: 0.16 },
      { amp: 0.006, freq: 21.0, speed: 0.9, phase: 1.7, bright: 0.2 },
    ];

    // Horizon sits at ~55% from top
    const HORIZON = 0.52;

    const waveY = (x: number, layer: any, time: number) => {
      const nx = x / W();
      return (
        layer.amp *
        H() *
        Math.sin(layer.freq * nx * Math.PI * 2 + layer.speed * time + layer.phase)
      );
    };

    const skyLuma = (y: number) => {
      const n = y / (HORIZON * H());
      return Math.pow(n, 2.2) * 0.06;
    };

    const waterLuma = (y: number, t: number) => {
      const n = 1 - (y - HORIZON * H()) / (H() * (1 - HORIZON));
      return 0.04 + Math.pow(n, 1.4) * 0.09;
    };

    const draw = (ts: number) => {
      t = ts * 0.001;
      const w = W();
      const h = H();
      const horizonY = HORIZON * h;

      // --- SKY ---
      for (let y = 0; y < horizonY; y++) {
        const luma = skyLuma(y);
        const v = Math.round(luma * 255);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(0, y, w, 1);
      }

      // --- WATER BASE ---
      for (let y = horizonY; y < h; y++) {
        const luma = waterLuma(y, t);
        const v = Math.round(luma * 255);
        // very faint blue tint in the water, like #008fff at opacity ~0.03
        const r = Math.round(v * 0.9);
        const g = Math.round(v * 0.95);
        const b = Math.round(v + luma * 8);
        ctx.fillStyle = `rgb(${r},${g},${Math.min(255, b)})`;
        ctx.fillRect(0, y, w, 1);
      }

      // --- WAVE LINES ---
      for (let li = 0; li < LAYERS.length; li++) {
        const layer = LAYERS[li];
        const baseY = horizonY + (li / LAYERS.length) * (h - horizonY) * 0.7;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = baseY + waveY(x, layer, t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = layer.bright * (1 - li / LAYERS.length * 0.5);
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = li < 2 ? 0.8 : 0.5;
        ctx.stroke();

        // Subtle foam glow beneath the crest line
        if (li < 3) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 2) {
            const y = baseY + waveY(x, layer, t);
            if (x === 0) ctx.moveTo(x, y + 1);
            else ctx.lineTo(x, y + 1);
          }
          ctx.strokeStyle = `rgba(0,143,255,${(alpha * 0.25).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // --- HORIZON GLOW ---
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Very faint #008fff streak just above horizon
      ctx.beginPath();
      ctx.moveTo(0, horizonY - 1);
      ctx.lineTo(w, horizonY - 1);
      ctx.strokeStyle = "rgba(0,143,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ opacity: 1, filter: "opacity(0.8)" }}
      />
    </div>
  );
}
