import { useEffect, useRef } from 'react';

const BASE_SIZE = 42; // Base diameter matching Refokus 2021 reference

/**
 * CustomCursor - Award-Winning Refokus-Style Inverted Difference Cursor
 *
 * Implements the exact technique seen on https://2021.refokus.com/:
 * - Pure white circular lens with mix-blend-mode: difference.
 * - Outside the circle: website content remains normal (white text / dark background).
 * - Inside the circle: text and outline strokes invert to jet black on white.
 * - Smooth lerp interpolation via requestAnimationFrame (zero React state updates).
 * - Contextual expansion when hovering navigation, buttons, cards, and editorial typography.
 * - Automatically disabled on touchscreens / mobile devices.
 */
export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
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

      const isNav = Boolean(target.closest('nav a, [data-cursor="nav"], header a'));
      const isButton = Boolean(
        target.closest('button, [role="button"], [data-cursor="button"], input[type="submit"]')
      );
      const isCard = Boolean(target.closest('[data-cursor="card"], .group'));
      const isImage = Boolean(target.closest('img, [data-cursor="image"]'));
      const isHeading = Boolean(target.closest('h1, [data-cursor="text"], .font-editorial, .stroke-text'));

      if (isNav) {
        targetScale = 1.5; // ~63px
      } else if (isButton) {
        targetScale = 1.6; // ~67px
      } else if (isCard) {
        targetScale = 1.75; // ~73px
      } else if (isImage) {
        targetScale = 1.65; // ~69px
      } else if (isHeading) {
        targetScale = 1.7; // ~71px
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
        cursorPos.x += (mouse.x - cursorPos.x) * 0.24;
        cursorPos.y += (mouse.y - cursorPos.y) * 0.24;

        currentScale += (targetScale - currentScale) * 0.18;

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

  return (
    <div
      aria-hidden="true"
      className="custom-cursor-container fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none"
    >
      {/* =====================================================================
          REFOKUS TRUE INVERTED CURSOR
          - Pure white disc with mix-blend-mode: difference
          - Letters inside invert to jet-black; letters outside stay white
          ===================================================================== */}
      <div
        ref={cursorRef}
        className="refokus-cursor fixed top-0 left-0 rounded-full pointer-events-none opacity-0 will-change-transform"
        style={{
          width: `${BASE_SIZE}px`,
          height: `${BASE_SIZE}px`,
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
};

export default CustomCursor;
