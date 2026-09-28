import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ExternalLink, Download, BookOpen, Layers } from 'lucide-react';
import { gsap } from 'gsap';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const headerRef = useRef(null);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getResources(false);
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('Unable to load resources from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
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

  const categories = useMemo(() => {
    const set = new Set(resources.map(r => r.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const term = search.toLowerCase().trim();
      const matchesSearch = term === '' ||
        (resource.title && resource.title.toLowerCase().includes(term)) ||
        (resource.description && resource.description.toLowerCase().includes(term)) ||
        (resource.author && resource.author.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [resources, search, selectedCategory]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 05 / KNOWLEDGE BASE ]</span>
          <h1 className="text-6xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-8">
            The<br/>Library
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            Curated roadmaps, engineering handbooks, guides, and tooling documentation written by club leads and domain experts.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-surface/40 p-2.5 rounded-lg border border-white/5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="SEARCH BY TOPIC, TITLE, OR AUTHOR..."
              className="w-full bg-transparent border-none pl-11 pr-4 py-3 text-white font-mono text-xs tracking-widest focus:outline-none placeholder:text-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto py-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback states */}
        {loading && <SkeletonCard type="resource" count={6} />}
        {error && <ErrorState message={error} onRetry={fetchResources} />}

        {!loading && !error && filteredResources.length === 0 && (
          <EmptyState
            title="No resources found"
            description="Try adjusting your keyword search or category filter."
          />
        )}

        {/* Resources Grid */}
        {!loading && !error && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, idx) => (
              <div
                key={resource.id || resource._id || idx}
                className="group relative bg-surface border border-white/5 rounded-sm p-6 md:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-primary border border-primary/20 px-2 py-0.5 rounded bg-primary/5">
                      {resource.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 tracking-wider">
                      {formatDate(resource.date)}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors duration-300 mb-3 uppercase tracking-tight">
                    {resource.title}
                  </h3>

                  <p className="text-gray-400 text-sm font-sans leading-relaxed mb-6">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-xs font-mono text-gray-500">
                    By {resource.author || 'Dev Studio'}
                  </span>

                  <div className="flex gap-2">
                    {resource.externalUrl && (
                      <a
                        href={resource.externalUrl.startsWith('http') ? resource.externalUrl : `https://${resource.externalUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline cursor-pointer"
                      >
                        <span>Access</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {resource.downloadableFileUrl && (
                      <a
                        href={resource.downloadableFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-white"
                        title="Download Asset"
                      >
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;