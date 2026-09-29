import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import teamData from '../../data/team';
import projectsData from '../../data/projects';
import eventsData from '../../data/events';
import { clubService } from '../../services/clubService';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef([]);
  const numbersRef = useRef([]);
  const headingRef = useRef(null);

  const [counts, setCounts] = useState({
    members: teamData.filter(m => m.active).length,
    projects: projectsData.length,
    events: eventsData.length,
  });

  useEffect(() => {
    Promise.all([
      clubService.getMembers(),
      clubService.getProjects(),
      clubService.getEvents(),
    ]).then(([m, p, e]) => {
      setCounts({
        members: m.filter(item => item.active !== undefined ? item.active : item.isActive).length,
        projects: p.length,
        events: e.length,
      });
    });
  }, []);

  const stats = [
    { label: 'Members', value: counts.members, suffix: '+' },
    { label: 'Projects', value: counts.projects, suffix: '+' },
    { label: 'Events', value: counts.events, suffix: '+' },
    { label: 'Years', value: 3, suffix: '' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      }

      // Stats counters reveal and number count-up
      stats.forEach((stat, i) => {
        const el = numbersRef.current[i];
        const container = statsRef.current[i];
        if (!el || !container) return;

        // Container fade in and slide up
        gsap.fromTo(container,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            }
          }
        );

        // Counter count-up
        const numObj = { val: 0 };
        gsap.to(numObj, {
          val: stat.value,
          duration: 1.8,
          delay: 0.2 + i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent = Math.round(numObj.val) + stat.suffix;
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [counts.members, counts.projects, counts.events]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36 bg-[#0B0D13] border-t border-white/5 px-6 md:px-12 overflow-hidden">
      {/* Background number watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-display font-black text-white/[0.02] leading-none pointer-events-none select-none">
        DS
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 md:mb-24">
          <span className="text-xs font-mono tracking-[0.25em] text-primary uppercase mb-4 block">
            [ METRICS // IMPACT ]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5vw] font-display font-black tracking-[-0.03em] text-white uppercase leading-tight">
            ENGINEERED IN <span className="stroke-text">NUMBERS</span><span className="text-primary">.</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => statsRef.current[i] = el}
              className="border-t border-white/10 pt-6 md:pt-8 bg-surface/30 p-6 rounded-lg backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <p
                ref={el => numbersRef.current[i] = el}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5vw] font-display font-black text-white mb-2 tabular-nums tracking-tight"
              >
                {stat.value}{stat.suffix}
              </p>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
