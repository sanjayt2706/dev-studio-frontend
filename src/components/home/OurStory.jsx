import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurStory = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const labelRef = useRef(null);
  const lineRef = useRef(null);

  const storyText = "We don't just learn code. We create, experiment, and push boundaries. A collective of developers, designers, and innovators building the future of tech at MITE.";
  const words = storyText.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label entrance
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      // Decorative line grows
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }
        }
      );

      // Pin the section and reveal words progressively as user scrolls
      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        }
      });

      // Each word goes from dim to bright as scroll progresses
      wordsRef.current.forEach((word, i) => {
        if (!word) return;
        const startPos = i / words.length;
        const endPos = (i + 1) / words.length;

        pinnedTl.fromTo(word,
          { opacity: 0.2, y: 6 },
          { opacity: 1, y: 0, duration: endPos - startPos, ease: 'none' },
          startPos
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-12 bg-background">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/5"></div>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        {/* Left label */}
        <div className="md:col-span-3 flex flex-col justify-start pt-4">
          <span ref={labelRef} className="text-xs font-mono tracking-[0.25em] text-primary uppercase mb-6 block opacity-0">
            [ 01 / Story ]
          </span>
          <div ref={lineRef} className="h-px bg-primary/30 origin-left" style={{ transform: 'scaleX(0)' }}></div>
        </div>

        {/* Right — story text */}
        <div className="md:col-span-9">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] font-display font-bold leading-[1.2] tracking-tight text-white">
            {words.map((word, i) => (
              <span
                key={i}
                ref={el => wordsRef.current[i] = el}
                className="inline-block mr-[0.35em] opacity-[0.12] will-change-[opacity,transform]"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
