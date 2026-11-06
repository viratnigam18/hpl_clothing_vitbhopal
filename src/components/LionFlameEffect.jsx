/**
 * LionFlameEffect — v2
 *
 * HOW IT WORKS:
 * - SVG <path> flame tongues: proper bezier flame shapes anchored to the
 *   bottom circumference of the logo circle. framer-motion animates them
 *   from scaleY=0 (ignition) through flicker to scaleY=0 (fade). Each
 *   tongue has distinct height, delay, lean, and opacity.
 * - Tiny canvas overlay: only ~12 ember sparks, tightly clustered near
 *   the flame base. NOT a radial glow. NOT blobs.
 * - Logo: 1.04× scale + a 5–6 px tight gold rim (not a 40 px aura).
 * - prefers-reduced-motion: no particles, just a gentle 1.02× scale.
 * - Re-triggers cleanly on every mouseenter (key-based remount).
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ── Helpers ─────────────────────────────────────────────────────────── */
const rnd = (a, b) => a + Math.random() * (b - a);
const GOLD_RGB = [[212, 175, 55], [243, 216, 120], [255, 205, 60]];
const rndGold  = () => GOLD_RGB[Math.floor(Math.random() * GOLD_RGB.length)];

/* ── Flame tongue specs ──────────────────────────────────────────────────
   x, y   : base origin on the 176×176 SVG (on the circle circumference)
   h      : flame height in SVG units
   hw     : half-width at the base
   lean   : x-offset of the flame tip (neg = leans left, pos = right)
   delay  : ms before this tongue ignites
   dur    : total animation duration in ms
   maxOp  : peak opacity for this tongue
   ─────────────────────────────────────────────────────────────────────── */
const FLAME_DEFS = [
  // Outer left
  { x:  44, y: 164, h:  58, hw:  8, lean:  4, delay:  60, dur:  960, maxOp: 0.76 },
  // Inner left
  { x:  65, y: 173, h:  82, hw: 11, lean: -3, delay:  18, dur: 1020, maxOp: 0.92 },
  // Center — tallest, with double layer
  { x:  88, y: 176, h: 100, hw: 14, lean:  0, delay:   0, dur:  960, maxOp: 1.00 },
  // Inner right
  { x: 111, y: 173, h:  86, hw: 12, lean:  2, delay:  28, dur: 1000, maxOp: 0.90 },
  // Outer right
  { x: 132, y: 164, h:  60, hw:  9, lean: -5, delay:  75, dur:  970, maxOp: 0.75 },
  // Accent left (thin, fast)
  { x:  54, y: 169, h:  44, hw:  5, lean:  3, delay:  95, dur:  880, maxOp: 0.62 },
  // Accent right (thin, fast)
  { x: 122, y: 169, h:  48, hw:  6, lean: -2, delay:  85, dur:  900, maxOp: 0.65 },
];

/** Bezier flame tongue: base at local (0,0), tip at (lean, -h). */
function makeFlamePath(h, hw, lean) {
  const tx = lean;
  const ty = -h;
  return [
    `M 0 0`,
    // Left edge: sweeps from base-left → narrows to tip
    `C ${-hw * 1.15} ${ty * 0.06} ${tx - hw * 0.65} ${ty * 0.44} ${tx - hw * 0.08} ${ty}`,
    // Right edge: mirrors, sweeps back to base-right
    `C ${tx + hw * 0.08} ${ty} ${tx + hw * 0.65} ${ty * 0.44} ${hw * 1.15} ${ty * 0.06}`,
    `L 0 0 Z`,
  ].join(' ');
}

/* ── Ember canvas ────────────────────────────────────────────────────── */
function spawnEmbers(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const W = 220, H = 200; // logical px
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = `${W}px`;
  canvas.style.height = `${H}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Spawn point: clustered near the circle's bottom edge
  // Canvas is 200px tall, overlaid from top:0 of the 176px logo.
  // Circle bottom is at logo y≈176, so in canvas coords: y≈165.
  const cx    = W / 2;
  const baseY = 162;

  const sparks = Array.from({ length: 12 }, () => ({
    x:  cx + rnd(-52, 52),
    y:  baseY - rnd(5, 55),
    vx: rnd(-0.65, 0.65),
    vy: rnd(-1.6, -0.4),
    life:  1,
    decay: rnd(0.028, 0.055),
    r:     rnd(0.8, 2.0),
    color: rndGold(),
    gravity:  rnd(0.020, 0.045),
    birth: Math.floor(rnd(0, 12)), // frame offset before spawning
  }));

  let frame = 0;
  let raf   = null;

  function tick() {
    frame++;
    ctx.clearRect(0, 0, W, H);
    let anyAlive = false;

    for (const s of sparks) {
      if (frame < s.birth) { anyAlive = true; continue; }
      s.x   += s.vx;
      s.y   += s.vy;
      s.vy  += s.gravity;
      s.vx  *= 0.975;
      s.life -= s.decay;

      if (s.life > 0) {
        anyAlive = true;
        const a       = Math.max(0, s.life);
        const [r,g,b] = s.color;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = `rgba(${r},${g},${b},${a})`;
        ctx.fillStyle   = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * Math.max(0, s.life), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (anyAlive) raf = requestAnimationFrame(tick);
    else          ctx.clearRect(0, 0, W, H);
  }

  raf = requestAnimationFrame(tick);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, W, H);
  };
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function LionFlameEffect({ children, logoSize = 176 }) {
  const [fireKey,  setFireKey]  = useState(0);
  const [isFiring, setIsFiring] = useState(false);
  const canvasRef   = useRef(null);
  const cancelSpark = useRef(null);
  const offTimer    = useRef(null);
  const controls    = useAnimation();
  const prefersRed  = useReducedMotion();

  // Cleanup on unmount
  useEffect(() => () => {
    cancelSpark.current?.();
    clearTimeout(offTimer.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Reduced motion: just a very gentle scale, no particles
    if (prefersRed) {
      controls.start({
        scale:  1.025,
        filter: 'drop-shadow(0 0 5px rgba(212,175,55,0.35))',
        transition: { duration: 0.3 },
      });
      return;
    }

    // Stop any running effect
    cancelSpark.current?.();
    clearTimeout(offTimer.current);

    // Force SVG flames to re-mount and restart from zero
    setIsFiring(false);

    // Two rAF passes ensure React has committed the removal before re-adding
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setFireKey(k => k + 1);
      setIsFiring(true);

      // Logo: 1.04× pop + tight 6px gold rim (NOT a large aura)
      controls.start({
        scale:  [1, 1.04, 1.03, 1.01, 1],
        filter: [
          'drop-shadow(0 0 0px rgba(212,175,55,0))',
          'drop-shadow(0 0 6px rgba(212,175,55,0.60))',
          'drop-shadow(0 0 5px rgba(212,175,55,0.40))',
          'drop-shadow(0 0 3px rgba(212,175,55,0.20))',
          'drop-shadow(0 0 0px rgba(212,175,55,0))',
        ],
        transition: {
          duration: 1.1,
          times:    [0, 0.12, 0.40, 0.75, 1.0],
          ease:     'easeOut',
        },
      });

      // Ember sparks
      if (canvasRef.current) {
        cancelSpark.current = spawnEmbers(canvasRef.current);
      }

      // Auto-remove flame SVGs after animation completes
      offTimer.current = setTimeout(() => setIsFiring(false), 1350);
    }));
  }, [controls, prefersRed]);

  const handleMouseLeave = useCallback(() => {
    if (prefersRed) {
      controls.start({
        scale: 1, filter: 'drop-shadow(0 0 0px rgba(212,175,55,0))',
        transition: { duration: 0.3 },
      });
    }
  }, [controls, prefersRed]);

  // How much the SVG canvas maps to the real logo size
  // viewBox is 0 0 176 176, actual is logoSize × logoSize
  const CANVAS_W = 220, CANVAS_H = 200;

  return (
    <div
      className="relative"
      style={{ width: logoSize, height: logoSize }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Flame tongues (SVG) ──────────────────────────────────────── */}
      <svg
        viewBox="0 0 176 176"
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          overflow:      'visible',
          pointerEvents: 'none',
          zIndex:        15,
        }}
      >
        <defs>
          {/* Gold → bright gold → amber-transparent (bottom to tip) */}
          <linearGradient id="lfe-grad-side" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#b8860b" stopOpacity="0.95" />
            <stop offset="30%"  stopColor="#d4af37" stopOpacity="0.88" />
            <stop offset="65%"  stopColor="#f3d878" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#ffc840" stopOpacity="0.00" />
          </linearGradient>
          {/* Center flame: slightly warmer/brighter */}
          <linearGradient id="lfe-grad-center" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#c8930a" stopOpacity="0.95" />
            <stop offset="25%"  stopColor="#d4af37" stopOpacity="0.90" />
            <stop offset="60%"  stopColor="#f3d878" stopOpacity="0.70" />
            <stop offset="100%" stopColor="#ffe060" stopOpacity="0.00" />
          </linearGradient>
          {/* Ignition flare at the base */}
          <radialGradient id="lfe-ignite" cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="#d4af37" stopOpacity="0.75" />
            <stop offset="60%"  stopColor="#d4af37" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.00" />
          </radialGradient>
        </defs>

        {isFiring && (
          <>
            {/* Ignition base flare — brief ellipse at the circle bottom */}
            <motion.ellipse
              key={`${fireKey}-flare`}
              cx={88} cy={176} rx={52} ry={12}
              fill="url(#lfe-ignite)"
              style={{ transformOrigin: '88px 176px' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX:  [0, 1.3, 1.1, 0.7, 0],
                opacity: [0, 0.85, 0.55, 0.25, 0],
              }}
              transition={{
                duration: 0.75,
                times:    [0, 0.14, 0.35, 0.65, 1.0],
                ease:     'easeOut',
              }}
            />

            {/* Individual flame tongues */}
            {FLAME_DEFS.map((def, i) => {
              const isCenter  = i === 2;
              const pathD     = makeFlamePath(def.h, def.hw, def.lean);
              const gradient  = isCenter ? 'url(#lfe-grad-center)' : 'url(#lfe-grad-side)';

              return (
                // Outer <g>: static translate to position tongue on circle edge
                <g key={`${fireKey}-t${i}`} transform={`translate(${def.x}, ${def.y})`}>
                  {/* Inner motion.g: animated from base (0,0) upward */}
                  <motion.g
                    style={{ transformOrigin: '0px 0px' }}
                    initial={{
                      scaleY: 0, scaleX: 0.15, opacity: 0, skewX: 0,
                    }}
                    animate={{
                      // scaleY: burst up → flicker → fade
                      scaleY:  [0, 1.18, 1.02, 0.92, 0.75, 0.45, 0],
                      scaleX:  [0.15, 1.22, 1.0, 0.94, 0.82, 0.55, 0.1],
                      opacity: [
                        0,
                        def.maxOp,
                        def.maxOp,
                        def.maxOp * 0.88,
                        def.maxOp * 0.60,
                        def.maxOp * 0.25,
                        0,
                      ],
                      // Irregular horizontal flicker
                      skewX: [0, 2.5, -1.8, 1.2, -0.8, 0.4, 0],
                    }}
                    transition={{
                      delay:    def.delay / 1000,
                      duration: def.dur   / 1000,
                      times:    [0, 0.10, 0.28, 0.46, 0.64, 0.83, 1.0],
                      ease:     'easeInOut',
                    }}
                  >
                    {/* Main tongue */}
                    <path d={pathD} fill={gradient} />

                    {/* Center: add a brighter inner core */}
                    {isCenter && (
                      <path
                        d={makeFlamePath(def.h * 0.52, def.hw * 0.45, def.lean * 0.3)}
                        fill="url(#lfe-grad-center)"
                        opacity={0.55}
                      />
                    )}
                  </motion.g>
                </g>
              );
            })}
          </>
        )}
      </svg>

      {/* ── Ember spark canvas ────────────────────────────────────── */}
      {/* top:0 means canvas y=0 aligns with logo top;
          circle bottom is at y≈176 → canvas baseY=162 is correct      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0,
          left:          '50%',
          transform:     'translateX(-50%)',
          width:         CANVAS_W,
          height:        CANVAS_H,
          pointerEvents: 'none',
          zIndex:        25,
        }}
      />

      {/* ── Logo (unchanged) ────────────────────────────────────────── */}
      <motion.div
        animate={controls}
        initial={{ scale: 1, filter: 'drop-shadow(0 0 0px rgba(212,175,55,0))' }}
        style={{
          position: 'relative',
          zIndex:   10,
          width:    '100%',
          height:   '100%',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
