import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Gallery = () => {
  const headerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getGallery();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setError('Unable to load gallery moments from the database. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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

  // Dynamic categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 06 / MOMENTS ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6 md:mb-8">
            The<br/>Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            Snapshots of club life, midnight hackathons, intense design sprints, workshops, and build retrospectives.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-16 pb-6 border-b border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Feedback states */}
        {loading && <SkeletonCard type="gallery" count={6} />}
        {error && <ErrorState message={error} onRetry={fetchGallery} />}

        {!loading && !error && filteredItems.length === 0 && (
          <EmptyState
            title="No gallery moments yet"
            description="Club photos and event highlights will be displayed here once posted."
          />
        )}

        {/* Gallery Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || item._id || idx}
                data-cursor="image"
                className="group relative bg-surface border border-white/10 rounded-sm overflow-hidden hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(124,58,237,0.18)] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-background relative">
                  <SmartImage
                    src={item.imageUrl}
                    alt={item.title || 'Dev Studio gallery photo'}
                    type="gallery"
                    className="w-full h-full"
                    imgClassName="opacity-95 contrast-[1.06] saturate-[1.08] group-hover:opacity-100 group-hover:saturate-[1.25] group-hover:contrast-[1.12] transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.category && (
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-primary font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border border-primary/20">
                      {item.category}
                    </div>
                  )}
                </div>
                {item.title && (
                  <div className="p-4 bg-surface/90 border-t border-white/5">
                    <h3 className="font-display font-black text-sm text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
