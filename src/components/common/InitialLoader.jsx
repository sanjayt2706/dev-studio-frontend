import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * InitialLoader - Award-winning full-screen cinematic intro
 * Runs smoothly on website launch & page refresh.
 */
export const InitialLoader = ({ onComplete }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef(null);
  const campusRef = useRef(null);
  const glowOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const gridRef = useRef(null);
  const scanlineRef = useRef(null);
  const textContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) return;

    // Lock body scroll while intro is playing
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Watchdog fallback: ensure page is never locked
    const watchdogTimer = setTimeout(() => {
      hasInitialLoaderPlayed = true;
      document.body.style.overflow = originalOverflow;
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 4500);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(watchdogTimer);
          hasInitialLoaderPlayed = true;
          document.body.style.overflow = originalOverflow;
          setShouldRender(false);
          if (onComplete) onComplete();
        },
      });

      // Target duration: ~1.8 - 2.2 seconds total

      // 1. Initial State Setup
      gsap.set(containerRef.current, { autoAlpha: 1 });
      gsap.set(logoRef.current, { scale: 0.85, opacity: 0 });
      gsap.set(gridRef.current, { opacity: 0 });
      gsap.set(hudRef.current, { opacity: 0 });
      gsap.set(campusRef.current, {
        opacity: 0,
        filter: 'blur(30px) brightness(0.15)',
        scale: 1.08,
      });
      gsap.set(glowOverlayRef.current, { opacity: 0.1 });

      // 2. Dev Studio </> logo appears with purple glow
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power3.out',
      }, 0.05);

      // 3. Technical grid & HUD fade in
      tl.to([gridRef.current, hudRef.current], {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, 0.2);

      // 4. Scanline sweeps smoothly across screen
      if (scanlineRef.current) {
        tl.fromTo(
          scanlineRef.current,
          { top: '-10%', opacity: 0 },
          {
            top: '110%',
            opacity: 1,
            duration: 1.1,
            ease: 'power1.inOut',
          },
          0.25
        );
      }

      // 5. DEV STUDIO and INITIALIZING EXPERIENCE text reveal
      tl.to(textContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      }, 0.3);

      // 6. Percentage counter animation: 0 -> 100
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          setProgress(current);
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }
        },
      }, 0.25);

      // 7, 8, 9. Nighttime campus artwork gradually clarifies from dark/blurred + subtle purple glow
      tl.to(campusRef.current, {
        opacity: 0.42,
        filter: 'blur(0px) brightness(0.7) saturate(1.15)',
        scale: 1,
        duration: 1.25,
        ease: 'power2.out',
      }, 0.35);

      tl.to(glowOverlayRef.current, {
        opacity: 0.6,
        duration: 1.1,
        ease: 'power2.out',
      }, 0.35);

      // 10. At 100%: Briefly intensify the electric purple glow
      tl.to(glowOverlayRef.current, {
        opacity: 1,
        duration: 0.18,
        ease: 'power2.in',
      }, '+=0.05');

      tl.to(logoRef.current, {
        scale: 1.06,
        filter: 'drop-shadow(0 0 35px #a855f7)',
        duration: 0.18,
        ease: 'power2.in',
      }, '<');

      // 11. Smooth vertical / clip-path reveal curtain transition
      tl.to(containerRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.6,
        ease: 'power4.inOut',
      }, '+=0.04');
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <aside
      ref={containerRef}
      aria-label="Loading Dev Studio Experience"
      aria-live="polite"
      className="fixed inset-0 z-[999999] bg-[#050508] text-white overflow-hidden flex flex-col justify-between p-6 md:p-12 select-none"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* -------------------------------------------------------------------------
          LAYER 1: NIGHTTIME CAMPUS VISUAL (Blurred -> Revealed)
          ------------------------------------------------------------------------- */}
      <div
        ref={campusRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/campus-hero.png)',
        }}
      />

      {/* Atmospheric vignette & purple glow aura around campus */}
      <div
        ref={glowOverlayRef}
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(124, 58, 237, 0.28) 0%, rgba(5, 5, 8, 0.7) 65%, #050508 100%),
            linear-gradient(to bottom, #050508 0%, transparent 25%, transparent 75%, #050508 100%)
          `,
        }}
      />

      {/* -------------------------------------------------------------------------
          LAYER 2: TECHNICAL GRID & SCANLINE SWEEP
          ------------------------------------------------------------------------- */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none z-[2] opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(124, 58, 237, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124, 58, 237, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Sweeping Purple Scanline */}
      <div
        ref={scanlineRef}
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.3) 20%, #a855f7 50%, rgba(124, 58, 237, 0.3) 80%, transparent 100%)',
          boxShadow: '0 0 16px 2px rgba(168, 85, 247, 0.75)',
        }}
      />

      {/* -------------------------------------------------------------------------
          LAYER 3: TECHNICAL HUD DATA & CORNER BRACKETS
          ------------------------------------------------------------------------- */}
      <div ref={hudRef} className="relative z-10 flex justify-between items-center text-[10px] font-mono tracking-widest text-purple-300/70 uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse" />
          <span>SYS_BOOT // CLUSTER.MITE.ONLINE</span>
        </div>
        <div className="hidden sm:block text-right text-gray-500">
          COORD: 13.0674° N, 74.9818° E
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          LAYER 4: CENTERPIECE (Dev Studio </> Logo, Typography, Progress)
          ------------------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-xl mx-auto px-4">
        {/* Dev Studio </> Cyber Logo */}
        <div
          ref={logoRef}
          className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-black/60 border border-purple-500/40 backdrop-blur-md flex items-center justify-center mb-8 shadow-[0_0_35px_rgba(124,58,237,0.35)]"
        >
          {/* Subtle corner tech notches */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-purple-400" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-purple-400" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-purple-400" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-purple-400" />

          {/* Glowing symbol */}
          <div className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter">
            &lt;<span className="text-purple-400 drop-shadow-[0_0_12px_#a855f7]">/</span>&gt;
          </div>
        </div>

        {/* Header Text */}
        <div ref={textContainerRef} className="opacity-0 translate-y-3 space-y-2 mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-widest text-white uppercase">
            DEV <span className="text-purple-400">STUDIO</span>
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-purple-300/80 uppercase">
            INITIALIZING EXPERIENCE
          </p>
        </div>

        {/* Percentage Counter (0 - 100) */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <div className="font-mono font-bold text-3xl md:text-4xl text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {progress.toString().padStart(2, '0')}
            <span className="text-purple-400 text-lg md:text-xl font-normal ml-1">%</span>
          </div>

          {/* Cyber Progress Line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-white shadow-[0_0_12px_#a855f7] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          LAYER 5: FOOTER TELEMETRY
          ------------------------------------------------------------------------- */}
      <div className="relative z-10 flex justify-between items-center text-[10px] font-mono tracking-widest text-gray-500 uppercase">
        <span>MEM_ALLOC: 100% OK</span>
        <span className="text-purple-400/80">DEVSTUDIO_V2 // MITE</span>
      </div>
    </aside>
  );
};

export default InitialLoader;
