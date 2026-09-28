import { useEffect, useRef } from 'react';

const LENS_SIZE = 24; // 24px base diameter
const RING_SIZE = 40; // 40px base diameter

/**
 * CustomCursor - Premium Color-Sampling Lens Cursor
 * - Uses mix-blend-mode: difference for dynamic color inversion over any surface.
 * - Smooth lerp interpolation via requestAnimationFrame (no React state updates on mousemove).
 * - Subtle electric-purple trailing outer ring and click ripple.
 * - Contextual expansions on links, buttons, and images with "VIEW" badge.
 * - Automatically disabled on touch/mobile devices and when prefers-reduced-motion is active.
 */
export const CustomCursor = () => {
  const lensRef = useRef(null);
  const ringRef = useRef(null);
  const rippleRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // 1. Accessibility & Device Detection
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return; // Do not activate custom cursor on touch/mobile or reduced-motion
    }

    const lensEl = lensRef.current;
    const ringEl = ringRef.current;
    const rippleEl = rippleRef.current;
    const labelEl = labelRef.current;

    if (!lensEl || !ringEl) return;

    // 2. Physics & Transform State (zero React state updates)
    const mouse = { x: -100, y: -100 };
    const lensPos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };

    let currentScale = 1;
    let targetScale = 1;
    let currentRingScale = 1;
    let targetRingScale = 1;

    let isVisible = false;
    let isMouseDown = false;
    let currentMode = 'normal'; // 'normal' | 'link' | 'button' | 'image'
    let rafId = null;

    // 3. Mouse Event Listeners
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        lensEl.style.opacity = '1';
        ringEl.style.opacity = '1';
        lensPos.x = mouse.x;
        lensPos.y = mouse.y;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
      }

      // Detect interaction target underneath cursor
      const target = e.target;
      if (!target) return;

      const isButton = Boolean(
        target.closest('button, [role="button"], input[type="submit"], input[type="button"], .btn')
      );
      const isLink = Boolean(target.closest('a, [role="link"]') && !isButton);
      const isImage = Boolean(
        target.closest(
          'img, picture, [data-cursor="image"], .aspect-video, .aspect-\\[16\\/9\\], .aspect-\\[4\\/3\\], .aspect-\\[3\\/4\\], .aspect-square'
        )
      );

      if (isImage) {
        currentMode = 'image';
        targetScale = 2.4;
        targetRingScale = 1.7;
        if (labelEl) labelEl.style.opacity = '1';
      } else if (isButton) {
        currentMode = 'button';
        targetScale = 1.65;
        targetRingScale = 1.45;
        if (labelEl) labelEl.style.opacity = '0';
      } else if (isLink) {
        currentMode = 'link';
        targetScale = 1.35;
        targetRingScale = 1.25;
        if (labelEl) labelEl.style.opacity = '0';
      } else {
        currentMode = 'normal';
        targetScale = isMouseDown ? 0.8 : 1.0;
        targetRingScale = isMouseDown ? 0.85 : 1.0;
        if (labelEl) labelEl.style.opacity = '0';
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      targetScale = currentMode === 'image' ? 2.1 : currentMode === 'button' ? 1.4 : 0.8;
      targetRingScale = 0.85;

      // Trigger electric purple ripple effect
      if (rippleEl) {
        rippleEl.style.left = `${mouse.x}px`;
        rippleEl.style.top = `${mouse.y}px`;
        rippleEl.classList.remove('animate-cursor-ripple');
        // Force reflow to replay animation
        void rippleEl.offsetWidth;
        rippleEl.classList.add('animate-cursor-ripple');
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      if (currentMode === 'image') {
        targetScale = 2.4;
        targetRingScale = 1.7;
      } else if (currentMode === 'button') {
        targetScale = 1.65;
        targetRingScale = 1.45;
      } else if (currentMode === 'link') {
        targetScale = 1.35;
        targetRingScale = 1.25;
      } else {
        targetScale = 1.0;
        targetRingScale = 1.0;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      lensEl.style.opacity = '0';
      ringEl.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      lensEl.style.opacity = '1';
      ringEl.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // 4. Smooth Animation Loop (Lerp + GPU Transforms)
    const render = () => {
      if (isVisible) {
        // Fast responsive tracking for color lens
        lensPos.x += (mouse.x - lensPos.x) * 0.28;
        lensPos.y += (mouse.y - lensPos.y) * 0.28;

        // Fluid trailing outer ring
        ringPos.x += (mouse.x - ringPos.x) * 0.13;
        ringPos.y += (mouse.y - ringPos.y) * 0.13;

        // Scale interpolation
        currentScale += (targetScale - currentScale) * 0.2;
        currentRingScale += (targetRingScale - currentRingScale) * 0.16;

        // Apply transforms using 3D hardware acceleration
        const lx = lensPos.x - LENS_SIZE / 2;
        const ly = lensPos.y - LENS_SIZE / 2;
        lensEl.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;

        const rx = ringPos.x - RING_SIZE / 2;
        const ry = ringPos.y - RING_SIZE / 2;
        ringEl.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) scale(${currentRingScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // 5. Cleanup
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
      className="fixed inset-0 pointer-events-none z-[999998] overflow-hidden"
    >
      {/* -------------------------------------------------------------------
          1. Dynamic Color-Sampling Lens (mix-blend-mode: difference)
          ------------------------------------------------------------------- */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-white custom-cursor-lens border border-purple-400/40 opacity-0 pointer-events-none will-change-transform flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.35)]"
        style={{
          width: `${LENS_SIZE}px`,
          height: `${LENS_SIZE}px`,
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Contextual Image Label (Inverts cleanly through difference blend) */}
        <span
          ref={labelRef}
          className="font-mono text-[6.5px] font-black tracking-widest text-black uppercase opacity-0 transition-opacity duration-200 select-none"
        >
          VIEW
        </span>
      </div>

      {/* -------------------------------------------------------------------
          2. Trailing Outer Ring (Electric Purple Glow)
          ------------------------------------------------------------------- */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-purple-500/35 pointer-events-none opacity-0 will-change-transform shadow-[0_0_12px_rgba(124,58,237,0.25)]"
        style={{
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Subtle decorative dot on the ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
      </div>

      {/* -------------------------------------------------------------------
          3. Click Purple Shockwave Ripple
          ------------------------------------------------------------------- */}
      <div
        ref={rippleRef}
        className="fixed -top-3.5 -left-3.5 w-7 h-7 rounded-full border border-purple-400 pointer-events-none opacity-0 shadow-[0_0_10px_#a855f7]"
      />
    </div>
  );
};

export default CustomCursor;
