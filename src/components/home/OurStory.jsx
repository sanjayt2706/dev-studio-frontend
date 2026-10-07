import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurStory = () => {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const lineRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean, unpinned entrance timeline as section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Label and accent line reveal
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
        '-=0.4'
      )
      // Smooth headline entrance with zero step-by-step jumpiness
      .fromTo(
        headlineRef.current?.querySelectorAll('.story-line'),
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      // Supporting paragraph fade
      .fromTo(
        subtextRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-14 bg-[#07080D] border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">
        {/* Left column: clean minimal studio label */}
        <div className="lg:col-span-3 flex flex-col justify-start">
          <div ref={labelRef} className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono tracking-[0.25em] text-white/70 uppercase">
              [ 01 / STORY ]
            </span>
          </div>
          <div
            ref={lineRef}
            className="h-px bg-white/10 origin-left w-full max-w-[140px]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Right column: fluid, editorial story statement */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          <div
            ref={headlineRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.2vw] font-display font-bold leading-[1.2] tracking-tight text-white"
          >
            <p className="story-line">
              We don’t just learn code.
            </p>
            <p className="story-line text-zinc-300 mt-2 sm:mt-3">
              We create, experiment, and <span className="text-white underline decoration-primary/40 decoration-2 underline-offset-8">push boundaries</span>.
            </p>
          </div>

          <div ref={subtextRef} className="max-w-2xl border-l border-white/10 pl-5 sm:pl-6 mt-2">
            <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed font-normal">
              A student-led collective of developers, designers, and systems architects building open technology at MITE Mangalore. From production web applications to AI tools, we bridge the gap between classroom theory and industry-grade engineering.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 font-mono text-[10px] sm:text-xs text-white/50 tracking-widest uppercase">
              <span>01. SHIP CODE</span>
              <span>·</span>
              <span>02. BUILD PORTFOLIOS</span>
              <span>·</span>
              <span>03. GROW LEADERS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
