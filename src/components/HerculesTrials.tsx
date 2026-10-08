import React, { useState } from 'react';
import { HERCULES_TRIALS, MythPuzzle } from '../types/chess';
import { GameEngine } from '../services/chessEngine';
import { ChessBoard } from './ChessBoard';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle, CheckCircle2, RotateCcw, ChevronRight, Swords, Sparkles } from 'lucide-react';

export const HerculesTrials: React.FC = () => {
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const trial: MythPuzzle = HERCULES_TRIALS[currentTrialIndex];

  const [engine, setEngine] = useState(() => new GameEngine(trial.fen));
  const [status, setStatus] = useState<'playing' | 'solved' | 'failed'>('playing');
  const [showHint, setShowHint] = useState(false);

  // When changing trial
  const handleSelectTrial = (idx: number) => {
    setCurrentTrialIndex(idx);
    const newTrial = HERCULES_TRIALS[idx];
    const newEngine = new GameEngine(newTrial.fen);
    setEngine(newEngine);
    setStatus('playing');
    setShowHint(false);
  };

  const handleReset = () => {
    const newEngine = new GameEngine(trial.fen);
    setEngine(newEngine);
    setStatus('playing');
    setShowHint(false);
  };

  const handleMove = (from: string, to: string, promotion?: string) => {
    if (status === 'solved') return false;

    // Check if move matches solution
    const legalMoves = engine.getLegalMoves(from as any);
    const targetMove = legalMoves.find((m) => m.to === to);
    if (!targetMove) return false;

    const moveSan = targetMove.san;
    const moveAlg = `${from}${to}`;

    // Test solution
    const isSolution = trial.solutionMoves.some(
      (sol) => sol === moveSan || sol === moveAlg || sol.toLowerCase().includes(to.toLowerCase())
    );

    const executed = engine.makeMove(from as any, to as any, (promotion as any) || 'q');
    if (!executed) return false;

    // Trigger board re-render
    setEngine(new GameEngine(engine.getFen()));

    if (isSolution || engine.isCheckmate()) {
      setStatus('solved');
      soundEngine.playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#eab308', '#facc15', '#fbbf24', '#ffffff']
        });
      } catch {}
    } else {
      setStatus('failed');
      soundEngine.playDefeatSound();
    }

    return true;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-cinzel mb-2">
          <Swords className="w-3.5 h-3.5" />
          <span>HERCULEAN TRIALS OF CHESS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-amber-300 mb-2 gold-text-glow">
          THE LABORS OF HERACLES
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Prove your divine intellect by overcoming mythical chess tactical puzzles designed by the gods of Mount Olympus.
        </p>
      </div>

      {/* Trial Carousel Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {HERCULES_TRIALS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => handleSelectTrial(idx)}
            className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition-all cursor-pointer ${
              currentTrialIndex === idx
                ? 'bg-amber-400 text-black gold-glow scale-105'
                : 'bg-[#141419] text-amber-300/80 border border-amber-500/20 hover:border-amber-400'
            }`}
          >
            Labor {t.laborNumber}: {t.title.split(' ')[1] || t.title}
          </button>
        ))}
      </div>

      {/* Main Puzzle Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chessboard Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <ChessBoard
            board={engine.getBoard()}
            turn={engine.getTurn()}
            isCheck={engine.isCheck()}
            isGameOver={status !== 'playing'}
            onMove={handleMove}
            getLegalMoves={(sq) => engine.getLegalMoves(sq)}
            onCapture={() => soundEngine.playCaptureSound()}
          />
        </div>

        {/* Puzzle Details Column */}
        <div className="lg:col-span-5 bg-[#121217] border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div>
              <span className="text-[10px] font-cinzel text-amber-400 uppercase tracking-widest">
                LABOR {trial.laborNumber} OF 12
              </span>
              <h3 className="font-cinzel text-xl font-bold text-amber-300">
                {trial.title}
              </h3>
            </div>
            <span className={`text-[10px] font-cinzel px-2.5 py-1 rounded-full border ${
              trial.difficulty === 'Easy'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : trial.difficulty === 'Medium'
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                : 'bg-red-950/60 text-red-300 border-red-500/40'
            }`}>
              {trial.difficulty}
            </span>
          </div>

          {/* Myth Lore */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border-l-4 border-amber-400 text-xs text-neutral-300 italic font-serif">
            "{trial.mythLore}"
          </div>

          {/* Tactical Objective */}
          <div className="p-3 rounded-lg bg-neutral-900 border border-amber-500/30">
            <h4 className="font-cinzel text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              TACTICAL OBJECTIVE:
            </h4>
            <p className="text-xs text-amber-200 font-semibold">
              {trial.objective}
            </p>
          </div>

          {/* Outcome Status */}
          {status === 'solved' && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border-2 border-emerald-500 text-emerald-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-cinzel font-bold text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>LABOR COMPLETED! TRIUMPH OF OLYMPUS!</span>
              </div>
              <p>{trial.explanation}</p>
              {currentTrialIndex < HERCULES_TRIALS.length - 1 && (
                <button
                  onClick={() => handleSelectTrial(currentTrialIndex + 1)}
                  className="mt-2 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-cinzel font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>NEXT TRIAL</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {status === 'failed' && (
            <div className="p-4 rounded-xl bg-red-950/60 border-2 border-red-500 text-red-200 text-xs space-y-2 animate-in fade-in">
              <div className="font-cinzel font-bold text-sm text-red-300">
                THE BEAST REPELLED YOUR ATTACK!
              </div>
              <p>That move was not decisive. Re-examine the board and try another path.</p>
              <button
                onClick={handleReset}
                className="mt-2 w-full py-2 bg-red-500 hover:bg-red-400 text-black font-cinzel font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-900 border border-amber-500/30 hover:border-amber-400 text-xs font-cinzel text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'HIDE ORACLE HINT' : 'CONSULT DELPHIC ORACLE'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 cursor-pointer"
              title="Reset Puzzle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200/90 font-serif animate-in fade-in">
              <span className="font-cinzel font-bold text-amber-400 block mb-0.5">THE ORACLE WHISPERS:</span>
              Look closely for undefended squares around the enemy monarch. A single piercing thrust from Olympus leaves no escape route!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
