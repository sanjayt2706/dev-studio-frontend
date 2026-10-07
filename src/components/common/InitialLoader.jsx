import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import projectsData from '../../data/projects';

/**
 * Preload an image URL into browser cache
 */
const preloadImage = (src) => {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.src = src;
    if (img.complete) {
      resolve(src);
    } else {
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src); // Do not block if single asset fails
    }
  });
};

/**
 * InitialLoader - Award-Winning Minimal Studio Preloader
 * Preloads all crucial landing assets (campus artwork, logos, project media, fonts)
 * before smoothly lifting the curtain into the experience.
 */
export const InitialLoader = ({ onComplete }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('PRELOADING ASSETS');

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) return;

    // Lock body scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isCancelled = false;

    // 1. Gather all critical images to preload before opening
    const criticalAssets = [
      '/assets/campus-hero.png',
      '/assets/logo.png',
      ...(Array.isArray(projectsData)
        ? projectsData.slice(0, 4).map((p) => p.coverImage).filter(Boolean)
        : []),
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length + 1; // +1 for fonts

    const updateProgressFromAssets = () => {
      if (isCancelled) return;
      loadedCount++;
      const targetPercent = Math.min(95, Math.round((loadedCount / totalAssets) * 90));
      gsap.to(counterObj, {
        val: targetPercent,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          setProgress(current);
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }
        },
      });
    };

    const counterObj = { val: 0 };

    // Initial smooth tick so user immediately sees activity
    gsap.to(counterObj, {
      val: 25,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        const current = Math.floor(counterObj.val);
        setProgress(current);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${current}%`;
        }
      },
    });

    // Start true parallel preloading of all images & fonts
    const imagePromises = criticalAssets.map((url) =>
      preloadImage(url).then(updateProgressFromAssets)
    );
    const fontPromise = (document.fonts ? document.fonts.ready : Promise.resolve()).then(
      updateProgressFromAssets
    );

    // Watchdog timer: ensure loader dismisses within 3.2s max even on slow mobile networks
    const fallbackTimeout = setTimeout(() => {
      finishLoading();
    }, 3200);

    const finishLoading = () => {
      if (isCancelled) return;
      clearTimeout(fallbackTimeout);
      setStatusText('EXPERIENCE READY');

      // Animate cleanly to 100%
      gsap.to(counterObj, {
        val: 100,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          setProgress(current);
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }
        },
        onComplete: () => {
          // Elegant minimal curtain lift
          const exitTl = gsap.timeline({
            onComplete: () => {
              document.body.style.overflow = originalOverflow;
              setShouldRender(false);
              if (onComplete) onComplete();
            },
          });

          exitTl.to(contentRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.35,
            ease: 'power3.in',
          })
          .to(containerRef.current, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 0.75,
            ease: 'expo.inOut',
          }, '-=0.1');
        },
      });
    };

    // When all assets are cached in memory, trigger finish
    Promise.all([...imagePromises, fontPromise]).then(() => {
      finishLoading();
    });

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <aside
      ref={containerRef}
      aria-label="Loading Dev Studio"
      aria-live="polite"
      className="fixed inset-0 z-[999999] bg-[#050608] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Top minimal chapter bar */}
      <div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/50 uppercase border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          <span>DEV STUDIO · MITE</span>
        </div>
        <span className="hidden sm:inline text-white/30">MANGALORE // 2026</span>
      </div>

      {/* Centerpiece: Clean, award-winning minimal typography & counter */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-xl mx-auto px-4"
      >
        <span className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-white/60 uppercase mb-4 sm:mb-6">
          [ {statusText} ]
        </span>

        {/* Tabular Numerals Counter */}
        <div className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-white tracking-tighter tabular-nums leading-none mb-6">
          {progress.toString().padStart(2, '0')}
          <span className="text-white/40 text-3xl sm:text-4xl md:text-5xl font-mono font-normal ml-1">
            %
          </span>
        </div>

        {/* Whisper-thin architectural progress line */}
        <div className="w-48 sm:w-64 max-w-xs h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            ref={progressBarRef}
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono text-[9px] sm:text-[10px] text-white/35 tracking-widest uppercase mt-4">
          CACHING HIGH-RESOLUTION MEDIA
        </p>
      </div>

      {/* Bottom minimal label */}
      <div className="relative z-10 flex justify-between items-center text-[9px] sm:text-[10px] font-mono tracking-widest text-white/40 uppercase border-t border-white/5 pt-4">
        <span>STUDENT ENGINEERING COLLECTIVE</span>
        <span>STANDBY</span>
      </div>
    </aside>
  );
};

export default InitialLoader;
