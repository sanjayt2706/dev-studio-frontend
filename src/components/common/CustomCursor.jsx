import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import audioManager from '../../audio/AudioManager';

const BASE_SIZE = 20; // 20px base diameter matching 2021.refokus.com reference

/**
 * CustomCursor - Authentic Refokus 2021 Inverted Difference Cursor
 *
 * Implements the exact technique seen on https://2021.refokus.com/:
 * - Directly mounted to document.body via createPortal (no wrapper stacking context).
 * - Pure white circular lens with mix-blend-mode: difference.
 * - Outside the circle: website content remains normal (white text / dark background).
 * - Inside the circle: text and outline strokes invert to jet black on white.
 * - Outlined colors (e.g. purple/cyan) invert to high-contrast neon complements.
 * - Sleek, precise scale transitions (20px base, ~30px for nav links, ~44px for big editorial headlines).
 * - Smooth lerp interpolation via requestAnimationFrame (zero React state updates on mousemove).
 * - Integrated subtle SFX: plays one soft tick only when entering an interactive element.
 */
export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // If user interacts via touch, hide custom cursor and restore standard UI
    const onTouchStart = () => {
      document.documentElement.classList.remove('has-custom-cursor');
      if (cursorRef.current) {
        cursorRef.current.style.display = 'none';
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true, once: true });

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let currentScale = 1;
    let targetScale = 1;

    let isVisible = false;
    let isMouseDown = false;
    let rafId = null;
    let lastInteractiveEl = null;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        document.documentElement.classList.add('has-custom-cursor');
        cursorPos.x = mouse.x;
        cursorPos.y = mouse.y;
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '1';
        }
      }

      // Check target element underneath cursor
      const target = e.target;
      if (!target) return;

      const isInput = Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
      const navEl = target.closest('nav a, [data-cursor="nav"], header a');
      const btnEl = target.closest('button, [role="button"], [data-cursor="button"], input[type="submit"]');
      const cardEl = target.closest('[data-cursor="card"], .group');
      const imageEl = target.closest('img, [data-cursor="image"]');
      const headingEl = target.closest('h1, [data-cursor="text"], .font-editorial, .stroke-text');

      if (isInput) {
        targetScale = 0;
      } else if (navEl) {
        targetScale = 1.5; // ~30px: sharp inverted lens over WORK, TEAM, etc.
      } else if (btnEl) {
        targetScale = 1.7; // ~34px
      } else if (headingEl) {
        targetScale = 2.2; // ~44px: magnifying lens over BUILD, CREATE, SHARE
      } else if (cardEl || imageEl) {
        targetScale = 1.8; // ~36px
      } else {
        targetScale = isMouseDown ? 0.8 : 1.0; // 20px base dot
      }

      // SFX Audio: Only play once when cursor enters a NEW interactive element
      const currentInteractive = navEl || btnEl || cardEl || null;
      if (currentInteractive !== lastInteractiveEl) {
        if (currentInteractive) {
          if (navEl) {
            audioManager.play('nav-hover');
          } else if (btnEl) {
            audioManager.play('button-hover');
          } else if (cardEl) {
            audioManager.play('card-hover');
          }
        }
        lastInteractiveEl = currentInteractive;
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
      lastInteractiveEl = null;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };

    // Global tactile click sound for all interactive controls
    const onGlobalClick = (e) => {
      const isClickable = Boolean(
        e.target && e.target.closest && e.target.closest('button, a, [role="button"], input[type="submit"]')
      );
      if (isClickable) {
        audioManager.play('button-click');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('click', onGlobalClick, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Render loop
    const render = () => {
      const cursorEl = cursorRef.current;
      if (cursorEl && isVisible) {
        cursorPos.x += (mouse.x - cursorPos.x) * 0.32;
        cursorPos.y += (mouse.y - cursorPos.y) * 0.32;

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
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('click', onGlobalClick);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (typeof document === 'undefined') return null;

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
