import React from 'react';
import { Swords, BookOpen, Trophy, ShieldQuestion, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface NavbarProps {
  currentTab: 'game' | 'trials' | 'codex';
  setCurrentTab: (tab: 'game' | 'trials' | 'codex') => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0d]/95 backdrop-blur-md border-b border-amber-500/30 shadow-xl">
      {/* Top Greek Meander Fret Accent Line */}
      <div className="greek-border-top w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => setCurrentTab('game')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Crest: Zeus Lightning & Olympian Laurels */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md gold-glow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center text-amber-400 font-cinzel font-black text-xl">
              ⚡
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-black text-lg sm:text-xl text-amber-300 tracking-wider gold-text-glow">
                PANTHEON
              </span>
              <span className="font-cinzel text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-widest font-bold">
                CHESS
              </span>
            </div>
            <p className="text-[10px] font-cinzel text-neutral-400 tracking-widest uppercase hidden sm:block">
              Clash of Mount Olympus & Tartarus
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('game')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              currentTab === 'game'
                ? 'bg-amber-400 text-black gold-glow-sm'
                : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Battle of Gods</span>
            <span className="sm:hidden">Play</span>
          </button>

          <button
            onClick={() => setCurrentTab('trials')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              currentTab === 'trials'
                ? 'bg-amber-400 text-black gold-glow-sm'
                : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Labors of Heracles</span>
            <span className="sm:hidden">Trials</span>
          </button>

          <button
            onClick={() => setCurrentTab('codex')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              currentTab === 'codex'
                ? 'bg-amber-400 text-black gold-glow-sm'
                : 'text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">God Codex</span>
            <span className="sm:hidden">Codex</span>
          </button>

          <button
            onClick={onOpenRules}
            className="p-2 rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
            title="Sacred Rules of Olympus"
          >
            <ShieldQuestion className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
