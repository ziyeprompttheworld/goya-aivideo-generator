"use client";

import { useEffect, useRef } from "react";

const LAYERS = [
  { amp: 0.055, freq: 2.1,  speed: 0.28, phase: 0.0,  bright: 0.40 },
  { amp: 0.038, freq: 3.7,  speed: 0.40, phase: 1.2,  bright: 0.30 },
  { amp: 0.026, freq: 5.9,  speed: 0.55, phase: 2.5,  bright: 0.24 },
  { amp: 0.018, freq: 9.3,  speed: 0.68, phase: 0.8,  bright: 0.30 },
  { amp: 0.012, freq: 14.1, speed: 0.82, phase: 3.1,  bright: 0.35 },
  { amp: 0.008, freq: 21.0, speed: 1.00, phase: 1.7,  bright: 0.40 },
];

const HORIZON = 0.52;

interface Props {
  /** When true, renders as absolute fill inside a positioned parent instead of fixed full-screen */
  contained?: boolean;
}

export const SeascapeBackground2D: React.FC<Props> = ({ contained = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      const t = ts * 0.001;
      const w = canvas.width;
      const h = canvas.height;
      const horizonY = HORIZON * h;

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#000000");
      skyGrad.addColorStop(1, "#0c0c0e");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Water
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      waterGrad.addColorStop(0, "#101116");
      waterGrad.addColorStop(1, "#08090c");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Wave lines
      for (let li = 0; li < LAYERS.length; li++) {
        const layer = LAYERS[li];
        const baseY = horizonY + (li / LAYERS.length) * (h - horizonY) * 0.7;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const nx = x / w;
          const y = baseY + layer.amp * h * Math.sin(layer.freq * nx * Math.PI * 2 + layer.speed * t + layer.phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = layer.bright * (1 - (li / LAYERS.length) * 0.5);
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = li < 2 ? 0.8 : 0.5;
        ctx.stroke();

        if (li < 3) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 2) {
            const nx = x / w;
            const y = baseY + layer.amp * h * Math.sin(layer.freq * nx * Math.PI * 2 + layer.speed * t + layer.phase);
            if (x === 0) ctx.moveTo(x, y + 1);
            else ctx.lineTo(x, y + 1);
          }
          ctx.strokeStyle = `rgba(0,143,255,${(alpha * 0.70).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Horizon glow
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, horizonY - 1);
      ctx.lineTo(w, horizonY - 1);
      ctx.strokeStyle = "rgba(0,143,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (contained) {
    return (
      <div className="absolute inset-0 bg-black">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default SeascapeBackground2D;
