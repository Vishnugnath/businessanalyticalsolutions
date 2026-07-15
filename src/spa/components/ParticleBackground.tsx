import { useEffect, useRef } from "react";

/**
 * Zero-Gravity Antigravity-style particle field.
 *
 * Dense field of small floating dots with true inertia physics —
 * mouse movement applies a velocity impulse (wind), particles coast
 * and slowly spring back — the "weightless" zero-gravity feel.
 */

const CFG = {
  dotGridStep: 60,
  dotJitter: 16,
  dotSizeMin: 1.4,
  dotSizeMax: 3.2,
  dotOpacityMin: 0.25,
  dotOpacityMax: 0.70,

  dotDamping: 0.975,
  dotSpringK: 0.0018,
  dotMouseRadius: 170,
  dotWindScale: 0.28,
  dotRepelStrength: 5.5,

  colors: [
    "#7C3AED", "#A855F7", "#C026D3",
    "#3B82F6", "#4F7FFF", "#6366F1",
    "#2563EB", "#60A5FA",
    "#F59E0B", "#F97316", "#EAB308",
    "#EF4444", "#EC4899", "#F43F5E",
    "#D946EF",
  ],
};

interface Dot {
  bx: number; by: number;
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  phase: number;
  colorIdx: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let dots: Dot[] = [];
    let rafId: number;
    let lastTime = performance.now();
    let W = 0, H = 0;

    const ptr = {
      x: null as number | null,
      y: null as number | null,
      vx: 0, vy: 0,
      px: null as number | null,
      py: null as number | null,
      active: false,
    };

    const rmo = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = rmo.matches;
    const onRmo = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
    rmo.addEventListener("change", onRmo);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const buildDotField = () => {
      dots = [];
      for (let gy = CFG.dotGridStep / 2; gy < H; gy += CFG.dotGridStep) {
        for (let gx = CFG.dotGridStep / 2; gx < W; gx += CFG.dotGridStep) {
          const bx = gx + (Math.random() - 0.5) * CFG.dotJitter * 2;
          const by = gy + (Math.random() - 0.5) * CFG.dotJitter * 2;
          dots.push({
            bx, by, x: bx, y: by,
            vx: 0, vy: 0,
            size: CFG.dotSizeMin + Math.random() * (CFG.dotSizeMax - CFG.dotSizeMin),
            opacity: CFG.dotOpacityMin + Math.random() * (CFG.dotOpacityMax - CFG.dotOpacityMin),
            phase: Math.random() * Math.PI * 2,
            colorIdx: Math.floor(Math.random() * CFG.colors.length),
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width || window.innerWidth;
      H = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDotField();
    };

    const animate = (now: number) => {
      lastTime = now;

      // Smooth mouse velocity
      if (ptr.x !== null && ptr.px !== null) {
        ptr.vx = lerp(ptr.vx, ptr.x - ptr.px, 0.4);
        ptr.vy = lerp(ptr.vy, ptr.y! - ptr.py!, 0.4);
      } else {
        ptr.vx *= 0.88;
        ptr.vy *= 0.88;
      }
      ptr.px = ptr.x;
      ptr.py = ptr.y;

      const dark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, W, H);

      const mx = ptr.x;
      const my = ptr.y;
      const mspeed = Math.sqrt(ptr.vx * ptr.vx + ptr.vy * ptr.vy);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (!reducedMotion) {
          d.phase += 0.008;

          // Spring back to home (very weak — floats back slowly)
          d.vx += (d.bx - d.x) * CFG.dotSpringK;
          d.vy += (d.by - d.y) * CFG.dotSpringK;

          // Mouse interaction
          if (mx !== null && my !== null) {
            const dx = d.x - mx;
            const dy = d.y - my;
            const distSq = dx * dx + dy * dy;
            const radiusSq = CFG.dotMouseRadius * CFG.dotMouseRadius;

            if (distSq < radiusSq) {
              const dist = Math.sqrt(distSq) || 0.001;
              const norm = 1 - dist / CFG.dotMouseRadius;

              // Wind: push in direction the mouse is moving
              if (mspeed > 0.5) {
                const windStrength = norm * CFG.dotWindScale * mspeed;
                d.vx += (ptr.vx / mspeed) * windStrength;
                d.vy += (ptr.vy / mspeed) * windStrength;
              }

              // Static repel when cursor is idle
              const repel = norm * norm * CFG.dotRepelStrength;
              d.vx += (dx / dist) * repel * 0.06;
              d.vy += (dy / dist) * repel * 0.06;
            }
          }

          // High inertia — particles coast in zero-gravity
          d.vx *= CFG.dotDamping;
          d.vy *= CFG.dotDamping;

          d.x += d.vx;
          d.y += d.vy;
        }

        // Draw with slow twinkle
        const twinkle = 0.7 + 0.3 * Math.sin(d.phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = CFG.colors[d.colorIdx];
        ctx.globalAlpha = d.opacity * twinkle * (dark ? 0.9 : 0.65);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(animate);
    };

    const setPtr = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = cx - rect.left, y = cy - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        ptr.x = x; ptr.y = y; ptr.active = true;
      } else {
        ptr.x = null; ptr.y = null; ptr.active = false; ptr.px = null; ptr.py = null;
      }
    };

    const clearPtr = () => {
      ptr.x = null; ptr.y = null; ptr.active = false;
      ptr.px = null; ptr.py = null; ptr.vx = 0; ptr.vy = 0;
    };

    const onMouseMove  = (e: MouseEvent) => setPtr(e.clientX, e.clientY);
    const onMouseLeave = ()              => clearPtr();
    const onTouchMove  = (e: TouchEvent) => {
      if (e.touches.length > 0) setPtr(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd   = ()              => clearPtr();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    resize();
    requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      rmo.removeEventListener("change", onRmo);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
