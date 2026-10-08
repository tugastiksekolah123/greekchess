import React, { useEffect, useState } from 'react';
import { CaptureEvent } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { Zap } from 'lucide-react';

interface CaptureBannerProps {
  captureEvent: CaptureEvent | null;
}

export const CaptureBanner: React.FC<CaptureBannerProps> = ({ captureEvent }) => {
  const [visible, setVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CaptureEvent | null>(null);

  useEffect(() => {
    if (captureEvent) {
      setCurrentEvent(captureEvent);
      setVisible(true);

      const timer = window.setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => window.clearTimeout(timer);
    }
  }, [captureEvent]);

  if (!visible || !currentEvent) return null;

  const isWhiteAttacker = currentEvent.attacker.color === 'w';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto transition-all duration-300 animate-in fade-in slide-in-from-top-4 pointer-events-none">
      <div className={`p-4 rounded-xl border-2 shadow-2xl backdrop-blur-md flex items-center gap-4 ${
        isWhiteAttacker
          ? 'bg-[#14120a]/95 border-amber-400 gold-glow text-amber-200'
          : 'bg-[#180a0a]/95 border-red-500/80 chthonic-glow text-red-200'
      }`}>
        
        {/* Attacker piece icon */}
        <div className="relative w-12 h-12 shrink-0 p-1 bg-black/60 rounded-lg border border-amber-500/40">
          <ChessPieceSvg type={currentEvent.attacker.type} color={currentEvent.attacker.color} />
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black rounded-full p-0.5">
            <Zap className="w-3 h-3 fill-current" />
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider">
              {currentEvent.attacker.god?.name || 'Olympian'} SMOTE {currentEvent.victim.god?.name || 'Enemy'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-cinzel">
              ON {currentEvent.square.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-neutral-200 italic font-serif">
            "{currentEvent.quote}"
          </p>
        </div>

        {/* Fallen victim icon */}
        <div className="w-10 h-10 shrink-0 p-1 bg-black/40 rounded-lg border border-neutral-700/60 opacity-60 line-through">
          <ChessPieceSvg type={currentEvent.victim.type} color={currentEvent.victim.color} />
        </div>
      </div>
    </div>
  );
};
