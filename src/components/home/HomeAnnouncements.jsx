import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pin, Calendar, User, Bell, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clubService } from '../../services/clubService';
import announcementsData from '../../data/announcements';

gsap.registerPlugin(ScrollTrigger);

const HomeAnnouncements = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [announcements, setAnnouncements] = useState(
    Array.isArray(announcementsData) ? announcementsData : []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    clubService.getAnnouncements(false)
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          setAnnouncements(data);
        }
      })
      .catch(err => {
        console.warn('Unable to fetch live announcements for home:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter active announcements and sort pinned first
  const activeAnnouncements = announcements
    .filter(a => a.active !== false)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    .slice(0, 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeAnnouncements.length]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36 bg-[#08090D] border-t border-white/5 px-6 md:px-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono tracking-[0.25em] text-primary uppercase font-semibold">
                [ 03 / DISPATCHES ]
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden sm:inline">
                OFFICIAL STUDIO BULLETINS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-editorial font-bold tracking-tight text-white uppercase leading-none">
              LATEST <span className="stroke-text">ANNOUNCEMENTS</span><span className="text-primary">.</span>
            </h2>
          </div>

          <Link
            to="/announcements"
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all duration-300"
          >
            <span>All Bulletins</span>
            <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300">
              <ArrowUpRight size={13} className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Announcements Content or Empty State */}
        {activeAnnouncements.length === 0 ? (
          <div className="w-full bg-surface/30 border border-white/10 rounded-xl p-12 md:p-16 text-center relative overflow-hidden backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Bell size={24} className="opacity-80" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-2">
              DISPATCH STATUS: DORMANT
            </span>
            <h3 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider mb-2">
              No Announcements For Now
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6 font-sans">
              All frequencies are clear. Official recruitment schedules, hackathon calls, and tech workshops will be broadcasted here soon.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles size={13} className="text-primary" />
              <span>Apply for Next Cohort</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {activeAnnouncements.map((announcement, idx) => (
              <div
                key={announcement._id || announcement.id || idx}
                ref={el => cardsRef.current[idx] = el}
                data-cursor="card"
                className={`group relative bg-surface/40 border rounded-xl p-6 md:p-8 flex flex-col justify-between backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 ${
                  announcement.pinned
                    ? 'border-primary/40 bg-primary/5 hover:border-primary hover:shadow-[0_10px_35px_rgba(59,130,246,0.18)]'
                    : 'border-white/10 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold border border-primary/20 px-2.5 py-1 rounded bg-primary/10">
                      {announcement.category || 'NOTICE'}
                    </span>
                    {announcement.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                        <Pin size={10} /> PINNED
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors duration-300 mb-3 uppercase tracking-tight line-clamp-2">
                    {announcement.title}
                  </h3>

                  <p className="text-gray-400 text-xs font-sans leading-relaxed line-clamp-3 mb-6">
                    {announcement.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gray-400" />
                    <span>{formatDate(announcement.publishDate || announcement.publishedAt)}</span>
                  </div>
                  <Link
                    to="/announcements"
                    className="text-white/60 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Read</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeAnnouncements;
