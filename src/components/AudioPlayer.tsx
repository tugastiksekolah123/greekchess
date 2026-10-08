import React, { useState, useEffect } from 'react';
import { soundEngine, SOUNDTRACK_TRACKS, TrackInfo } from '../services/soundEngine';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(SOUNDTRACK_TRACKS[0]);

  useEffect(() => {
    soundEngine.setOnTrackChange((track, playing) => {
      setCurrentTrack(track);
      setIsPlaying(playing);
    });
  }, []);

  const handleTogglePlay = () => {
    const playing = soundEngine.toggleMusic();
    setIsPlaying(playing);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted && val > 0) {
      soundEngine.toggleMute();
      setIsMuted(false);
    }
  };

  const handleNext = () => {
    soundEngine.nextTrack();
  };

  const handlePrev = () => {
    soundEngine.prevTrack();
  };

  return (
    <div className="w-full bg-[#111116] border border-amber-500/30 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
          <Music className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-sm font-bold text-amber-300 truncate">
              {currentTrack.title}
            </span>
            <span className="text-[11px] font-cinzel text-amber-500/70 hidden sm:inline">
              ({currentTrack.greekTitle})
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate max-w-[280px]">
            {currentTrack.scaleName} • {currentTrack.description}
          </p>
        </div>
      </div>

      {/* Visualizer & Controls */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        {/* Animated Sound Bars */}
        <div className="hidden sm:flex items-center gap-1 h-6 px-2">
          {[40, 75, 100, 60, 85, 45, 95, 65].map((heightPct, idx) => (
            <span
              key={idx}
              className="w-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full transition-all duration-300"
              style={{
                height: isPlaying ? `${Math.max(15, (heightPct * (idx % 2 === 0 ? 0.9 : 0.6)))}%` : '15%',
                opacity: isPlaying ? 0.9 : 0.3
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black flex items-center justify-center font-bold shadow-md gold-glow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Hellenic Hymn' : 'Play Ancient Lyre Music'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 accent-amber-400 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
};
