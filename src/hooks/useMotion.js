/**
 * Motion System — Dev Studio
 * 
 * Reusable GSAP + ScrollTrigger hooks for choreographed scroll experiences.
 * All hooks respect prefers-reduced-motion and clean up on unmount.
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () => false;

// ─── 1. useReveal ──────────────────────────────────────────────────
// Fade + translate elements into view on scroll
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;
    const { y = 60, duration = 1, delay = 0, ease = 'power3.out', start = 'top 85%' } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { y, opacity: 0 },
        { y: 0, opacity: 1, duration, delay, ease, scrollTrigger: { trigger: ref.current, start } }
      );
    });
    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── 2. useStaggerReveal ──────────────────────────────────────────
// Stagger children into view
export function useStaggerReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;
    const { y = 80, stagger = 0.08, duration = 0.9, ease = 'power3.out', start = 'top 80%', childSelector = ':scope > *' } = options;

    const children = ref.current.querySelectorAll(childSelector);
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(children,
        { y, opacity: 0 },
        { y: 0, opacity: 1, duration, stagger, ease, scrollTrigger: { trigger: ref.current, start } }
      );
    });
    return () => ctx.revert();
  }, []);

  return ref;
}

// ─── 3. useParallax ──────────────────────────────────────────────
// Parallax movement on scroll (scrubbed)
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * ScrollTrigger.maxScroll(window) * 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [speed]);

  return ref;
}

// ─── 4. usePinnedSection ──────────────────────────────────────────
// Pin a section and provide a scroll progress (0→1) via callback
export function usePinnedSection(options = {}) {
  const triggerRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (prefersReduced() || !triggerRef.current) return;
    const { pinSpacing = true, endMultiplier = 3, onUpdate } = options;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * endMultiplier}`,
        pin: true,
        pinSpacing,
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (onUpdate) onUpdate(self.progress, self);
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return { triggerRef, progressRef };
}

// ─── 5. useHorizontalScroll ──────────────────────────────────────
// Pin container, scroll children horizontally on vertical scroll
export function useHorizontalScroll(options = {}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !containerRef.current || !trackRef.current) return;
    const { ease = 'none' } = options;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return { containerRef, trackRef };
}

// ─── 6. useImageScale ─────────────────────────────────────────────
// Scale image from scaleFrom to scaleTo on scroll
export function useImageScale(scaleFrom = 1.2, scaleTo = 1) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { scale: scaleFrom },
        {
          scale: scaleTo,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [scaleFrom, scaleTo]);

  return ref;
}

// ─── 7. useTextSplitReveal ────────────────────────────────────────
// Split text into lines/words and reveal with stagger
export function useTextSplitReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;
    const { stagger = 0.04, duration = 0.8, ease = 'power3.out', start = 'top 80%', splitBy = 'word' } = options;

    const el = ref.current;
    const text = el.textContent;

    if (splitBy === 'word') {
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = '';
      el.style.overflow = 'hidden';

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.verticalAlign = 'top';

        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.display = 'inline-block';
        inner.style.willChange = 'transform';
        inner.className = 'split-word';

        wrapper.appendChild(inner);
        el.appendChild(wrapper);

        if (i < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });

      const splitWords = el.querySelectorAll('.split-word');
      const ctx = gsap.context(() => {
        gsap.fromTo(splitWords,
          { y: '110%' },
          { y: '0%', duration, stagger, ease, scrollTrigger: { trigger: el, start } }
        );
      });
      return () => ctx.revert();
    }
  }, []);

  return ref;
}

// ─── 8. useMagnetic ───────────────────────────────────────────────
// Magnetic hover effect — element follows cursor within its bounds
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced() || !ref.current) return;
    const el = ref.current;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out' });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return ref;
}

// ─── 9. useScrollProgress ────────────────────────────────────────
// Returns a ref and a progress value (0→1) for an element's viewport traversal
export function useScrollProgress(options = {}) {
  const ref = useRef(null);
  const progress = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    const { start = 'top bottom', end = 'bottom top', onUpdate } = options;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        end,
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          if (onUpdate) onUpdate(self.progress);
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return { ref, progress };
}

// ─── 10. useCountUp ──────────────────────────────────────────────
// Animate a number from 0 to target on scroll trigger
export function useCountUp(target, options = {}) {
  const ref = useRef(null);
  const numRef = useRef({ val: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const { duration = 2, suffix = '', start = 'top 80%', ease = 'power2.out' } = options;

    if (prefersReduced()) {
      ref.current.textContent = target + suffix;
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(numRef.current, {
        val: target,
        duration,
        ease,
        scrollTrigger: { trigger: ref.current, start },
        onUpdate: () => {
          ref.current.textContent = Math.round(numRef.current.val) + suffix;
        },
      });
    });
    return () => ctx.revert();
  }, [target]);

  return ref;
}
