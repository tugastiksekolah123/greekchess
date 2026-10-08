import React, { useState, useRef, useEffect } from 'react';
import { Square, Move } from 'chess.js';
import { PieceColor, PieceType, GOD_ROSTER, CaptureEvent } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { soundEngine } from '../services/soundEngine';

interface ChessBoardProps {
  board: ({ square: Square; type: PieceType; color: PieceColor } | null)[][];
  turn: PieceColor;
  isCheck: boolean;
  isGameOver: boolean;
  onMove: (from: Square, to: Square, promotion?: PieceType) => boolean;
  getLegalMoves: (square: Square) => Move[];
  onCapture: (event: CaptureEvent) => void;
  playerColor?: PieceColor;
  flipped?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  turn,
  isCheck,
  isGameOver,
  onMove,
  getLegalMoves,
  onCapture,
  playerColor = 'w',
  flipped = false
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Files and ranks
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = flipped ? [...files].reverse() : files;
  const displayRanks = flipped ? [...ranks].reverse() : ranks;

  // Clear selection if turn changes or game ends
  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [turn, isGameOver]);

  const handleSquareClick = (square: Square, r: number, c: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (isGameOver) return;

    // If waiting for promotion selection, do nothing
    if (pendingPromotion) return;

    // Check if clicking a legal destination
    if (selectedSquare) {
      const matchedMove = legalMoves.find((m) => m.to === square);

      if (matchedMove) {
        // Check if pawn promotion
        const pieceOnSource = getPieceAt(selectedSquare);
        const isPromotion = pieceOnSource?.type === 'p' && (square.endsWith('8') || square.endsWith('1'));

        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        executeMove(selectedSquare, square, matchedMove, e);
        return;
      }
    }

    // Select piece
    const piece = getPieceAt(square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      const moves = getLegalMoves(square);
      setLegalMoves(moves);
      soundEngine.playMoveSound();
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = (from: Square, to: Square, matchedMove: Move, e?: React.MouseEvent) => {
    const movingPiece = getPieceAt(from);
    const targetPiece = getPieceAt(to);

    const success = onMove(from, to, 'q');
    if (success) {
      setLastMove({ from, to });
      setSelectedSquare(null);
      setLegalMoves([]);

      // If capture occurred, calculate target square screen coordinates
      if (targetPiece || matchedMove.captured) {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (e && e.currentTarget) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if (boardRef.current) {
          // Calculate from square position
          const boardRect = boardRef.current.getBoundingClientRect();
          const colIdx = displayFiles.indexOf(to[0]);
          const rowIdx = displayRanks.indexOf(to[1]);
          if (colIdx >= 0 && rowIdx >= 0) {
            const squareSize = boardRect.width / 8;
            x = boardRect.left + colIdx * squareSize + squareSize / 2;
            y = boardRect.top + rowIdx * squareSize + squareSize / 2;
          }
        }

        const attackerGod = GOD_ROSTER[`${movingPiece?.color || 'w'}-${movingPiece?.type || 'p'}`];
        const victimGod = GOD_ROSTER[`${targetPiece?.color || (movingPiece?.color === 'w' ? 'b' : 'w')}-${targetPiece?.type || matchedMove.captured || 'p'}`];

        onCapture({
          id: `${Date.now()}-${from}-${to}`,
          attacker: {
            color: movingPiece?.color || 'w',
            type: movingPiece?.type || 'p',
            god: attackerGod
          },
          victim: {
            color: targetPiece?.color || (movingPiece?.color === 'w' ? 'b' : 'w'),
            type: targetPiece?.type || (matchedMove.captured as PieceType) || 'p',
            god: victimGod
          },
          square: to,
          x,
          y,
          timestamp: Date.now(),
          quote: attackerGod?.quote || 'By the power of Olympus!'
        });

        soundEngine.playCaptureSound(targetPiece?.type === 'q' || targetPiece?.type === 'r');
      } else {
        soundEngine.playMoveSound();
      }
    }
  };

  const handlePromotionSelect = (promotionPiece: PieceType) => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    const movingPiece = getPieceAt(from);
    const targetPiece = getPieceAt(to);

    const success = onMove(from, to, promotionPiece);
    if (success) {
      setLastMove({ from, to });
      if (targetPiece) {
        soundEngine.playCaptureSound(true);
      } else {
        soundEngine.playMoveSound();
      }
    }
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const getPieceAt = (square: Square) => {
    const file = square.charCodeAt(0) - 97;
    const rank = 8 - parseInt(square[1], 10);
    return board[rank]?.[file] || null;
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[560px] mx-auto">
      {/* Ancient Hellenic Outer Meander Frame */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#18181b] via-[#0f0f12] to-[#09090b] border-2 border-amber-500/40 shadow-2xl gold-glow-sm w-full">
        
        {/* Greek Meander Decorative Header Banner */}
        <div className="flex items-center justify-between mb-2.5 px-2 text-xs font-cinzel text-amber-400/80 tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-300">✦</span>
            <span>MOUNT OLYMPUS ARENA</span>
          </span>
          <span className="text-amber-500/70 tracking-widest text-[10px]">
            {turn === 'w' ? '⚡ ZEUS & OLYMPIANS TURN' : '💀 HADES & TARTARUS TURN'}
          </span>
        </div>

        {/* The 8x8 Chessboard Grid */}
        <div
          ref={boardRef}
          className="relative aspect-square w-full grid grid-cols-8 grid-rows-8 border-2 border-amber-600/60 rounded-lg overflow-hidden shadow-inner"
        >
          {displayRanks.map((rank, rowIdx) =>
            displayFiles.map((file, colIdx) => {
              const square = `${file}${rank}` as Square;
              const isDarkSquare = (rowIdx + colIdx) % 2 === 1;
              const piece = getPieceAt(square);
              const isSelected = selectedSquare === square;
              const isLegalDestination = legalMoves.some((m) => m.to === square);
              const isCaptureSquare = isLegalDestination && (piece !== null || legalMoves.some((m) => m.to === square && m.captured));
              const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
              const isCheckKingSquare = isCheck && piece?.type === 'k' && piece?.color === turn;

              // Square background styling (Olympian Gold & Obsidian Marble)
              const squareBg = isDarkSquare
                ? 'bg-[#181619] hover:bg-[#231f24]'
                : 'bg-[#2a2622] hover:bg-[#342f2b]';

              return (
                <div
                  key={square}
                  onClick={(e) => handleSquareClick(square, rowIdx, colIdx, e)}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${squareBg} ${
                    isSelected ? 'ring-2 ring-inset ring-amber-400 bg-amber-950/40' : ''
                  } ${
                    isLastMoveSquare ? 'bg-amber-900/30' : ''
                  } ${
                    isCheckKingSquare ? 'ring-2 ring-red-500 bg-red-950/60 animate-pulse' : ''
                  }`}
                  data-square={square}
                >
                  {/* Classical Coordinate Markings */}
                  {colIdx === 0 && (
                    <span className="absolute top-1 left-1.5 text-[9px] font-cinzel font-bold text-amber-500/40 pointer-events-none">
                      {rank}
                    </span>
                  )}
                  {rowIdx === 7 && (
                    <span className="absolute bottom-0.5 right-1.5 text-[9px] font-cinzel font-bold text-amber-500/40 pointer-events-none">
                      {file.toUpperCase()}
                    </span>
                  )}

                  {/* Chess Piece with Greek God SVG */}
                  {piece && (
                    <div className="w-[84%] h-[84%] flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                      <ChessPieceSvg
                        type={piece.type}
                        color={piece.color}
                        className={isCheckKingSquare ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}
                      />
                    </div>
                  )}

                  {/* Legal Move Indicators */}
                  {isLegalDestination && !isCaptureSquare && (
                    <div className="absolute w-3.5 h-3.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_#facc15] pointer-events-none animate-pulse" />
                  )}

                  {/* Capture Target Indicator (Glowing Spartan Reticle) */}
                  {isCaptureSquare && (
                    <div className="absolute inset-1 rounded-md border-2 border-red-500/90 bg-red-500/15 pointer-events-none flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Meander Border & Status */}
        <div className="mt-3 flex items-center justify-between text-xs px-2 font-cinzel text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#facc15]" />
            <span className="text-amber-300 font-semibold">White (Olympians)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-semibold">Black (Tartarus)</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-neutral-700 border border-amber-500/40" />
          </div>
        </div>
      </div>

      {/* Pawn Promotion Modal (Ascension of the Spartan) */}
      {pendingPromotion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border-2 border-amber-500 rounded-2xl p-6 max-w-sm w-full text-center gold-glow">
            <h3 className="font-cinzel text-xl text-amber-400 font-bold mb-1">
              ASCENSION OF OLYMPUS
            </h3>
            <p className="text-xs text-neutral-300 mb-6 font-sans">
              A champion has reached the sacred threshold. Choose their divine reincarnation:
            </p>

            <div className="grid grid-cols-4 gap-3">
              {[
                { type: 'q' as PieceType, label: 'Athena', sub: 'Queen' },
                { type: 'r' as PieceType, label: 'Temple', sub: 'Rook' },
                { type: 'b' as PieceType, label: 'Apollo', sub: 'Bishop' },
                { type: 'n' as PieceType, label: 'Pegasus', sub: 'Knight' }
              ].map((promo) => (
                <button
                  key={promo.type}
                  onClick={() => handlePromotionSelect(promo.type)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-950/30 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 mb-1 group-hover:scale-110 transition-transform">
                    <ChessPieceSvg type={promo.type} color={turn} />
                  </div>
                  <span className="font-cinzel text-xs font-bold text-amber-300">{promo.label}</span>
                  <span className="text-[10px] text-neutral-400">{promo.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
