import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const BASE_SIZE = 20; // 20px base diameter matching 2021.refokus.com reference

/**
 * CustomCursor - Authentic Refokus 2021 Inverted Difference Cursor
 *
 * Implements the exact technique seen on https://2021.refokus.com/:
 * - Directly mounted to document.body with createPortal (zero parent stacking context isolation).
 * - Pure white circular lens with mix-blend-mode: difference.
 * - Outside the circle: website content remains normal (white text / dark background).
 * - Inside the circle: text and outline strokes invert to jet black on white.
 * - Outlined colors (e.g. purple/cyan) invert to high-contrast neon complements.
 * - Sleek, precise scale transitions (20px base, ~30px for nav links, ~44px for big editorial headlines).
 * - Smooth lerp interpolation via requestAnimationFrame (zero React state updates on mousemove).
 * - Automatically hidden on form inputs (restoring text cursor) and on mobile/touch screens.
 */
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only desktop devices with fine hover pointer
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isFinePointer) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    // Movement & lerp physics (zero React state updates on mousemove)
    const mouse = { x: -100, y: -100 };
    const cursorPos = { x: -100, y: -100 };
    let currentScale = 1;
    let targetScale = 1;

    let isVisible = false;
    let isMouseDown = false;
    let rafId = null;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursorEl.style.opacity = '1';
        cursorPos.x = mouse.x;
        cursorPos.y = mouse.y;
      }

      // Check target element underneath cursor
      const target = e.target;
      if (!target) return;

      const isInput = Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
      const isNav = Boolean(target.closest('nav a, [data-cursor="nav"], header a'));
      const isButton = Boolean(
        target.closest('button, [role="button"], [data-cursor="button"], input[type="submit"]')
      );
      const isCard = Boolean(target.closest('[data-cursor="card"], .group'));
      const isImage = Boolean(target.closest('img, [data-cursor="image"]'));
      const isHeading = Boolean(target.closest('h1, [data-cursor="text"], .font-editorial, .stroke-text'));

      if (isInput) {
        // Form input: shrink away so native text beam cursor is crisp
        targetScale = 0;
      } else if (isNav) {
        // Nav link (e.g. WORK, TEAM, ABOUT): 30px lens creates clean letter inversion
        targetScale = 1.5;
      } else if (isButton) {
        // Button pill (e.g. JOIN US): 34px lens
        targetScale = 1.7;
      } else if (isHeading) {
        // Large editorial headlines (BUILD. CREATE. SHARE.): 44px lens
        targetScale = 2.2;
      } else if (isCard) {
        // Project / team cards
        targetScale = 1.8;
      } else if (isImage) {
        targetScale = 1.8;
      } else {
        targetScale = isMouseDown ? 0.8 : 1.0;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      targetScale = targetScale * 0.82;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorEl) cursorEl.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (cursorEl) cursorEl.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Render loop
    const render = () => {
      if (isVisible && cursorEl) {
        // Smooth responsive interpolation
        cursorPos.x += (mouse.x - cursorPos.x) * 0.3;
        cursorPos.y += (mouse.y - cursorPos.y) * 0.3;

        currentScale += (targetScale - currentScale) * 0.22;

        const x = cursorPos.x - BASE_SIZE / 2;
        const y = cursorPos.y - BASE_SIZE / 2;

        cursorEl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;
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

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="refokus-cursor pointer-events-none select-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${BASE_SIZE}px`,
        height: `${BASE_SIZE}px`,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 999999,
        willChange: 'transform',
        opacity: 0,
        transition: 'opacity 0.2s ease',
      }}
    />,
    document.body
  );
};

export default CustomCursor;
