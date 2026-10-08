/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AudioPlayer } from './components/AudioPlayer';
import { GameView } from './components/GameView';
import { HerculesTrials } from './components/HerculesTrials';
import { GodCodex } from './components/GodCodex';
import { GameRulesModal } from './components/GameRulesModal';
import { VFXCanvas } from './components/VFXCanvas';
import { CaptureBanner } from './components/CaptureBanner';
import { Footer } from './components/Footer';
import { CaptureEvent } from './types/chess';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game' | 'trials' | 'codex'>('game');
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [captureEvent, setCaptureEvent] = useState<CaptureEvent | null>(null);

  const handleCapture = (event: CaptureEvent) => {
    setCaptureEvent(event);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col relative selection:bg-amber-400 selection:text-black">
      {/* Visual Effects Canvas Overlay (Zeus's Lightning, Gold Runes & Embers) */}
      <VFXCanvas captureEvent={captureEvent} boardRect={null} />

      {/* Battle Notification Banner */}
      <CaptureBanner captureEvent={captureEvent} />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Sub-Header Audio Soundtrack Player */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4 pb-2" aria-label="Ancient Greek Music Player">
        <AudioPlayer />
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full" id="main-content">
        {currentTab === 'game' && <GameView onCapture={handleCapture} />}
        {currentTab === 'trials' && <HerculesTrials />}
        {currentTab === 'codex' && <GodCodex />}
      </main>

      {/* Sacred Rules of Olympus Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
