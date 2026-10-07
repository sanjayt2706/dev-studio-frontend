import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import teamData from '../../data/team';
import { clubService, normalizeMember } from '../../services/clubService';
import SmartImage from '../common/SmartImage';
import { getImageUrl, handleImageError } from '../../utils/images';

gsap.registerPlugin(ScrollTrigger);

const OurPeople = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const [members, setMembers] = useState(teamData.map(normalizeMember));

  useEffect(() => {
    clubService.getMembers().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setMembers(data);
      }
    });
  }, []);

  // Only core team (leads) for the homepage cinematic display with safe fallback
  const activeMembers = members.filter(m => m.active !== undefined ? m.active : (m.isActive !== undefined ? m.isActive : true));
  const leads = activeMembers.filter(m => m.role && m.role !== 'Member');
  const coreTeam = (leads.length > 0 ? leads : activeMembers).slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(headerRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      // Staggered card entrances — each card scales up from small and fades in
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Card entrance: scale from 0.7, translate up, fade in
        gsap.fromTo(card,
          { y: 120, opacity: 0, scale: 0.85 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1.2,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: stageRef.current, start: 'top 75%' }
          }
        );

        // Parallax on each card — different rates for depth
        const parallaxSpeed = [30, -20, 40, -30, 25, -15][i] || 20;
        gsap.to(card, {
          y: parallaxSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });

      // CTA entrance
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [coreTeam.length]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36 px-4 sm:px-6 md:px-12 bg-background overflow-hidden border-t border-white/5">
      {/* Subtle background */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-primary uppercase mb-4 block font-semibold">[ 04 / People ]</span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] font-display font-black tracking-[-0.04em] text-white uppercase leading-[0.9]">
                The<br/><span className="stroke-text">Minds</span><span className="text-primary">.</span>
              </h2>
            </div>
            <p className="max-w-md text-zinc-300 font-sans text-sm md:text-base leading-relaxed font-normal">
              A diverse collective of passionate developers, designers, and innovators. Meet the people driving Dev Studio forward.
            </p>
          </div>
        </div>

        {/* Team stage — asymmetric grid for visual interest */}
        <div
          ref={stageRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {coreTeam.map((member, i) => (
            <div
              key={member.id || member._id || i}
              ref={el => cardsRef.current[i] = el}
              className={`group relative ${
                i === 0 ? 'row-span-2 col-span-1' : ''
              }`}
            >
              {/* Photo container */}
              <div
                data-cursor="card"
                className={`relative overflow-hidden rounded-sm bg-surface border border-white/5 group-hover:border-primary/50 group-hover:shadow-[0_10px_35px_rgba(124,58,237,0.22)] transition-all duration-500 ${
                i === 0 ? 'aspect-[3/4]' : 'aspect-square'
              }`}>
                <SmartImage
                  src={member.image || member.profileImage}
                  alt={member.name}
                  type="member"
                  className="w-full h-full"
                  imgClassName="opacity-95 contrast-[1.08] saturate-[1.1] group-hover:opacity-100 group-hover:saturate-[1.28] group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none"></div>

                {/* Name/Role */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                  <h4 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{member.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase font-bold">{member.role}</span>
                    <span className="w-4 h-px bg-white/30"></span>
                    <span className="text-[11px] font-mono tracking-[0.2em] text-gray-300 uppercase">{member.team}</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_8px_#3b82f6] transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-16 md:mt-20 flex justify-center">
          <Link
            to="/team"
            className="group inline-flex items-center justify-center bg-white !text-black font-mono text-xs font-bold px-8 py-4 rounded-full uppercase tracking-[0.2em] hover:bg-primary hover:!text-white transition-all duration-300 shadow-xl shadow-black/50"
          >
            <span>Meet The Full Team</span>
            <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurPeople;
