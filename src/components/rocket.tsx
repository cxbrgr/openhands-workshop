"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative rocket that trails the pointer across the background.
 * Position is driven directly via refs inside a rAF loop so the animation
 * never triggers React re-renders.
 */
export function Rocket() {
  const layerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const body = bodyRef.current;
    if (!layer || !body) return;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let x = targetX;
    let y = targetY;
    let angle = 0;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const tick = () => {
      const dx = targetX - x;
      const dy = targetY - y;
      x += dx * 0.14;
      y += dy * 0.14;

      if (dx * dx + dy * dy > 1) {
        const next = (Math.atan2(dy, dx) * 180) / Math.PI;
        let delta = next - angle;
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;
        angle += delta * 0.2;
      }

      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      body.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="rocket-layer">
      <div ref={bodyRef} className="rocket-body">
        <svg viewBox="0 0 64 48" width="76" height="57" role="presentation" focusable="false">
          <defs>
            <linearGradient id="rocket-hull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#c7ccd6" />
            </linearGradient>
            <linearGradient id="rocket-nose" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff7a7a" />
              <stop offset="1" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          <g className="rocket-flame">
            <path d="M14 20 C4 22 1 24 1 24 C1 24 4 26 14 28 Z" fill="#ffb020" />
            <path d="M14 22 C7 23 5 24 5 24 C5 24 7 25 14 26 Z" fill="#fff2b0" />
          </g>

          <path d="M16 15 L27 15 L13 4 Z" fill="#e11d48" />
          <path d="M16 33 L27 33 L13 44 Z" fill="#e11d48" />

          <rect x="14" y="14" width="30" height="20" rx="10" fill="url(#rocket-hull)" />

          <path d="M42 14 C52 16 63 24 63 24 C63 24 52 32 42 34 Z" fill="url(#rocket-nose)" />

          <circle cx="30" cy="24" r="5.5" fill="#0ea5e9" />
          <circle cx="30" cy="24" r="5.5" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
