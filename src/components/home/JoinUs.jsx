import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import audioManager from '../../audio/AudioManager';

gsap.registerPlugin(ScrollTrigger);

const JoinUs = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const btnRef = useRef(null);
  const labelRef = useRef(null);
  const watermarkRef = useRef(null);

  const headlineWords = ['Ready', 'To', 'Build?'];

  useEffect(() => {
    // Refresh ScrollTrigger after initial render to account for previous sections loading
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    const ctx = gsap.context(() => {
      const validWords = wordsRef.current.filter(Boolean);

      // Set explicit initial states via GSAP
      gsap.set(labelRef.current, { y: 25, opacity: 0 });
      gsap.set(validWords, { y: '110%', rotateX: 35, opacity: 0 });
      gsap.set(btnRef.current, { y: 35, opacity: 0, scale: 0.92 });
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { scale: 0.88, opacity: 0.02 });
      }

      // Master entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (watermarkRef.current) {
        tl.to(watermarkRef.current, {
          scale: 1,
          opacity: 0.05,
          duration: 1.3,
          ease: 'power2.out',
        }, 0);
      }

      tl.to(labelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, 0.05)
      .to(validWords, {
        y: '0%',
        rotateX: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      }, 0.15)
      .to(btnRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'back.out(1.8)',
      }, 0.45);

      // Subtle desktop mouse parallax for award-winning studio feel
      const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return;
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        if (watermarkRef.current) {
          gsap.to(watermarkRef.current, {
            x: x * 35,
            y: y * 25,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        if (validWords.length > 0) {
          gsap.to(validWords, {
            x: -x * 10,
            y: -y * 8,
            duration: 1,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const sectionEl = sectionRef.current;
      if (sectionEl) {
        sectionEl.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        if (sectionEl) {
          sectionEl.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }, sectionRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-primary overflow-hidden"
    >
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large watermark with mouse parallax */}
      <div
        ref={watermarkRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] font-display font-black text-white leading-none pointer-events-none select-none will-change-transform"
      >
        DS
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto text-center py-12">
        <span
          ref={labelRef}
          className="text-xs font-mono tracking-[0.3em] text-white/70 uppercase mb-8 md:mb-12 inline-flex items-center gap-2.5 will-change-transform"
        >
          <span>[ 05 / JOIN ]</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
        </span>

        {/* Headline with per-word 3D rolling reveal */}
        <h2
          className="mb-12 md:mb-16 font-display font-black tracking-[-0.06em] text-white uppercase leading-[0.85]"
          style={{ perspective: '1200px' }}
        >
          {headlineWords.map((word, i) => (
            <div key={i} className="overflow-hidden inline-block py-1 sm:py-2">
              <span
                ref={el => wordsRef.current[i] = el}
                className="join-word inline-block text-[16vw] md:text-[13vw] will-change-transform mr-[0.15em]"
              >
                {word}
              </span>
            </div>
          ))}
        </h2>

        <div ref={btnRef} className="will-change-transform">
          <Link
            to="/join"
            data-cursor="button"
            onMouseEnter={() => audioManager.play('button-hover')}
            onClick={() => audioManager.play('button-click')}
            className="group inline-flex items-center justify-center bg-black border border-white/20 text-white font-mono text-xs px-10 sm:px-14 py-5 rounded-full uppercase tracking-[0.2em] hover:bg-white hover:!text-black hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden shadow-2xl touch-manipulation cursor-pointer"
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
