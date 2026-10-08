import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#070709] border-t border-amber-500/30 text-neutral-400 text-xs">
      <div className="greek-border-top w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-cinzel font-bold text-base text-amber-300">
                PANTHEON CHESS
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              An authentic Greek mythology chess battle simulator blending classical FIDE chess rules with the pantheon of Mount Olympus, animated lightning captures, and Web Audio ancient lyre music.
            </p>
          </div>

          {/* Olympian Domain */}
          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-amber-400 tracking-wider">
              OLYMPIAN REALM
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Zeus — Sovereign of Sky & Lightning</li>
              <li>Athena — Strategy & Wise Warfare</li>
              <li>Apollo — Light, Lyre & Prophecy</li>
              <li>Pegasus — Celestial Winged Stallion</li>
              <li>Hephaestus — Divine Bastions of Fire</li>
            </ul>
          </div>

          {/* Underworld Domain */}
          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-amber-400 tracking-wider">
              CHTHONIC TITANS
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Hades — Monarch of the Underworld</li>
              <li>Persephone & Medusa — Queen & Gorgon</li>
              <li>Ares — Savage Blood & War Frenzy</li>
              <li>Cerberus — Three-Headed Styx Hound</li>
              <li>Gates of Tartarus — Abyssal Prison</li>
            </ul>
          </div>

          {/* Delphic Inscription */}
          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-amber-400 tracking-wider">
              DELPHIC MAXIMS
            </h4>
            <div className="p-3 rounded-lg bg-neutral-900 border border-amber-500/20 text-neutral-300 italic font-serif">
              "ΓΝΩΘΙ ΣΕΑΥΤΟΝ"<br />
              <span className="text-amber-400 text-[11px] not-italic font-cinzel">Know Thyself.</span><br />
              Every move on the sacred board reflects the soul's virtue and courage.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Pantheon Chess: Clash of Olympus. Crafted with yellow & black Hellenic accents.</p>
          <div className="flex items-center gap-4 font-cinzel text-amber-500/80">
            <span>OLYMPUS</span>
            <span>•</span>
            <span>DELPHI</span>
            <span>•</span>
            <span>SPARTA</span>
            <span>•</span>
            <span>TARTARUS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
