import React, { useState } from 'react';
import { GOD_ROSTER, GodInfo, PieceColor, PieceType } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { Shield, Sparkles, BookOpen, Crown, Zap, Flame, Eye } from 'lucide-react';

export const GodCodex: React.FC = () => {
  const [activeSide, setActiveSide] = useState<'olympians' | 'chthonic'>('olympians');
  const [selectedPieceKey, setSelectedPieceKey] = useState<string>('w-k');

  const currentGod: GodInfo = GOD_ROSTER[selectedPieceKey] || GOD_ROSTER['w-k'];
  const [selectedColor, selectedType] = selectedPieceKey.split('-') as [PieceColor, PieceType];

  const olympianKeys = ['w-k', 'w-q', 'w-r', 'w-b', 'w-n', 'w-p'];
  const chthonicKeys = ['b-k', 'b-q', 'b-r', 'b-b', 'b-n', 'b-p'];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-cinzel mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>HELLENIC ENCYCLOPEDIA & RESOURCES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-amber-300 mb-2 gold-text-glow">
          THE PANTHEON CODEX
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Explore the divine attributes, sacred symbols, mythological lore, and tactical chess battlefield roles of the Olympian Gods and Tartarean Titans.
        </p>
      </div>

      {/* Side Switcher (Olympians vs Tartarus) */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => {
            setActiveSide('olympians');
            setSelectedPieceKey('w-k');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel text-sm font-bold transition-all cursor-pointer ${
            activeSide === 'olympians'
              ? 'bg-amber-400 text-black gold-glow scale-105'
              : 'bg-[#18181f] text-amber-400/80 border border-amber-500/30 hover:border-amber-400'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>OLYMPIAN REALM (WHITE)</span>
        </button>

        <button
          onClick={() => {
            setActiveSide('chthonic');
            setSelectedPieceKey('b-k');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel text-sm font-bold transition-all cursor-pointer ${
            activeSide === 'chthonic'
              ? 'bg-red-950 text-amber-300 border-2 border-red-500 chthonic-glow scale-105'
              : 'bg-[#18181f] text-neutral-400 border border-neutral-700 hover:border-neutral-500'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>TARTARUS & CHTHONIC (BLACK)</span>
        </button>
      </div>

      {/* Main Layout: Piece Grid + Deep Lore Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* God Selector List */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          {(activeSide === 'olympians' ? olympianKeys : chthonicKeys).map((key) => {
            const god = GOD_ROSTER[key];
            const [c, t] = key.split('-') as [PieceColor, PieceType];
            const isSelected = selectedPieceKey === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedPieceKey(key)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 gold-glow-sm ring-1 ring-amber-400'
                    : 'bg-[#121217] border-neutral-800 hover:border-amber-500/50 hover:bg-[#181820]'
                }`}
              >
                <div className="w-12 h-12 shrink-0 p-1 rounded-lg bg-black/40 border border-amber-500/30 flex items-center justify-center">
                  <ChessPieceSvg type={t} color={c} />
                </div>
                <div className="min-w-0">
                  <div className="font-cinzel text-sm font-bold text-amber-300 truncate">
                    {god.name}
                  </div>
                  <div className="text-[10px] font-cinzel text-amber-500/70 truncate">
                    {god.greekName}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {god.chessRole.split('.')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Deity In-Depth Profile */}
        <div className="lg:col-span-7 bg-[#121217] border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Greek Watermark Background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 text-amber-500/5 select-none pointer-events-none">
            <ChessPieceSvg type={selectedType} color={selectedColor} />
          </div>

          <div className="relative z-10">
            {/* Top Deity Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-black/80 border-2 border-amber-500 p-2 gold-glow-sm shrink-0">
                  <ChessPieceSvg type={selectedType} color={selectedColor} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-2xl font-bold text-amber-300">
                      {currentGod.name}
                    </h3>
                    <span className="text-sm font-cinzel text-amber-500/80 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      {currentGod.greekName}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400 font-cinzel tracking-wide mt-0.5">
                    {currentGod.title}
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs font-cinzel shrink-0">
                {currentGod.symbol}
              </div>
            </div>

            {/* Quote Banner */}
            <blockquote className="p-3.5 rounded-xl bg-amber-950/20 border-l-4 border-amber-400 text-xs italic text-amber-100/90 mb-5 font-serif">
              "{currentGod.quote}"
            </blockquote>

            {/* Domain & Lore */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-cinzel font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Divine Realm & Domains
                </h4>
                <p className="text-neutral-300 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                  {currentGod.domain}
                </p>
              </div>

              <div>
                <h4 className="font-cinzel font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Mythological Legend
                </h4>
                <p className="text-neutral-300 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                  {currentGod.lore}
                </p>
              </div>

              <div>
                <h4 className="font-cinzel font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  Chess Battlefield Tactics
                </h4>
                <p className="text-neutral-200 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/30">
                  {currentGod.chessRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
