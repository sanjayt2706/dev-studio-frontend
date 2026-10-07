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
    {
      label: 'Active Members',
      description: 'Student engineers, designers & researchers across engineering departments.',
      value: counts.members,
      suffix: '+',
    },
    {
      label: 'Shipped Projects',
      description: 'Production web applications, mobile platforms, and open-source lab tools.',
      value: counts.projects,
      suffix: '+',
    },
    {
      label: 'Workshops & Events',
      description: 'Hands-on bootcamps, campus hackathons, and technical symposiums hosted.',
      value: counts.events,
      suffix: '+',
    },
    {
      label: 'Years Active',
      description: 'Continuous student-led engineering, mentorship, and community at MITE.',
      value: 3,
      suffix: '',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
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
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
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
    <section ref={sectionRef} className="relative py-24 sm:py-32 md:py-36 bg-[#08090F] border-t border-white/5 px-4 sm:px-6 md:px-14 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 md:mb-16 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="text-xs font-mono tracking-[0.25em] text-white/70 uppercase font-semibold">
                [ 03 / IMPACT ]
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-editorial font-bold tracking-tight text-white uppercase leading-none">
              ENGINEERED IN <span className="stroke-text">NUMBERS</span><span className="text-primary">.</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest max-w-xs">
            Tangible outcomes from our student engineering squads.
          </p>
        </div>

        {/* Stats grid with sharp architectural borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => statsRef.current[i] = el}
              className="relative p-6 sm:p-8 bg-[#0B0D14] border border-white/10 hover:border-white/30 transition-all duration-300 rounded-none flex flex-col justify-between min-h-[220px]"
            >
              {/* Corner architectural light accent */}
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-white/70 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-[2px] h-10 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

              <div>
                <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-4">
                  METRIC // 0{i + 1}
                </p>
                <p
                  ref={el => numbersRef.current[i] = el}
                  className="text-5xl sm:text-6xl lg:text-[4vw] font-display font-black text-white mb-3 tabular-nums tracking-tight leading-none"
                >
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs font-mono tracking-[0.18em] uppercase text-white font-bold mb-2">
                  {stat.label}
                </p>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-3 border-t border-white/5">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
