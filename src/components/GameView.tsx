import React, { useState, useEffect, useRef } from 'react';
import { Square, Move } from 'chess.js';
import { PieceColor, PieceType, AIDifficulty, AI_PERSONAS, AIPersonality, CaptureEvent, GOD_ROSTER } from '../types/chess';
import { GameEngine } from '../services/chessEngine';
import { ChessBoard } from './ChessBoard';
import { ChessPieceSvg } from './ChessPieceSvg';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Undo2, Flag, RefreshCw, Cpu, Users, ChevronRight, Zap, Trophy, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

interface GameViewProps {
  onCapture: (event: CaptureEvent) => void;
}

export const GameView: React.FC<GameViewProps> = ({ onCapture }) => {
  const [gameMode, setGameMode] = useState<'ai' | 'pass-and-play'>('ai');
  const [selectedAI, setSelectedAI] = useState<AIDifficulty>('athena');
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [isFlipped, setIsFlipped] = useState(false);

  const [engine, setEngine] = useState(() => new GameEngine());
  const [turn, setTurn] = useState<PieceColor>('w');
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedPgn, setCopiedPgn] = useState(false);

  const persona: AIPersonality = AI_PERSONAS[selectedAI];

  // Refresh local state from engine
  const syncGameState = (currentEngine: GameEngine) => {
    setTurn(currentEngine.getTurn());
    const inCheck = currentEngine.isCheck();
    setIsCheck(inCheck);

    if (inCheck && !currentEngine.isGameOver()) {
      soundEngine.playCheckSound();
    }

    if (currentEngine.isGameOver()) {
      setIsGameOver(true);
      if (currentEngine.isCheckmate()) {
        const winner = currentEngine.getTurn() === 'w' ? 'Black (Hades & Tartarus)' : 'White (Zeus & Olympus)';
        setGameResult(`CHECKMATE! ${winner} Triumphant!`);
        soundEngine.playVictorySound();
        try {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#eab308', '#facc15', '#ca8a04', '#ffffff']
          });
        } catch {}
      } else if (currentEngine.isDraw()) {
        setGameResult('Truce of the Gods (Draw / Stalemate)');
        soundEngine.playDefeatSound();
      }
    } else {
      setIsGameOver(false);
      setGameResult(null);
    }
  };

  // Trigger AI move if it's AI's turn
  useEffect(() => {
    if (gameMode !== 'ai' || isGameOver || isThinking) return;

    const aiColor: PieceColor = playerColor === 'w' ? 'b' : 'w';
    if (turn === aiColor) {
      setIsThinking(true);

      const delay = Math.floor(Math.random() * 450) + 350; // humanized deliberation
      const timer = window.setTimeout(() => {
        const bestMove = engine.computeBestMove(selectedAI);
        if (bestMove) {
          const movingPiece = engine.getGame().get(bestMove.from as Square);
          const targetPiece = engine.getGame().get(bestMove.to as Square);

          engine.makeMove(bestMove.from as Square, bestMove.to as Square, (bestMove.promotion as PieceType) || 'q');

          if (targetPiece || bestMove.captured) {
            const attackerGod = GOD_ROSTER[`${movingPiece?.color || 'b'}-${movingPiece?.type || 'p'}`];
            const victimGod = GOD_ROSTER[`${targetPiece?.color || 'w'}-${targetPiece?.type || bestMove.captured || 'p'}`];

            onCapture({
              id: `${Date.now()}-${bestMove.from}-${bestMove.to}`,
              attacker: {
                color: movingPiece?.color || 'b',
                type: movingPiece?.type || 'p',
                god: attackerGod
              },
              victim: {
                color: targetPiece?.color || 'w',
                type: targetPiece?.type || (bestMove.captured as PieceType) || 'p',
                god: victimGod
              },
              square: bestMove.to,
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              timestamp: Date.now(),
              quote: persona.flavorQuote
            });

            soundEngine.playCaptureSound(targetPiece?.type === 'q');
          } else {
            soundEngine.playMoveSound();
          }

          setEngine(new GameEngine(engine.getFen()));
          syncGameState(engine);
        }
        setIsThinking(false);
      }, delay);

      return () => window.clearTimeout(timer);
    }
  }, [turn, gameMode, selectedAI, playerColor, isGameOver]);

  const handlePlayerMove = (from: Square, to: Square, promotion: PieceType = 'q') => {
    if (gameMode === 'ai' && turn !== playerColor) return false;

    const success = engine.makeMove(from, to, promotion);
    if (success) {
      setEngine(new GameEngine(engine.getFen()));
      syncGameState(engine);
      return true;
    }
    return false;
  };

  const handleNewGame = () => {
    const newEng = new GameEngine();
    setEngine(newEng);
    syncGameState(newEng);
  };

  const handleUndo = () => {
    if (gameMode === 'ai') {
      // Undo both AI move and Player move
      engine.undo();
      engine.undo();
    } else {
      engine.undo();
    }
    setEngine(new GameEngine(engine.getFen()));
    syncGameState(engine);
  };

  const handleResign = () => {
    setIsGameOver(true);
    const winner = turn === 'w' ? 'Black (Tartarus)' : 'White (Olympus)';
    setGameResult(`${turn === 'w' ? 'White' : 'Black'} surrendered. ${winner} claims dominion!`);
    soundEngine.playDefeatSound();
  };

  const handleCopyPgn = () => {
    const history = engine.getHistory();
    // format into pairs
    let pgnStr = '';
    for (let i = 0; i < history.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      pgnStr += `${moveNum}. ${history[i]} ${history[i + 1] || ''} `;
    }
    navigator.clipboard.writeText(pgnStr.trim());
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  // Material evaluation and captured pieces
  const calculateCapturedPieces = () => {
    const startingCounts: Record<string, number> = {
      p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
    };
    const currentCountsWhite: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    const currentCountsBlack: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

    const board = engine.getBoard();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          if (piece.color === 'w') {
            currentCountsWhite[piece.type] = (currentCountsWhite[piece.type] || 0) + 1;
          } else {
            currentCountsBlack[piece.type] = (currentCountsBlack[piece.type] || 0) + 1;
          }
        }
      }
    }

    const capturedByWhite: PieceType[] = [];
    const capturedByBlack: PieceType[] = [];

    (['q', 'r', 'b', 'n', 'p'] as PieceType[]).forEach((t) => {
      const lostBlack = Math.max(0, startingCounts[t] - (currentCountsBlack[t] || 0));
      for (let i = 0; i < lostBlack; i++) capturedByWhite.push(t);

      const lostWhite = Math.max(0, startingCounts[t] - (currentCountsWhite[t] || 0));
      for (let i = 0; i < lostWhite; i++) capturedByBlack.push(t);
    });

    const pieceScores: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const whitePoints = capturedByWhite.reduce((sum, p) => sum + (pieceScores[p] || 0), 0);
    const blackPoints = capturedByBlack.reduce((sum, p) => sum + (pieceScores[p] || 0), 0);

    return {
      capturedByWhite,
      capturedByBlack,
      advantage: whitePoints - blackPoints
    };
  };

  const { capturedByWhite, capturedByBlack, advantage } = calculateCapturedPieces();

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Top Game Settings & Opponent Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#121217] border border-amber-500/30 rounded-2xl p-4 shadow-xl">
        {/* Game Mode Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setGameMode('ai')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-cinzel text-xs font-bold transition-all cursor-pointer ${
              gameMode === 'ai'
                ? 'bg-amber-400 text-black gold-glow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-amber-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>VS GOD AI</span>
          </button>

          <button
            onClick={() => setGameMode('pass-and-play')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-cinzel text-xs font-bold transition-all cursor-pointer ${
              gameMode === 'pass-and-play'
                ? 'bg-amber-400 text-black gold-glow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-amber-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>PASS & PLAY</span>
          </button>
        </div>

        {/* AI Persona Selector (if in AI mode) */}
        {gameMode === 'ai' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['minotaur', 'ares', 'athena', 'zeus'] as AIDifficulty[]).map((key) => {
              const p = AI_PERSONAS[key];
              const isSelected = selectedAI === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAI(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 text-amber-300 border-2 border-amber-400 gold-glow-sm font-bold'
                      : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:border-amber-500/40'
                  }`}
                >
                  <span>{p.avatarIcon}</span>
                  <span>{p.name}</span>
                  <span className="text-[10px] text-amber-500/70 font-mono">({p.rating})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Chessboard + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Board Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Top Opponent Status Bar */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-3 py-2 bg-neutral-900/90 border border-amber-500/20 rounded-xl mb-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-amber-500/30 flex items-center justify-center text-lg">
                {gameMode === 'ai' ? persona.avatarIcon : '💀'}
              </div>
              <div>
                <div className="font-cinzel font-bold text-amber-300 flex items-center gap-1.5">
                  <span>{gameMode === 'ai' ? persona.name : 'Tartarus Host'}</span>
                  {gameMode === 'ai' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                      {persona.rating} ELO
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {isThinking ? (
                    <span className="text-amber-400 animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Consulting the Delphic Fates...
                    </span>
                  ) : (
                    <span>{gameMode === 'ai' ? persona.playstyle : 'Player 2'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Captured Pieces by Black */}
            <div className="flex items-center gap-1">
              {capturedByBlack.slice(0, 7).map((t, idx) => (
                <div key={idx} className="w-5 h-5 opacity-70">
                  <ChessPieceSvg type={t} color="w" />
                </div>
              ))}
              {advantage < 0 && (
                <span className="text-amber-400 font-mono text-xs font-bold ml-1">
                  +{Math.abs(advantage)}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Chessboard */}
          <ChessBoard
            board={engine.getBoard()}
            turn={turn}
            isCheck={isCheck}
            isGameOver={isGameOver}
            onMove={handlePlayerMove}
            getLegalMoves={(sq) => engine.getLegalMoves(sq)}
            onCapture={onCapture}
            playerColor={playerColor}
            flipped={isFlipped}
          />

          {/* Bottom Player Status Bar */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-3 py-2 bg-neutral-900/90 border border-amber-500/20 rounded-xl mt-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <div className="font-cinzel font-bold text-amber-300">
                  Olympian Commander (You)
                </div>
                <div className="text-[10px] text-neutral-400">
                  Defending Mount Olympus
                </div>
              </div>
            </div>

            {/* Captured Pieces by White */}
            <div className="flex items-center gap-1">
              {capturedByWhite.slice(0, 7).map((t, idx) => (
                <div key={idx} className="w-5 h-5 opacity-70">
                  <ChessPieceSvg type={t} color="b" />
                </div>
              ))}
              {advantage > 0 && (
                <span className="text-amber-400 font-mono text-xs font-bold ml-1">
                  +{advantage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Move History, Controls, Lore Banner */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Game Status Alert (Check / Checkmate / Victory) */}
          {isGameOver && (
            <div className="bg-gradient-to-r from-amber-950 via-[#1a1407] to-amber-950 border-2 border-amber-400 rounded-2xl p-5 gold-glow text-center animate-in fade-in zoom-in-95">
              <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <h3 className="font-cinzel text-xl font-bold text-amber-300 mb-1">
                {gameResult}
              </h3>
              <p className="text-xs text-neutral-300 mb-4">
                The battle of Mount Olympus has concluded. The decrees of fate are sealed.
              </p>
              <button
                onClick={handleNewGame}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-cinzel font-bold text-xs rounded-xl shadow-lg gold-glow-sm cursor-pointer"
              >
                START A NEW DIVINE CLASH
              </button>
            </div>
          )}

          {isCheck && !isGameOver && (
            <div className="bg-red-950/60 border-2 border-red-500/80 rounded-xl p-3.5 flex items-center gap-3 text-red-200 text-xs animate-pulse">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <strong className="font-cinzel font-bold text-red-300 block">
                  KING UNDER SIEGE (CHECK)!
                </strong>
                The sovereign monarch must be defended immediately!
              </div>
            </div>
          )}

          {/* Quick Actions Toolbar */}
          <div className="grid grid-cols-4 gap-2 bg-[#121217] border border-amber-500/30 rounded-xl p-2">
            <button
              onClick={handleUndo}
              disabled={isGameOver || isThinking || engine.getHistory().length === 0}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
              title="Undo Move"
            >
              <Undo2 className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-cinzel">Undo</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
              title="Flip Board View"
            >
              <RefreshCw className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-cinzel">Flip</span>
            </button>

            <button
              onClick={handleResign}
              disabled={isGameOver || isThinking}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
              title="Resign Match"
            >
              <Flag className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-cinzel">Resign</span>
            </button>

            <button
              onClick={handleNewGame}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
              title="Restart Match"
            >
              <RotateCcw className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-cinzel">Restart</span>
            </button>
          </div>

          {/* Move History / Delphic Scroll */}
          <div className="bg-[#121217] border border-amber-500/30 rounded-2xl p-4 shadow-lg flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
              <h4 className="font-cinzel text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <span>📜 DELPHIC MOVE CHRONICLE</span>
              </h4>
              <button
                onClick={handleCopyPgn}
                className="flex items-center gap-1 text-[10px] font-cinzel text-neutral-400 hover:text-amber-300 cursor-pointer"
                title="Copy PGN"
              >
                {copiedPgn ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPgn ? 'COPIED' : 'COPY PGN'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[200px] space-y-1 pr-1 font-mono text-xs">
              {engine.getHistory().length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-500 text-xs italic font-serif">
                  Awaiting first strike of Olympus...
                </div>
              ) : (
                Array.from({ length: Math.ceil(engine.getHistory().length / 2) }).map((_, i) => {
                  const whiteMove = engine.getHistory()[i * 2];
                  const blackMove = engine.getHistory()[i * 2 + 1];

                  return (
                    <div
                      key={i}
                      className="grid grid-cols-12 py-1 px-2 rounded hover:bg-neutral-800/60 transition-colors text-neutral-300"
                    >
                      <span className="col-span-2 text-amber-500/60 font-cinzel">
                        {i + 1}.
                      </span>
                      <span className="col-span-5 font-semibold text-amber-300">
                        {whiteMove}
                      </span>
                      <span className="col-span-5 text-neutral-400">
                        {blackMove || '...'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Flavor Persona Quote Box */}
          {gameMode === 'ai' && (
            <div className="bg-neutral-900/90 border-l-4 border-amber-400 p-4 rounded-xl text-xs space-y-1">
              <div className="font-cinzel font-bold text-amber-400 flex items-center gap-2">
                <span>{persona.avatarIcon} {persona.name.toUpperCase()} SAYS:</span>
              </div>
              <p className="text-neutral-300 italic font-serif">
                "{persona.flavorQuote}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
