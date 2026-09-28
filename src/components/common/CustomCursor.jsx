import { useEffect, useRef } from 'react';

const BASE_LENS_SIZE = 56; // 56px diameter as requested (50-70px range)

/**
 * CustomCursor - Inverted Color Lens & Magnifying Interaction Mask
 *
 * Requirements fulfilled:
 * - Circular lens of 50-70px diameter.
 * - Center is transparent/subtle translucent so content remains visible through the circle.
 * - Content underneath the circle visually transforms into contrasting/accent cyan/purple.
 * - Outside the circle: website remains completely normal.
 * - Thin purple/cyan illuminated border with subtle electric glow.
 * - Smooth lerp tracking via requestAnimationFrame (no React state updates on mousemove).
 * - Only enabled on desktop with fine mouse pointer.
 * - Click feedback and smooth scale transitions over interactive elements.
 */
export const CustomCursor = () => {
  const lensRef = useRef(null);
  const glowRef = useRef(null);
  const dodgeRef = useRef(null);
  const dotRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    // Only desktop devices with fine hover pointer
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isFinePointer) return;

    const lensEl = lensRef.current;
    const glowEl = glowRef.current;
    const dodgeEl = dodgeRef.current;
    const dotEl = dotRef.current;
    const rippleEl = rippleRef.current;

    if (!lensEl) return;

    // Movement & lerp physics (zero React state updates)
    const mouse = { x: -100, y: -100 };
    const lensPos = { x: -100, y: -100 };
    let currentScale = 1;
    let targetScale = 1;

    let isVisible = false;
    let isMouseDown = false;
    let currentMode = 'normal'; // 'normal' | 'nav' | 'button' | 'card' | 'image' | 'heading'
    let rafId = null;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        lensEl.style.opacity = '1';
        lensPos.x = mouse.x;
        lensPos.y = mouse.y;
      }

      // Check target element underneath cursor
      const target = e.target;
      if (!target) return;

      const isNav = Boolean(target.closest('nav a, [data-cursor="nav"], header a'));
      const isButton = Boolean(
        target.closest('button, [role="button"], [data-cursor="button"], input[type="submit"]')
      );
      const isCard = Boolean(target.closest('[data-cursor="card"], .group'));
      const isImage = Boolean(target.closest('img, [data-cursor="image"]'));
      const isHeading = Boolean(target.closest('h1, [data-cursor="text"], .font-editorial'));

      if (isNav) {
        currentMode = 'nav';
        targetScale = 1.25; // ~70px
        lensEl.style.borderColor = 'rgba(56, 189, 248, 0.9)'; // Vivid cyan
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 24px rgba(56, 189, 248, 0.55), inset 0 0 16px rgba(168, 85, 247, 0.35)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.9';
      } else if (isButton) {
        currentMode = 'button';
        targetScale = 1.25; // ~70px
        lensEl.style.borderColor = 'rgba(168, 85, 247, 0.95)'; // Purple-cyan accent
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 26px rgba(168, 85, 247, 0.6), inset 0 0 16px rgba(56, 189, 248, 0.4)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.95';
      } else if (isCard) {
        currentMode = 'card';
        targetScale = 1.35; // ~76px
        lensEl.style.borderColor = 'rgba(168, 85, 247, 0.85)';
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 28px rgba(124, 58, 237, 0.5), inset 0 0 18px rgba(56, 189, 248, 0.3)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.85';
      } else if (isImage) {
        currentMode = 'image';
        targetScale = 1.32; // ~74px
        lensEl.style.borderColor = 'rgba(56, 189, 248, 0.85)';
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 24px rgba(56, 189, 248, 0.5), inset 0 0 16px rgba(168, 85, 247, 0.35)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.9';
      } else if (isHeading) {
        currentMode = 'heading';
        targetScale = 1.35; // ~76px
        lensEl.style.borderColor = 'rgba(56, 189, 248, 0.9)';
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 16px rgba(168, 85, 247, 0.3)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.95';
      } else {
        currentMode = 'normal';
        targetScale = isMouseDown ? 0.88 : 1.0;
        lensEl.style.borderColor = 'rgba(56, 189, 248, 0.65)';
        if (glowEl) {
          glowEl.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.15)';
        }
        if (dodgeEl) dodgeEl.style.opacity = '0.35';
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      targetScale = currentMode === 'normal' ? 0.85 : targetScale * 0.92;

      if (rippleEl) {
        rippleEl.style.left = `${mouse.x}px`;
        rippleEl.style.top = `${mouse.y}px`;
        rippleEl.classList.remove('animate-cursor-ripple');
        void rippleEl.offsetWidth; // Force reflow
        rippleEl.classList.add('animate-cursor-ripple');
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      targetScale = currentMode === 'normal' ? 1.0 : currentMode === 'card' || currentMode === 'heading' ? 1.35 : 1.25;
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (lensEl) lensEl.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (lensEl) lensEl.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Render loop
    const render = () => {
      if (isVisible && lensEl) {
        // Smooth responsive interpolation
        lensPos.x += (mouse.x - lensPos.x) * 0.22;
        lensPos.y += (mouse.y - lensPos.y) * 0.22;

        currentScale += (targetScale - currentScale) * 0.18;

        const lx = lensPos.x - BASE_LENS_SIZE / 2;
        const ly = lensPos.y - BASE_LENS_SIZE / 2;

        lensEl.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="custom-cursor-container fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none"
    >
      {/* =====================================================================
          OPTICAL COLOR LENS (50-70px diameter)
          - Transparent / subtle translucent center
          - Thin purple/cyan illuminated boundary
          - Internal color-dodge refraction core that inverts & accent-colors
            underlying text and images
          ===================================================================== */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 will-change-transform flex items-center justify-center custom-cursor-lens"
        style={{
          width: `${BASE_LENS_SIZE}px`,
          height: `${BASE_LENS_SIZE}px`,
          border: '1.5px solid rgba(56, 189, 248, 0.75)',
          background: 'rgba(124, 58, 237, 0.04)',
          transition: 'border-color 0.25s ease, opacity 0.2s ease',
        }}
      >
        {/* Glow halo layer */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
          style={{
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.15)',
          }}
        />

        {/* Color-Dodge Inverted Accent Core */}
        <div
          ref={dodgeRef}
          className="absolute inset-1 rounded-full pointer-events-none custom-cursor-dodge transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.9) 0%, rgba(168, 85, 247, 0.7) 65%, transparent 100%)',
            opacity: 0.35,
          }}
        />

        {/* Pinpoint center reticle dot */}
        <div
          ref={dotRef}
          className="relative w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#38bdf8] pointer-events-none"
        />
      </div>

      {/* Click shockwave ripple */}
      <div
        ref={rippleRef}
        className="fixed -top-4 -left-4 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none opacity-0 shadow-[0_0_12px_#38bdf8]"
      />
    </div>
  );
};

export default CustomCursor;
