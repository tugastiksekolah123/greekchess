import { Chess, Square, Move } from 'chess.js';
import { AIDifficulty, PieceColor, PieceType } from '../types/chess';

// Piece value mapping in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Positional Piece-Square Tables (White perspective - flip for Black)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
   20,  20,   0,   0,   0,   0,  20,  20,
   20,  30,  10,   0,   0,  10,  30,  20
];

export class GameEngine {
  private game: Chess;

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  public getGame(): Chess {
    return this.game;
  }

  public getFen(): string {
    return this.game.fen();
  }

  public reset(fen?: string) {
    if (fen) {
      this.game.load(fen);
    } else {
      this.game.reset();
    }
  }

  public getTurn(): PieceColor {
    return this.game.turn() as PieceColor;
  }

  public isGameOver(): boolean {
    return this.game.isGameOver();
  }

  public isCheck(): boolean {
    return this.game.inCheck();
  }

  public isCheckmate(): boolean {
    return this.game.isCheckmate();
  }

  public isDraw(): boolean {
    return this.game.isDraw();
  }

  public isStalemate(): boolean {
    return this.game.isStalemate();
  }

  public getHistory(): string[] {
    return this.game.history();
  }

  public getBoard() {
    return this.game.board();
  }

  public undo(): Move | null {
    return this.game.undo();
  }

  public getLegalMoves(square: Square): Move[] {
    return this.game.moves({ square, verbose: true }) as Move[];
  }

  public makeMove(from: Square, to: Square, promotion: PieceType = 'q'): Move | null {
    try {
      const move = this.game.move({
        from,
        to,
        promotion
      });
      return move;
    } catch {
      return null;
    }
  }

  /**
   * Static board evaluation from White's perspective
   */
  public evaluateBoard(chess: Chess): number {
    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = PIECE_VALUES[piece.type] || 0;
        let positionalVal = 0;
        const squareIndex = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;

        switch (piece.type) {
          case 'p':
            positionalVal = PAWN_TABLE[squareIndex];
            break;
          case 'n':
            positionalVal = KNIGHT_TABLE[squareIndex];
            break;
          case 'b':
            positionalVal = BISHOP_TABLE[squareIndex];
            break;
          case 'r':
            positionalVal = ROOK_TABLE[squareIndex];
            break;
          case 'q':
            positionalVal = QUEEN_TABLE[squareIndex];
            break;
          case 'k':
            positionalVal = KING_TABLE[squareIndex];
            break;
        }

        const totalPieceScore = val + positionalVal;
        if (piece.color === 'w') {
          score += totalPieceScore;
        } else {
          score -= totalPieceScore;
        }
      }
    }

    return score;
  }

  /**
   * Greek God AI Move Search
   */
  public computeBestMove(difficulty: AIDifficulty): Move | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return null;

    // MINOTAUR: Novice wild player
    if (difficulty === 'minotaur') {
      // 30% chance completely random move, 70% greedy capture or check
      if (Math.random() < 0.35) {
        return moves[Math.floor(Math.random() * moves.length)];
      }
      // Prioritize capture if exists
      const captures = moves.filter((m) => m.captured);
      if (captures.length > 0) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // ARES: Fierce Attacker (Depth 2 + attack bias)
    if (difficulty === 'ares') {
      let bestMove = moves[0];
      let bestEval = this.game.turn() === 'w' ? -Infinity : Infinity;

      for (const move of moves) {
        this.game.move(move);
        let currentEval = this.minimax(this.game, 1, -Infinity, Infinity, this.game.turn() === 'w');
        
        // Ares bonus for violent captures and giving check
        if (move.captured) {
          currentEval += (this.game.turn() === 'w' ? 40 : -40);
        }
        if (this.game.inCheck()) {
          currentEval += (this.game.turn() === 'w' ? 60 : -60);
        }

        this.game.undo();

        if (this.game.turn() === 'b') {
          if (currentEval < bestEval) {
            bestEval = currentEval;
            bestMove = move;
          }
        } else {
          if (currentEval > bestEval) {
            bestEval = currentEval;
            bestMove = move;
          }
        }
      }
      return bestMove;
    }

    // ATHENA: Strategic Positional (Depth 3 Alpha-Beta)
    if (difficulty === 'athena') {
      return this.findBestAlphaBetaMove(3);
    }

    // ZEUS: Supreme Olympian Grandmaster (Depth 4 Alpha-Beta)
    return this.findBestAlphaBetaMove(4);
  }

  private findBestAlphaBetaMove(depth: number): Move | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return null;

    const isMaximizing = this.game.turn() === 'w';
    let bestVal = isMaximizing ? -Infinity : Infinity;
    let bestMoves: Move[] = [];

    // Move ordering: captures first to improve alpha-beta cutoff efficiency
    moves.sort((a, b) => {
      const scoreA = (a.captured ? PIECE_VALUES[a.captured] || 0 : 0);
      const scoreB = (b.captured ? PIECE_VALUES[b.captured] || 0 : 0);
      return scoreB - scoreA;
    });

    for (const move of moves) {
      this.game.move(move);
      const value = this.minimax(this.game, depth - 1, -Infinity, Infinity, !isMaximizing);
      this.game.undo();

      if (isMaximizing) {
        if (value > bestVal) {
          bestVal = value;
          bestMoves = [move];
        } else if (value === bestVal) {
          bestMoves.push(move);
        }
      } else {
        if (value < bestVal) {
          bestVal = value;
          bestMoves = [move];
        } else if (value === bestVal) {
          bestMoves.push(move);
        }
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)] || moves[0];
  }

  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (chess.isCheckmate()) {
      return isMaximizing ? -99999 + (10 - depth) : 99999 - (10 - depth);
    }
    if (chess.isDraw() || chess.isStalemate()) {
      return 0;
    }
    if (depth <= 0) {
      return this.evaluateBoard(chess);
    }

    const moves = chess.moves({ verbose: true }) as Move[];

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Beta cutoff
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha cutoff
      }
      return minEval;
    }
  }
}
