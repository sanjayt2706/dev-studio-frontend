import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const JoinUs = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const btnRef = useRef(null);
  const labelRef = useRef(null);

  const headlineWords = ['Ready', 'To', 'Build?'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label
      gsap.fromTo(labelRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }
        }
      );

      // Each word slides up from below with stagger
      wordsRef.current.forEach((word, i) => {
        if (!word) return;
        gsap.fromTo(word,
          { y: '120%', rotationX: 20 },
          {
            y: '0%', rotationX: 0,
            duration: 1.2,
            delay: i * 0.12,
            ease: 'power4.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' }
          }
        );
      });

      // Button entrance
      gsap.fromTo(btnRef.current,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1, delay: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-primary overflow-hidden"
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Large watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] font-display font-black text-white/[0.04] leading-none pointer-events-none select-none">
        DS
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">
        <span
          ref={labelRef}
          className="text-xs font-mono tracking-[0.3em] text-white/50 uppercase mb-12 block opacity-0"
        >
          [ 05 / Join ]
        </span>

        {/* Headline with per-word reveal */}
        <h2
          className="mb-16 font-display font-black tracking-[-0.06em] text-white uppercase leading-[0.85]"
          style={{ perspective: '1000px' }}
        >
          {headlineWords.map((word, i) => (
            <div key={i} className="overflow-hidden inline-block">
              <span
                ref={el => wordsRef.current[i] = el}
                className="inline-block text-[16vw] md:text-[13vw] will-change-transform mr-[0.15em]"
              >
                {word}
              </span>
            </div>
          ))}
        </h2>

        <div ref={btnRef} className="opacity-0">
          <Link
            to="/join"
            data-cursor="button"
            className="group inline-flex items-center justify-center bg-black border border-white/20 text-white font-mono text-xs px-10 sm:px-12 py-5 rounded-full uppercase tracking-[0.2em] hover:bg-white hover:!text-black hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden shadow-2xl touch-manipulation cursor-pointer"
          >
            <span className="relative z-10 font-bold">Apply Now</span>
            <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300 relative z-10 font-bold">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
