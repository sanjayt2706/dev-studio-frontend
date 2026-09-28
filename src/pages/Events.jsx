import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Calendar, MapPin, ArrowUpRight, Clock } from 'lucide-react';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Events = () => {
  const headerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getEvents(false);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Unable to load events from the database. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
    if (!dateStr) return 'Date TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Safe separation into upcoming vs past without losing any records
  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const up = [];
    const ps = [];

    events.forEach(e => {
      const eventDateStr = e.date ? (typeof e.date === 'string' ? e.date.split('T')[0] : new Date(e.date).toISOString().split('T')[0]) : '';
      const isPast = e.status === 'completed' || (e.status !== 'upcoming' && eventDateStr && eventDateStr < today);

      if (isPast) {
        ps.push(e);
      } else {
        up.push(e);
      }
    });

    return { upcoming: up, past: ps };
  }, [events]);

  const renderEventCard = (event, isFeatured = false) => {
    return (
      <div
        key={event.id || event._id}
        className={`group bg-surface/40 border border-white/5 rounded-sm p-5 md:p-8 hover:border-white/15 active:border-white/15 transition-all duration-300 flex flex-col ${
          isFeatured ? 'md:col-span-2 md:grid md:grid-cols-2 md:gap-10 md:items-center' : ''
        }`}
      >
        {/* Poster */}
        <div className={`overflow-hidden rounded-sm bg-background border border-white/5 relative ${
          isFeatured ? 'aspect-[4/5] w-full' : 'aspect-[4/5] w-full mb-6'
        }`}>
          <SmartImage
            src={event.poster}
            alt={event.title}
            type="event"
            className="w-full h-full"
            imgClassName="transition-transform duration-700 group-hover:scale-105"
          >
            {isFeatured && (
              <div className="absolute top-3 left-3 bg-primary text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded shadow-md">
                Featured Event
              </div>
            )}
          </SmartImage>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
              {event.category || 'Event'}
            </span>
            {event.organizer && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider truncate">
                  {event.organizer}
                </span>
              </>
            )}
          </div>

          <h3 className={`font-display font-bold text-white mb-3 uppercase tracking-tight group-hover:text-primary transition-colors ${
            isFeatured ? 'text-3xl md:text-5xl' : 'text-2xl'
          }`}>
            {event.title}
          </h3>

          <p className="text-gray-400 font-sans leading-relaxed mb-6 text-sm">
            {event.description}
          </p>

          <div className="flex flex-col gap-2.5 mb-6 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary shrink-0" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5">
            {event.registrationUrl && event.status !== 'completed' ? (
              <a
                href={event.registrationUrl.startsWith('http') ? event.registrationUrl : `https://${event.registrationUrl}`}
                target="_blank"
                rel="noreferrer"
                className="group/btn inline-flex items-center gap-2 bg-primary text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-blue-600 transition-colors w-fit"
              >
                <span>Register Now</span>
                <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500 border border-white/10 px-4 py-2 rounded inline-block">
                {event.status === 'completed' ? 'Event Concluded' : 'RSVP Closed'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 04 / EXPERIENCES ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6 md:mb-8">
            Events
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            Hackathons, workshops, bootcamps, and competitions. Where learning happens through building.
          </p>
        </div>

        {/* Feedback States */}
        {loading && <SkeletonCard type="event" count={3} />}
        {error && <ErrorState message={error} onRetry={fetchEvents} />}

        {!loading && !error && events.length === 0 && (
          <EmptyState
            title="No events scheduled"
            description="Stay tuned for upcoming hackathons, bootcamps, and workshops."
          />
        )}

        {/* Events Content */}
        {!loading && !error && events.length > 0 && (
          <div className="flex flex-col gap-24">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                  <span className="text-xs font-mono tracking-widest uppercase text-white font-bold">Upcoming Events</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500">{upcoming.length} events</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {upcoming.map((event, i) => renderEventCard(event, i === 0 && event.featured))}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                  <span className="text-xs font-mono tracking-widest uppercase text-white font-bold">Past Events & Archives</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs font-mono tracking-widest uppercase text-gray-500">{past.length} events</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {past.map(event => renderEventCard(event))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;