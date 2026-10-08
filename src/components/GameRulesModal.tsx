import React from 'react';
import { X, Shield, Zap, Sparkles, BookCheck } from 'lucide-react';
import { ChessPieceSvg } from './ChessPieceSvg';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRulesModal: React.FC<GameRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121217] border-2 border-amber-500 rounded-2xl max-w-2xl w-full p-6 gold-glow max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-2xl font-cinzel">
            🏛️
          </div>
          <div>
            <h3 className="font-cinzel text-2xl font-bold text-amber-300">
              SACRED RULES OF PANTHEON CHESS
            </h3>
            <p className="text-xs text-amber-500/80 font-cinzel">
              Ancient Strategy Meets FIDE Classical Standards
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 text-neutral-300 text-xs leading-relaxed font-sans">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-amber-500/20 space-y-1">
            <h4 className="font-cinzel font-bold text-sm text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              1. Objective & Divine Mandate
            </h4>
            <p>
              Lead the forces of Mount Olympus or the Chthonic Titans to capture the enemy sovereign. Trap the opponent's King into <strong className="text-amber-300">Checkmate</strong> (no legal moves left to evade divine capture).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-amber-500/20 space-y-2">
            <h4 className="font-cinzel font-bold text-sm text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              2. The Pantheon Roster
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="k" color="w" /></div>
                <div><span className="font-bold text-amber-300">Zeus (King):</span> 1 square in any direction. Must be guarded at all costs.</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="q" color="w" /></div>
                <div><span className="font-bold text-amber-300">Athena (Queen):</span> Any number of squares in straight or diagonal paths.</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="r" color="w" /></div>
                <div><span className="font-bold text-amber-300">Temple (Rook):</span> Unlimited horizontal and vertical moves.</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="b" color="w" /></div>
                <div><span className="font-bold text-amber-300">Apollo (Bishop):</span> Unlimited diagonal moves along its assigned square color.</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="n" color="w" /></div>
                <div><span className="font-bold text-amber-300">Pegasus (Knight):</span> Jumps over all pieces in an L-shaped formation (2+1).</div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg">
                <div className="w-7 h-7"><ChessPieceSvg type="p" color="w" /></div>
                <div><span className="font-bold text-amber-300">Hoplite (Pawn):</span> Advances 1 square (or 2 on start). Captures diagonally. Promotes on final rank!</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-amber-500/20 space-y-1">
            <h4 className="font-cinzel font-bold text-sm text-amber-400 flex items-center gap-2">
              <BookCheck className="w-4 h-4" />
              3. Special Divine Moves
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-neutral-300">
              <li><strong className="text-amber-300">Castling:</strong> King moves two squares toward a Rook to entrench in sanctuary. Neither piece can have previously moved.</li>
              <li><strong className="text-amber-300">En Passant:</strong> A pawn that advances 2 squares past an enemy pawn can be captured diagonally on the very next move.</li>
              <li><strong className="text-amber-300">Ascension (Promotion):</strong> When a Spartan Hoplite reaches the 8th rank, promote it immediately into Athena, Temple, Apollo, or Pegasus!</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-amber-500/20 space-y-1">
            <h4 className="font-cinzel font-bold text-sm text-amber-400 flex items-center gap-2">
              ⚡ 4. Thunderous Capture VFX & Lyre Soundtrack
            </h4>
            <p>
              Whenever an enemy warrior is vanquished, Zeus's lightning bolt tears through the clouds striking the captured square with electric crackles and shockwaves. Choose your Hellenic musical accompaniment using the music player at the top!
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-cinzel font-bold text-xs gold-glow cursor-pointer"
          >
            RETURN TO BATTLEFIELD
          </button>
        </div>
      </div>
    </div>
  );
};
