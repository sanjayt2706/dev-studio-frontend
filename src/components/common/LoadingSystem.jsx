import React from 'react';
import { AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';

/**
 * Base Cyber Skeleton element
 * Renders an accessible skeleton placeholder with electric purple shimmer
 */
export const Skeleton = ({ className = '', style = {}, rounded = 'rounded-sm' }) => {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`cyber-skeleton ${rounded} ${className}`}
      style={style}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Contextual Skeleton Cards
 * Tailored specifically for Dev Studio content: projects, events, members, resources, gallery
 */
export const SkeletonCard = ({ type = 'project', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'project') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface/40 border border-white/5 rounded-sm p-6 md:p-8 cyber-scanlines relative overflow-hidden"
          >
            {/* 16:9 Media Aspect */}
            <div className="aspect-[16/9] w-full rounded-sm overflow-hidden mb-6 relative">
              <Skeleton className="w-full h-full" />
              <div className="absolute top-3 left-3 w-16 h-5 rounded">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>

            {/* Title */}
            <Skeleton className="h-8 w-3/4 rounded mb-3" />

            {/* Description */}
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'member') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-surface/50 border border-white/10 rounded-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start cyber-scanlines relative"
          >
            {/* 3:4 Portrait */}
            <div className="w-full md:w-48 lg:w-56 aspect-[3/4] shrink-0 rounded-sm overflow-hidden relative border border-white/5">
              <Skeleton className="w-full h-full" />
              <div className="absolute top-2 left-2 w-14 h-4 rounded">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            {/* Bio & Details */}
            <div className="flex-1 flex flex-col w-full">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>

              <Skeleton className="h-7 w-2/3 rounded mb-3" />

              <div className="space-y-2 mb-6">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>

              {/* Social icons */}
              <div className="flex gap-3 pt-4 border-t border-white/5 mt-auto">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'event') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-surface/40 border border-white/5 rounded-sm p-6 flex flex-col cyber-scanlines relative"
          >
            {/* 4:5 Poster Aspect */}
            <div className="aspect-[4/3] w-full rounded-sm overflow-hidden mb-6 relative">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Date / Venue badge */}
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>

            <Skeleton className="h-6 w-5/6 rounded mb-3" />
            <Skeleton className="h-4 w-full rounded mb-2" />
            <Skeleton className="h-4 w-2/3 rounded mb-6" />

            {/* Action */}
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'resource') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-surface/40 border border-white/5 rounded-sm p-6 flex flex-col cyber-scanlines relative"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-6 w-4/5 rounded mb-3" />
            <Skeleton className="h-4 w-full rounded mb-2" />
            <Skeleton className="h-4 w-3/4 rounded mb-6" />
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'gallery') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-surface/40 border border-white/5 rounded-sm overflow-hidden flex flex-col cyber-scanlines"
          >
            <div className="aspect-[4/3] w-full relative">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default generic card
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {items.map((_, i) => (
        <div key={i} className="bg-surface/50 border border-white/5 rounded-sm p-6 flex flex-col gap-4 cyber-scanlines">
          <Skeleton className="w-full aspect-video rounded-sm" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Admin / Dashboard Data Tables
 * Replaces plain "Loading..." text with realistic cybernetic table rows
 */
export const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <tbody className="divide-y divide-white/5 cyber-scanlines">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="hover:bg-white/[0.01]">
          {/* First column: avatar + title */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            </div>
          </td>

          {/* Remaining columns */}
          {Array.from({ length: cols - 1 }).map((_, cIdx) => (
            <td key={cIdx} className="p-4">
              <Skeleton
                className={`h-4 rounded ${
                  cIdx === cols - 2
                    ? 'w-16 rounded-full'
                    : cIdx === cols - 3
                    ? 'w-24'
                    : 'w-20'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

/**
 * Skeleton for Numerical Statistics
 */
export const SkeletonStats = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface/40 border border-white/5 rounded-sm p-6 flex flex-col gap-3">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      ))}
    </div>
  );
};

/**
 * Subtle Centered Page-Level Dev Studio Purple Loader
 * Futuristic cyberpunk glyph with glowing `< / >` and radar sweep
 */
export const PageLoader = ({ text = 'SYNCHRONIZING DEV STUDIO DATA' }) => {
  return (
    <div className="w-full min-h-[360px] py-16 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient purple bloom */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-600/10 blur-[90px] pointer-events-none animate-cyber-pulse" />

      {/* Cybernetic Logo Glyph */}
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        {/* Outer glowing ring with tech ticks */}
        <div className="absolute inset-0 rounded-full border border-purple-500/30 border-t-purple-400 animate-spin [animation-duration:3s]" />
        <div className="absolute inset-2 rounded-full border border-white/10" />

        {/* Brand glyph */}
        <span className="font-mono text-xl font-black text-white tracking-tighter drop-shadow-[0_0_12px_rgba(124,58,237,0.8)]">
          &lt;<span className="text-purple-400">/</span>&gt;
        </span>

        {/* Pulsing radar point */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
      </div>

      {/* Monospace tech telemetry */}
      <div className="flex flex-col items-center gap-1.5 text-center px-4 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          <span className="font-mono text-xs text-white tracking-widest uppercase font-bold">
            {text}
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
          NET_ID: MITE.DEV.STUDIO // 0x7C3AED
        </span>
      </div>
    </div>
  );
};

/**
 * Compact Inline Loader for micro status
 */
export const InlineLoader = ({ text = 'Loading', size = 'sm' }) => {
  const dotSize = size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2';
  return (
    <span className="inline-flex items-center gap-2 text-gray-400 font-mono text-xs uppercase tracking-wider">
      <span className={`relative flex ${dotSize}`}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
        <span className={`relative inline-flex rounded-full ${dotSize} bg-purple-500 shadow-[0_0_6px_#a855f7]`} />
      </span>
      {text && <span>{text}</span>}
    </span>
  );
};

/**
 * Contextual Button Loader
 * Seamlessly integrates into save/delete/action buttons
 */
export const ButtonLoader = ({
  text,
  loadingText = 'Processing...',
  isLoading = false,
  icon: Icon,
  className = '',
}) => {
  if (isLoading) {
    return (
      <span className={`inline-flex items-center gap-2 font-mono ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span>{loadingText}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 font-mono ${className}`}>
      {Icon && <Icon size={14} className="shrink-0" />}
      <span>{text}</span>
    </span>
  );
};

/**
 * Cyberpunk Dev Studio Error State with Retry
 */
export const ErrorState = ({
  title = 'Connection Interrupted',
  message = 'Unable to reach the Dev Studio API. Please ensure the backend server is operational.',
  onRetry,
}) => {
  return (
    <div className="w-full bg-red-950/20 border border-red-500/30 rounded-lg p-10 text-center my-10 flex flex-col items-center relative overflow-hidden">
      {/* Red ambient warning bloom */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <AlertCircle size={22} />
      </div>

      <div className="text-[10px] font-mono tracking-widest text-red-400 uppercase mb-1">
        ERR_NETWORK_STREAM_HALT
      </div>

      <h3 className="text-lg font-display font-bold text-white mb-2 uppercase tracking-wider">
        {title}
      </h3>

      <p className="text-gray-400 text-sm max-w-md mb-6 font-sans leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-600/30"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

/**
 * Cyberpunk Dev Studio Empty State
 */
export const EmptyState = ({
  title = 'No Records Found',
  description = 'There is currently no data indexed in this section.',
  action,
}) => {
  return (
    <div className="w-full bg-surface/30 border border-white/5 rounded-lg p-16 text-center my-10 flex flex-col items-center relative overflow-hidden">
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-4">
        <FolderSearch size={22} className="text-purple-400/80" />
      </div>

      <div className="text-[10px] font-mono tracking-widest text-purple-400/80 uppercase mb-1">
        NULL_DATA_REPRESENTATION
      </div>

      <h3 className="text-lg font-display font-bold text-white mb-2 uppercase tracking-wider">
        {title}
      </h3>

      <p className="text-gray-400 text-sm max-w-md font-sans leading-relaxed mb-4">
        {description}
      </p>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

// Aliases for seamless backward compatibility
export const LoadingSkeleton = SkeletonCard;
