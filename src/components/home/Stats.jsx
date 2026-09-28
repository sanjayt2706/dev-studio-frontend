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
      // Heading reveal with word split
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
          }
        );
      }

      // Pin section and animate stats sequentially
      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: '+=250%',
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
        }
      });

      // Each stat animates in sequence
      stats.forEach((stat, i) => {
        const el = numbersRef.current[i];
        const container = statsRef.current[i];
        if (!el || !container) return;

        const numObj = { val: 0 };
        const startPos = i * 0.22;

        // Container fades in and slides up
        pinnedTl.fromTo(container,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
          startPos
        );

        // Number counts up
        pinnedTl.to(numObj, {
          val: stat.value,
          duration: 0.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(numObj.val) + stat.suffix;
          }
        }, startPos + 0.02);

        // Previous stat dims (except last)
        if (i > 0) {
          pinnedTl.to(statsRef.current[i - 1], {
            opacity: 0.25, duration: 0.1
          }, startPos);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center bg-surface px-6 md:px-12 overflow-hidden">
      {/* Background number watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-display font-black text-white/[0.02] leading-none pointer-events-none select-none">
        DS
      </div>

      <div className="max-w-[1400px] mx-auto w-full">
        {/* Heading */}
        <div ref={headingRef} className="mb-24 opacity-0">
          <span className="text-xs font-mono tracking-[0.25em] text-primary uppercase mb-6 block">[ In Numbers ]</span>
          <h2 className="text-4xl md:text-6xl lg:text-[5vw] font-display font-black tracking-[-0.04em] text-white uppercase leading-[0.9]">
            Our Impact
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => statsRef.current[i] = el}
              className="border-t border-white/10 pt-8 opacity-0"
            >
              <p
                ref={el => numbersRef.current[i] = el}
                className="text-6xl md:text-7xl lg:text-[5vw] font-display font-black text-white mb-3 tabular-nums"
              >
                0
              </p>
              <p className="text-xs font-mono tracking-[0.25em] uppercase text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
