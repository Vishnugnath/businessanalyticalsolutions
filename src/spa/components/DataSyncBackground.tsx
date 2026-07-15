import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ActiveLink {
  p1: Point;
  p2: Point;
  dist: number;
}

interface Pulse {
  from: Point;
  to: Point;
  progress: number; // 0 to 1
  speed: number;    // increment per frame for ~1s travel time
}

export default function DataSyncBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [];
    let pulses: Pulse[] = [];
    let rafId: number;
    let W = 0;
    let H = 0;

    const numPoints = 45;
    const linkDist = 90;

    const initPoints = (width: number, height: number) => {
      points = [];
      for (let i = 0; i < numPoints; i++) {
        // Random speed between 0.1 and 0.2 px/frame
        const speed = 0.1 + Math.random() * 0.1;
        const angle = Math.random() * Math.PI * 2;
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }
      pulses = []; // Clear existing pulses on resize/init
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width || window.innerWidth;
      H = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPoints(W, H);
    };

    const animate = () => {
      const isDark = document.documentElement.classList.contains("dark");

      // Set colors based on light/dark mode
      // lines/dots use rgba(93,202,165, alpha) as base teal.
      // Pulse uses rgba(15,110,86, alpha) for light mode and a brighter variant (or reverse) for premium appearance.
      const lineBase = "59, 130, 246";
      const dotBase = "59, 130, 246";
      const pulseBase = isDark ? "56, 189, 248" : "37, 99, 235";

      ctx.clearRect(0, 0, W, H);

      // 1. Update points & bounce check
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx = -p.vx;
        } else if (p.x > W) {
          p.x = W;
          p.vx = -p.vx;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy = -p.vy;
        } else if (p.y > H) {
          p.y = H;
          p.vy = -p.vy;
        }
      }

      // 2. Find active links
      const activeLinks: ActiveLink[] = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            activeLinks.push({ p1, p2, dist });
          }
        }
      }

      // 3. Draw lines first (so they are under the dots/pulses)
      for (let i = 0; i < activeLinks.length; i++) {
        const link = activeLinks[i];
        const opacity = 0.25 * (1 - link.dist / linkDist);
        ctx.strokeStyle = `rgba(${lineBase}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(link.p1.x, link.p1.y);
        ctx.lineTo(link.p2.x, link.p2.y);
        ctx.stroke();
      }

      // 4. Draw static points on top of lines
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.fillStyle = `rgba(${dotBase}, 0.5)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Spawn new pulses (3-5% chance per frame when links exist)
      if (activeLinks.length > 0 && Math.random() < 0.04) {
        const link = activeLinks[Math.floor(Math.random() * activeLinks.length)];
        const from = Math.random() > 0.5 ? link.p1 : link.p2;
        const to = from === link.p1 ? link.p2 : link.p1;
        
        // Travel time is ~1 second (approx 60 frames)
        pulses.push({
          from,
          to,
          progress: 0,
          speed: 1 / 60,
        });
      }

      // 6. Draw active pulses on top of everything
      const remainingPulses: Pulse[] = [];
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress < 1) {
          remainingPulses.push(pulse);

          // Find current position along the active link path
          const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
          const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

          // Draw the traveling pulse dot
          ctx.fillStyle = `rgba(${pulseBase}, 0.85)`;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      pulses = remainingPulses;

      rafId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    resize();
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}
