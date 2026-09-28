import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PLACEHOLDERS } from '../utils/images';
import teamData from '../data/team';
import projectsData from '../data/projects';
import eventsData from '../data/events';
import { clubService } from '../services/clubService';

const About = () => {
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);

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
        members: (Array.isArray(m) ? m : []).filter(item => item.active !== undefined ? item.active : item.isActive).length,
        projects: (Array.isArray(p) ? p : []).length,
        events: (Array.isArray(e) ? e : []).length,
      });
    }).catch(err => {
      console.warn('Unable to load counts in About:', err);
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
      );
      gsap.fromTo(statsRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } }
      );
      gsap.fromTo(missionRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: missionRef.current, start: 'top 80%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'Members', value: counts.members + '+' },
    { label: 'Projects', value: counts.projects + '+' },
    { label: 'Events', value: counts.events + '+' },
    { label: 'Years Active', value: '3' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-32">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 01 / ABOUT ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-8 md:mb-12">
            About<br/>Us
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-7">
              <p className="text-2xl md:text-3xl font-display font-bold text-white leading-snug tracking-tight mb-8">
                Dev Studio is a student-led technology community at MITE Mangalore, driven by the desire to build real-world solutions.
              </p>
              <p className="text-lg text-gray-400 font-sans leading-relaxed">
                Founded by a group of passionate developers, we've grown into a collective of engineers, designers, and innovators who believe that the best way to learn is by building. We organize hackathons, workshops, and mentorship programs that help students go from idea to production.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex items-start">
              <img
                src={PLACEHOLDERS.logo}
                alt="Dev Studio"
                className="w-32 md:w-40 opacity-60"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 opacity-0">
          {stats.map((stat) => (
            <div key={stat.label} className="border-t border-white/10 pt-8">
              <p className="text-5xl md:text-7xl font-display font-black text-white mb-2">{stat.value}</p>
              <p className="text-xs font-mono tracking-widest uppercase text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div ref={missionRef} className="grid grid-cols-1 md:grid-cols-12 gap-12 opacity-0">
          <div className="md:col-span-4">
            <span className="text-xs font-mono tracking-widest text-primary uppercase block">[ MISSION ]</span>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-white leading-tight mb-8">
              Bridge the gap between classroom learning and industry practice.
            </h2>
            <p className="text-lg text-gray-400 font-sans leading-relaxed">
              We provide students with hands-on experience through real projects, mentorship from senior developers, and exposure to modern development practices including version control, CI/CD, code review, and collaborative workflows. Our goal is to ensure every member leaves MITE with a portfolio of real work and the confidence to contribute on day one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;