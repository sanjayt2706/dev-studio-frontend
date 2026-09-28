import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const imageRef = useRef(null);
  const gridRef = useRef(null);
  const arcRef = useRef(null);
  const techMarkersRef = useRef(null);
  const eyebrowRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const metaRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial entrance animation
      const entranceTl = gsap.timeline({ delay: 0.05 });

      if (imageRef.current) {
        entranceTl.fromTo(
          imageRef.current,
          { scale: 1.05, filter: 'brightness(0.9)' },
          { scale: 1, filter: 'brightness(1)', duration: 1.2, ease: 'power2.out', clearProps: 'scale,filter' }
        );
      }

      const topMeta = [eyebrowRef.current, metaRightRef.current].filter(Boolean);
      if (topMeta.length > 0) {
        entranceTl.fromTo(
          topMeta,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          '-=0.8'
        );
      }

      const words = [word1Ref.current, word2Ref.current, word3Ref.current].filter(Boolean);
      if (words.length > 0) {
        entranceTl.fromTo(
          words,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
          '-=0.7'
        );
      }

      const bottomMeta = [subtextRef.current, ctaRef.current, scrollIndicatorRef.current].filter(Boolean);
      if (bottomMeta.length > 0) {
        entranceTl.fromTo(
          bottomMeta,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          '-=0.5'
        );
      }

      const decor = [gridRef.current, arcRef.current, techMarkersRef.current].filter(Boolean);
      if (decor.length > 0) {
        entranceTl.fromTo(
          decor,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' },
          '-=0.8'
        );
      }

      // 2. Cinematic Scroll-Driven Parallax Scrub (Restored from the beginning)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=140%',
          pin: pinTargetRef.current,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Layer 1: Campus image cinematic zoom
      if (imageRef.current) {
        scrollTl.to(imageRef.current, {
          scale: 1.10,
          y: '2%',
          ease: 'none',
          duration: 1,
        }, 0);
      }

      // Layer 3: Sky arc and grid parallax
      if (arcRef.current) {
        scrollTl.to(arcRef.current, {
          y: '-25%',
          scale: 1.04,
          opacity: 0.15,
          ease: 'none',
          duration: 1,
        }, 0);
      }

      if (gridRef.current) {
        scrollTl.to(gridRef.current, {
          y: '-12%',
          opacity: 0.1,
          ease: 'none',
          duration: 1,
        }, 0);
      }

      // Layer 4: Tech markers parallax
      if (techMarkersRef.current) {
        scrollTl.to(techMarkersRef.current, {
          y: '-20%',
          opacity: 0.2,
          ease: 'none',
          duration: 0.8,
        }, 0.1);
      }

      // Layer 5: Words staggered parallax
      if (word1Ref.current) {
        scrollTl.to(word1Ref.current, {
          y: '-80px',
          ease: 'none',
          duration: 1,
        }, 0);
        scrollTl.to(word1Ref.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        }, 0.65);
      }

      if (word2Ref.current) {
        scrollTl.to(word2Ref.current, {
          y: '-60px',
          ease: 'none',
          duration: 1,
        }, 0);
        scrollTl.to(word2Ref.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        }, 0.68);
      }

      if (word3Ref.current) {
        scrollTl.to(word3Ref.current, {
          y: '-40px',
          ease: 'none',
          duration: 1,
        }, 0);
        scrollTl.to(word3Ref.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        }, 0.72);
      }

      // Layer 6: Eyebrow and metadata float up and fade
      if (topMeta.length > 0) {
        scrollTl.to(topMeta, {
          y: '-40px',
          opacity: 0,
          duration: 0.4,
          ease: 'none',
        }, 0.2);
      }

      if (subtextRef.current && ctaRef.current) {
        scrollTl.to([subtextRef.current, ctaRef.current], {
          y: '-30px',
          opacity: 0,
          duration: 0.45,
          ease: 'none',
        }, 0.45);
      }

      // Scroll indicator fades out immediately on first scroll
      if (scrollIndicatorRef.current) {
        scrollTl.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 15,
          duration: 0.15,
          ease: 'none',
        }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full border-none outline-none">
      <div
        ref={pinTargetRef}
        className="relative w-full h-screen overflow-hidden bg-[#06070B] flex flex-col justify-between border-none outline-none"
      >
        {/* =========================================================================
            LAYER 1: CAMPUS BACKGROUND IMAGE
            ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <img
            ref={imageRef}
            src="/assets/campus-hero.png"
            alt="Dev Studio MITE Campus Artwork"
            className="w-full h-full object-cover object-[center_36%] sm:object-[center_38%] md:object-center select-none will-change-transform"
            loading="eager"
          />
        </div>

        {/* =========================================================================
            LAYER 2: AMBIENT VIGNETTE & DUSK ATMOSPHERE
            ========================================================================= */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `
              radial-gradient(ellipse 95% 75% at 50% 50%, rgba(6, 7, 11, 0.25) 0%, rgba(6, 7, 11, 0.75) 100%),
              linear-gradient(to bottom, rgba(6, 7, 11, 0.85) 0%, rgba(6, 7, 11, 0.2) 30%, rgba(6, 7, 11, 0.25) 65%, rgba(6, 7, 11, 0.95) 100%)
            `,
          }}
        />

        {/* Atmospheric violet glow in the sky */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] rounded-full pointer-events-none blur-[90px] opacity-45 z-[1]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.4) 0%, rgba(56, 189, 248, 0.12) 60%, transparent 80%)',
          }}
        />

        {/* Translucent purple pillar accents in sky */}
        <div className="absolute top-8 left-[15vw] w-24 md:w-36 h-48 md:h-64 bg-gradient-to-b from-purple-500/15 to-transparent border-t border-purple-400/25 pointer-events-none blur-[1px] hidden sm:block z-[1]" />
        <div className="absolute top-6 right-[18vw] w-28 md:w-44 h-56 md:h-72 bg-gradient-to-b from-purple-600/15 to-transparent border-t border-purple-400/25 pointer-events-none blur-[1px] hidden sm:block z-[1]" />

        {/* =========================================================================
            LAYER 3: TECHNICAL GRID & SIGNATURE ORBITAL ARC
            ========================================================================= */}
        <div ref={gridRef} className="absolute inset-0 pointer-events-none z-[2]">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Orbital Trajectory Arc in Sky */}
          <div
            ref={arcRef}
            className="absolute -top-[28vw] left-1/2 -translate-x-1/2 w-[85vw] h-[85vw] max-w-[1250px] max-h-[1250px] rounded-full border border-purple-400/25 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 80%)',
            }}
          />
        </div>

        {/* =========================================================================
            LAYER 4: GEOMETRIC MARKERS & HUD DATA
            ========================================================================= */}
        <div ref={techMarkersRef} className="absolute inset-0 pointer-events-none z-[3]">
          {/* Top-Left Dotted Matrix */}
          <div className="absolute top-20 left-6 md:left-14 hidden sm:grid grid-cols-6 gap-2 opacity-40">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={`dot-l-${i}`} className="w-1 h-1 rounded-full bg-white/70" />
            ))}
          </div>

          {/* Top-Right Dotted Matrix */}
          <div className="absolute top-20 right-6 md:right-14 hidden sm:grid grid-cols-6 gap-2 opacity-40">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={`dot-r-${i}`} className="w-1 h-1 rounded-full bg-purple-300/70" />
            ))}
          </div>

          {/* Coordinates */}
          <div className="absolute top-[26%] left-6 md:left-14 font-mono text-[10px] text-white/40 tracking-widest hidden md:block">
            <span className="text-primary">+</span> 13.1250° N
          </div>
          <div className="absolute top-[26%] right-6 md:right-14 font-mono text-[10px] text-white/40 tracking-widest hidden md:block text-right">
            74.9820° E <span className="text-purple-400">+</span>
          </div>

          {/* Corner Brackets */}
          <div className="absolute top-20 left-4 md:left-8 w-3 h-3 border-t-2 border-l-2 border-white/25" />
          <div className="absolute top-20 right-4 md:right-8 w-3 h-3 border-t-2 border-r-2 border-white/25" />
          <div className="absolute bottom-12 left-4 md:left-8 w-3 h-3 border-b-2 border-l-2 border-white/25" />
          <div className="absolute bottom-12 right-4 md:right-8 w-3 h-3 border-b-2 border-r-2 border-white/25" />
        </div>

        {/* =========================================================================
            LAYER 5 & 6: EDITORIAL TYPOGRAPHY & INTERACTIVE CALLS
            ========================================================================= */}
        <div className="relative z-10 w-full h-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-14 flex flex-col justify-between pt-20 sm:pt-24 md:pt-26 pb-8 sm:pb-10 md:pb-12 pointer-events-auto">
          {/* Top Eyebrow Row */}
          <div className="flex justify-between items-start w-full">
            <div ref={eyebrowRef} className="flex flex-col gap-1 will-change-transform">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs md:text-sm font-bold tracking-[0.25em] text-white uppercase drop-shadow">
                  DEV STUDIO
                </span>
              </div>
              <span className="font-mono text-[10px] md:text-xs tracking-[0.18em] text-white/70 uppercase">
                MITE • STUDENT TECHNOLOGY COMMUNITY
              </span>
            </div>

            <div ref={metaRightRef} className="hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest text-white/60 will-change-transform">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>SYS_ACTIVE // 2026 EDITION</span>
              </div>
              <span className="text-white/40 uppercase">[ 01 / LAB ] • MANGALORE</span>
            </div>
          </div>

          {/* Central Display Headline: BUILD. CREATE. SHARE. */}
          <div className="my-auto py-2">
            <h1 className="flex flex-col font-editorial font-black tracking-tight text-white uppercase leading-[0.88] select-none text-[15vw] sm:text-[13vw] md:text-[9.5vw] lg:text-[8vw] drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]">
              <span ref={word1Ref} className="block will-change-transform text-white">
                BUILD<span className="text-primary">.</span>
              </span>
              <span ref={word2Ref} className="block will-change-transform text-white pl-3 sm:pl-8 md:pl-12">
                CREATE<span className="text-purple-400">.</span>
              </span>
              <span ref={word3Ref} className="block will-change-transform text-white pl-6 sm:pl-16 md:pl-24">
                SHARE<span className="text-sky-400">.</span>
              </span>
            </h1>
          </div>

          {/* Bottom Supporting Info & Interactive CTAs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 w-full">
            <div ref={subtextRef} className="max-w-lg will-change-transform">
              <p className="font-sans text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed font-normal drop-shadow">
                A student-led technology community where ideas become projects, skills become experience, and people build together.
              </p>
              <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                <span>ENGINEERING</span>
                <span>•</span>
                <span>DESIGN</span>
                <span>•</span>
                <span>OPEN SOURCE</span>
              </div>
            </div>

            <div ref={ctaRef} className="flex items-center gap-3 sm:gap-4 will-change-transform">
              <Link
                to="/join"
                data-cursor="button"
                className="group relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-[0.18em] font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-primary hover:text-white hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl shadow-black/60 touch-manipulation"
              >
                <span>Join Studio</span>
                <span className="w-5 h-5 rounded-full bg-black/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>

              <Link
                to="/work"
                data-cursor="button"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/20 hover:border-cyan-400/80 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:scale-[1.03] active:scale-[0.97] text-white font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 bg-black/40 backdrop-blur-md touch-manipulation"
              >
                <span>Explore Work</span>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER 7: MINIMAL SCROLL INDICATOR
            ========================================================================= */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none will-change-transform"
        >
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/50 drop-shadow">
            SCROLL TO EXPLORE
          </span>
          <div className="w-4 h-4 rounded-full border border-white/25 flex items-center justify-center text-white/70 animate-bounce">
            <ArrowDown size={9} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
