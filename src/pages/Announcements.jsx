import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Pin, Calendar, User, ArrowUpRight } from 'lucide-react';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Announcements = () => {
  const headerRef = useRef(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getAnnouncements(false);
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Unable to load announcements from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Filter out only deliberately inactive announcements
  const activeAnnouncements = announcements.filter(a => a.active !== false);
  const pinned = activeAnnouncements.filter(a => a.pinned);
  const regular = activeAnnouncements.filter(a => !a.pinned);

  const renderCard = (announcement, isPinned = false) => {
    const imgSrc = announcement.image || announcement.coverImage;

    return (
      <div
        key={announcement.id || announcement._id}
        className={`group border rounded-sm p-6 md:p-8 transition-all duration-300 flex flex-col ${
          isPinned
            ? 'border-primary/40 bg-primary/5 hover:border-primary/60 md:col-span-2'
            : 'border-white/5 bg-surface/50 hover:border-white/15'
        }`}
      >
        <div className={`flex flex-col ${imgSrc ? 'md:flex-row gap-6 items-start' : 'gap-4'} flex-1`}>
          {imgSrc && (
            <div className="w-full md:w-56 aspect-video shrink-0 rounded overflow-hidden bg-background border border-white/5">
              <SmartImage
                src={imgSrc}
                alt={announcement.title}
                type="announcement"
                className="w-full h-full"
              />
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
                {announcement.category || 'Announcement'}
              </span>
              {isPinned && (
                <span className="flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-yellow-500 font-semibold">
                  <Pin size={12} /> Pinned
                </span>
              )}
            </div>

            <h3 className={`font-display font-bold text-white mb-3 uppercase tracking-tight group-hover:text-primary transition-colors ${
              isPinned ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}>
              {announcement.title}
            </h3>

            <p className="text-gray-400 font-sans leading-relaxed text-sm mb-6 whitespace-pre-line">
              {announcement.content}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 font-mono">
              <div className="flex items-center gap-4">
                {announcement.author && (
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-primary" />
                    <span>{announcement.author}</span>
                  </div>
                )}
                {announcement.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary" />
                    <span>{formatDate(announcement.publishedAt)}</span>
                  </div>
                )}
              </div>

              {announcement.externalLink && (
                <a
                  href={announcement.externalLink.startsWith('http') ? announcement.externalLink : `https://${announcement.externalLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 05 / DISPATCHES ]</span>
          <h1 className="text-6xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-8">
            Announce<br/>ments
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            Stay up to date with the latest from Dev Studio — initiatives, club milestones, recruitment, and technical updates.
          </p>
        </div>

        {/* Feedback states */}
        {loading && <SkeletonCard type="resource" count={3} />}
        {error && <ErrorState message={error} onRetry={fetchAnnouncements} />}

        {!loading && !error && activeAnnouncements.length === 0 && (
          <EmptyState
            title="No announcements at this time"
            description="Official club notices and project calls will be posted here."
          />
        )}

        {/* Announcements List */}
        {!loading && !error && activeAnnouncements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinned.map(a => renderCard(a, true))}
            {regular.map(a => renderCard(a, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;