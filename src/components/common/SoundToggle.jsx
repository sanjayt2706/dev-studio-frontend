import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import audioManager from '../../audio/AudioManager';

/**
 * SoundToggle - Minimal, elegant global audio toggle button
 *
 * Persists in localStorage via AudioManager.
 * Restrained UI that fits seamlessly into the Dev Studio cinematic navbar.
 */
export const SoundToggle = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    const nextState = audioManager.toggleMute();
    if (!nextState) {
      // User just unmuted: provide immediate subtle tactile confirmation click
      audioManager.play('button-click');
    }
  };

  return (
    <button
      onClick={handleClick}
      data-cursor="button"
      className={`p-2 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center ${className}`}
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      title={isMuted ? 'Sound SFX: Muted (Click to enable)' : 'Sound SFX: Enabled (Click to mute)'}
    >
      {isMuted ? (
        <VolumeX size={15} className="text-red-400/80" />
      ) : (
        <Volume2 size={15} className="text-primary/90" />
      )}
    </button>
  );
};

export default SoundToggle;
