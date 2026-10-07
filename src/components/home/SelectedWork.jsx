import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Sparkles, GitBranch } from 'lucide-react';
import projectsData from '../../data/projects';
import { clubService, normalizeProject } from '../../services/clubService';
import SmartImage from '../common/SmartImage';
import { getImageUrl, handleImageError } from '../../utils/images';

gsap.registerPlugin(ScrollTrigger);

const SelectedWork = () => {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const headerRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [projects, setProjects] = useState(projectsData.map(normalizeProject));

  useEffect(() => {
    clubService.getProjects().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const featured = useMemo(() => {
    const list = projects.filter(p => p.featured);
    return list.length > 0 ? list : projects.slice(0, 4);
  }, [projects]);

  useEffect(() => {
    if (featured.length === 0) return;
    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );

      // Horizontal pin on desktop
      if (isDesktop && trackRef.current && containerRef.current) {
        const track = trackRef.current;
        const totalCards = featured.length;

        const getScrollDistance = () => {
          return track.scrollWidth - window.innerWidth + 120;
        };

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'workHorizontal',
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${Math.max(600, getScrollDistance())}`,
            pin: pinTargetRef.current,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
              }
              const currentCard = Math.min(totalCards - 1, Math.floor(self.progress * totalCards));
              setActiveIdx(currentCard);
            },
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [featured.length]);

  return (
    <section ref={containerRef} className="relative w-full bg-[#090A0F] border-t border-white/5">
      <div
        ref={pinTargetRef}
        className="relative w-full min-h-0 md:h-screen md:max-h-screen overflow-hidden flex flex-col justify-start md:justify-between py-10 md:py-0 md:pt-6 sm:md:pt-8 md:pb-6"
      >
        {/* Ambient background glows - subtle neutral depth */}
        <div
          className="absolute top-1/4 right-0 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
          }}
        />

        {/* Technical HUD Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Top Header */}
        <div className="px-4 sm:px-6 md:px-14 w-full max-w-[1500px] mx-auto z-10 mb-6 md:mb-0">
          <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-mono tracking-[0.25em] text-primary uppercase font-semibold">
                  [ 02 / SELECTED WORK ]
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden sm:inline">
                  PRODUCTION SYSTEMS & LABS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial font-bold tracking-tight text-white uppercase leading-none">
                WHAT WE <span className="stroke-text">BUILD</span><span className="text-primary">.</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <Sparkles size={12} className="text-primary" />
                <span>Scroll horizontally to inspect repos</span>
              </div>
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all duration-300"
              >
                <span>Full Archive</span>
                <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300">
                  <ArrowUpRight size={13} className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content: Cards Track OR Empty State */}
        {featured.length === 0 ? (
          <div className="w-full max-w-xl mx-auto px-6 py-16 text-center z-10 my-auto">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary mx-auto mb-4">
              <GitBranch size={24} className="opacity-80" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-2">
              SPRINT STATUS: STEALTH BUILDS
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
              Projects Will Be Uploaded Soon
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Our engineering squads are currently deploying production-grade systems in stealth. Production repositories, live demos, and case studies will be published here soon.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles size={14} />
              <span>Join a Project Sprint</span>
            </Link>
          </div>
        ) : (
          <div className="w-full my-auto py-2 overflow-hidden z-10">
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-6 md:gap-8 pl-4 sm:pl-6 md:pl-14 pr-6 sm:pr-10 md:pr-[25vw] items-center overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory md:snap-none"
              style={{ width: 'max-content' }}
            >
              {featured.map((project, i) => (
                <div
                  key={project.id}
                  data-cursor="card"
                  className="group flex-shrink-0 snap-center w-[92vw] sm:w-[620px] md:w-[720px] lg:w-[800px] h-auto min-h-0 md:h-[58vh] md:max-h-[410px] md:min-h-[330px] rounded-none bg-[#0B0D14] border border-white/10 hover:border-white/30 transition-all duration-300 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-2xl shadow-black/90 relative overflow-hidden"
                >
                  {/* Top-corner architectural highlight: thick in the top of the corner, light on edges */}
                  <div className="absolute top-0 left-0 w-28 h-[2px] bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none z-20" />
                  <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none z-20" />

                  {/* Left Column: Visual Vector Mockup Preview with sharp edges */}
                  <div className="w-full sm:w-[48%] h-48 sm:h-full relative rounded-none overflow-hidden bg-black border border-white/10 group-hover:border-white/20 transition-all duration-300 flex-shrink-0">
                    <SmartImage
                      src={project.coverImage}
                      alt={project.title}
                      type="project"
                      className="w-full h-full"
                      imgClassName="object-top opacity-95 contrast-[1.04] saturate-[1.02] group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Tech badge on preview image */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-black/90 border border-white/20 text-[9px] font-mono text-white/90 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <span>{project.year} // {(Array.isArray(project.technologies) && project.technologies[0]) ? project.technologies[0] : (project.category || 'Tech')}</span>
                    </div>
                  </div>

                  {/* Right Column: Project Meta, Title, Description & Actions */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                    <div>
                      {/* Meta Bar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-mono text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold tracking-wider">
                            [ 0{i + 1} ]
                          </span>
                          <span className="text-white/30">/</span>
                          <span className="text-white/60 uppercase tracking-widest">{project.category}</span>
                        </div>
                        {project.badge && (
                          <span className="px-2 py-0.5 rounded-none text-[8px] font-mono tracking-wider bg-white/5 text-white/80 border border-white/15 font-medium">
                            {project.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-display font-bold text-white group-hover:text-zinc-200 transition-colors tracking-tight leading-snug">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-0.5 mb-2 truncate">
                          {project.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-[13px] text-zinc-300 font-sans leading-relaxed line-clamp-3 mb-2 font-normal">
                        {project.description}
                      </p>
                    </div>

                  {/* Bottom: Tech Stack Pills & Action Links */}
                  <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(project.technologies) ? project.technologies : []).slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono px-2 py-0.5 rounded-none bg-white/5 text-zinc-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 text-white/40">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {project.github && project.github !== '#' && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-none bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors border border-white/10"
                          title="GitHub Repository"
                        >
                          <GitBranch size={13} />
                        </a>
                      )}
                      {project.liveDemo && project.liveDemo !== '#' ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-white text-black hover:bg-zinc-200 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors"
                        >
                          <span>Live</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <Link
                          to="/work"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none bg-white/10 hover:bg-white text-white hover:text-black text-[11px] font-mono font-medium transition-colors border border-white/15"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Progress Bar & Counter (Desktop) - Compact footer */}
      {featured.length > 0 && (
        <div className="px-6 md:px-14 w-full max-w-[1500px] mx-auto z-10 hidden md:flex items-center justify-between gap-6 pt-1">
          <div className="flex items-center gap-3 text-xs font-mono text-white/50">
            <span className="text-white font-bold tracking-widest">
              0{activeIdx + 1}
            </span>
            <span className="text-white/20">/</span>
            <span>0{featured.length}</span>
          </div>

          {/* Dynamic Scrub Progress Bar */}
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden max-w-sm">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${((activeIdx + 1) / featured.length) * 100}%` }}
            />
          </div>

          <div className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
            MITE DEV STUDIO PRODUCTION INITIATIVE
          </div>
        </div>
      )}
    </div>
    </section>
  );
};

export default SelectedWork;
