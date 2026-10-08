import React, { useEffect, useRef } from 'react';
import { CaptureEvent } from '../types/chess';
import confetti from 'canvas-confetti';

interface VFXCanvasProps {
  captureEvent: CaptureEvent | null;
  boardRect: DOMRect | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  text?: string;
}

interface LightningBranch {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number }[];
  alpha: number;
  width: number;
}

const GREEK_RUNES = ['⚡', 'Ω', 'Ψ', 'Φ', 'Δ', 'Σ', '🏛️', '🪽', '🔱', '⚔️', '👑'];

export const VFXCanvas: React.FC<VFXCanvasProps> = ({ captureEvent, boardRect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lightningRef = useRef<LightningBranch[]>([]);
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; alpha: number; color: string }[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Resize canvas to full window
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger VFX when captureEvent arrives
  useEffect(() => {
    if (!captureEvent) return;

    // Use event coords or screen center fallback
    const targetX = captureEvent.x || window.innerWidth / 2;
    const targetY = captureEvent.y || window.innerHeight / 2;

    const isWhiteAttacker = captureEvent.attacker.color === 'w';
    const mainColor = isWhiteAttacker ? '#facc15' : '#ef4444'; // Gold for Olympus, Crimson for Tartarus
    const secondaryColor = isWhiteAttacker ? '#ffffff' : '#fb923c';

    // 1. Generate Lightning Bolt from sky to target
    const skyStartX = targetX + (Math.random() - 0.5) * 160;
    const skyStartY = 0; // Top of viewport (skies of Olympus)

    const createLightningSegments = (x1: number, y1: number, x2: number, y2: number, steps = 14) => {
      const segs: { x: number; y: number }[] = [{ x: x1, y: y1 }];
      const dx = (x2 - x1) / steps;
      const dy = (y2 - y1) / steps;

      for (let i = 1; i < steps; i++) {
        const jitter = (1 - i / steps) * 45 + 15;
        const curX = x1 + dx * i + (Math.random() - 0.5) * jitter;
        const curY = y1 + dy * i;
        segs.push({ x: curX, y: curY });
      }
      segs.push({ x: x2, y: y2 });
      return segs;
    };

    // Main bolt
    const mainBolt: LightningBranch = {
      startX: skyStartX,
      startY: skyStartY,
      endX: targetX,
      endY: targetY,
      segments: createLightningSegments(skyStartX, skyStartY, targetX, targetY, 18),
      alpha: 1.0,
      width: 4.5
    };

    // Sub-branches
    const subBolts: LightningBranch[] = [];
    for (let i = 0; i < 3; i++) {
      const branchIndex = Math.floor(Math.random() * (mainBolt.segments.length - 4)) + 2;
      const startPt = mainBolt.segments[branchIndex];
      const endBranchX = startPt.x + (Math.random() - 0.5) * 120;
      const endBranchY = startPt.y + Math.random() * 90 + 40;

      subBolts.push({
        startX: startPt.x,
        startY: startPt.y,
        endX: endBranchX,
        endY: endBranchY,
        segments: createLightningSegments(startPt.x, startPt.y, endBranchX, endBranchY, 8),
        alpha: 0.8,
        width: 2.0
      });
    }

    lightningRef.current = [mainBolt, ...subBolts];

    // 2. Shockwaves
    shockwavesRef.current.push({
      x: targetX,
      y: targetY,
      radius: 5,
      maxRadius: 140,
      alpha: 0.95,
      color: mainColor
    });
    shockwavesRef.current.push({
      x: targetX,
      y: targetY,
      radius: 2,
      maxRadius: 90,
      alpha: 0.8,
      color: secondaryColor
    });

    // 3. Greek Runes & Golden Spark Particles
    const newParticles: Particle[] = [];

    // Greek Rune bursts
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 / 10) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 5 + 3.5;
      const rune = GREEK_RUNES[Math.floor(Math.random() * GREEK_RUNES.length)];

      newParticles.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // upward bias
        size: 20 + Math.random() * 8,
        color: mainColor,
        alpha: 1,
        life: 0,
        maxLife: 45 + Math.random() * 20,
        rotation: (Math.random() - 0.5) * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
        text: rune
      });
    }

    // High speed golden embers
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      newParticles.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.4 ? mainColor : '#ffffff',
        alpha: 1,
        life: 0,
        maxLife: 30 + Math.random() * 25,
        rotation: 0,
        vRot: 0
      });
    }

    particlesRef.current.push(...newParticles);

    // If king or queen captured, trigger golden celebratory confetti bursts!
    if (captureEvent.victim.type === 'q' || captureEvent.victim.type === 'k') {
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: {
            x: targetX / window.innerWidth,
            y: targetY / window.innerHeight
          },
          colors: ['#eab308', '#facc15', '#fbbf24', '#ffffff', '#ca8a04']
        });
      } catch {
        // safe fallback
      }
    }
  }, [captureEvent, boardRect]);

  // Main VFX render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Lightning Branches
      if (lightningRef.current.length > 0) {
        lightningRef.current.forEach((bolt) => {
          if (bolt.alpha <= 0) return;

          ctx.save();
          // Glow effect
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#facc15';
          ctx.strokeStyle = `rgba(254, 240, 138, ${bolt.alpha})`;
          ctx.lineWidth = bolt.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'miter';

          ctx.beginPath();
          bolt.segments.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Core bright white center
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffffff';
          ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha * 0.9})`;
          ctx.lineWidth = Math.max(1, bolt.width * 0.45);
          ctx.stroke();

          ctx.restore();

          // Decay lightning
          bolt.alpha -= 0.045;
        });

        // Filter dead bolts
        lightningRef.current = lightningRef.current.filter((b) => b.alpha > 0);
      }

      // 2. Draw Shockwaves
      if (shockwavesRef.current.length > 0) {
        shockwavesRef.current.forEach((wave) => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = wave.color;
          ctx.lineWidth = 3 * wave.alpha;
          ctx.globalAlpha = wave.alpha;
          ctx.shadowBlur = 15;
          ctx.shadowColor = wave.color;
          ctx.stroke();
          ctx.restore();

          // Expand and fade
          wave.radius += 5.5;
          wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);
        });

        shockwavesRef.current = shockwavesRef.current.filter((w) => w.alpha > 0.02 && w.radius < w.maxRadius);
      }

      // 3. Draw Particles (Greek Runes & Sparks)
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach((p) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;

          if (p.text) {
            ctx.font = `bold ${p.size}px 'Cinzel', serif`;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.text, 0, 0);
          } else {
            // Embers
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Physics update
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // Gravity
          p.vx *= 0.98; // Drag
          p.rotation += p.vRot;
          p.life++;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        });

        particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife && p.alpha > 0.01);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
