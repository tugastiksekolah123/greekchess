import React from 'react';
import { PieceColor, PieceType } from '../types/chess';

interface ChessPieceSvgProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
  size?: number | string;
}

export const ChessPieceSvg: React.FC<ChessPieceSvgProps> = ({
  type,
  color,
  className = '',
  size = '100%'
}) => {
  const isWhite = color === 'w';

  // Palette: Yellow/Gold for White (Olympus), Obsidian Black & Blood Gold for Black (Tartarus)
  const primaryFill = isWhite ? '#fef08a' : '#1c1917';
  const secondaryFill = isWhite ? '#eab308' : '#0c0a09';
  const strokeColor = isWhite ? '#ca8a04' : '#eab308';
  const accentGold = isWhite ? '#facc15' : '#fbbf24';
  const highlightColor = isWhite ? '#ffffff' : '#ef4444';

  const renderContent = () => {
    switch (type) {
      case 'k': // King: Zeus (White) vs Hades (Black)
        if (isWhite) {
          // ZEUS - Supreme King of Olympus with Thunderbolt & Crown
          return (
            <g>
              {/* Divine Aura */}
              <circle cx="50" cy="50" r="42" fill="none" stroke={accentGold} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Olympian Robe Base */}
              <path d="M22 84 C28 72, 72 72, 78 84 C76 89, 24 89, 22 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Torso & Armor */}
              <path d="M30 74 L34 50 L66 50 L70 74 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Zeus Head & Majestic Beard */}
              <circle cx="50" cy="40" r="14" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <path d="M40 43 C42 56, 58 56, 60 43 C56 50, 44 50, 40 43 Z" fill={isWhite ? '#ffffff' : '#27272a'} stroke={strokeColor} strokeWidth="1.5" />
              {/* Royal Laurel & Crown */}
              <path d="M36 34 L50 20 L64 34 L58 37 L50 26 L42 37 Z" fill={accentGold} stroke={strokeColor} strokeWidth="2" />
              <circle cx="50" cy="18" r="3" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
              {/* Iconic Zeus Thunderbolt in Center */}
              <path d="M48 52 L54 60 L49 61 L55 72 L45 63 L50 62 Z" fill="#ffffff" stroke={accentGold} strokeWidth="1.5" />
            </g>
          );
        } else {
          // HADES - Lord of the Underworld with Bident & Helm of Darkness
          return (
            <g>
              {/* Chthonic Rune Ring */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.4" />
              {/* Underworld Robes */}
              <path d="M20 85 C26 70, 74 70, 80 85 C76 90, 24 90, 20 85 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Obsidian Armor */}
              <path d="M28 74 L33 48 L67 48 L72 74 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Spiked Dark Helm of Darkness */}
              <path d="M34 44 C34 30, 66 30, 66 44 L62 50 L38 50 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <path d="M32 30 L40 18 L46 30 L50 14 L54 30 L60 18 L68 30 Z" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
              {/* Glowing Underworld Eyes */}
              <ellipse cx="44" cy="42" rx="2.5" ry="1.5" fill={highlightColor} />
              <ellipse cx="56" cy="42" rx="2.5" ry="1.5" fill={highlightColor} />
              {/* Hades Bident (Two-pronged Spear) Crest */}
              <path d="M45 54 L45 72 M55 54 L55 72 M45 64 L55 64 M50 64 L50 78" stroke={accentGold} strokeWidth="2" strokeLinecap="round" />
            </g>
          );
        }

      case 'q': // Queen: Athena / Hera (White) vs Persephone / Medusa (Black)
        if (isWhite) {
          // ATHENA & HERA - Goddess of Wisdom, War Strategy & Olympian Crown
          return (
            <g>
              {/* Radiance */}
              <circle cx="50" cy="48" r="41" fill="none" stroke={accentGold} strokeWidth="1" strokeDasharray="4 2" opacity="0.7" />
              {/* Gown & Aegis Mantle */}
              <path d="M22 84 C26 66, 74 66, 78 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <path d="M34 68 L36 46 L64 46 L66 68 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Face & Slender Features */}
              <ellipse cx="50" cy="38" rx="11" ry="12" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Corinthian War Tiara & Athena Crest */}
              <path d="M33 30 L40 16 L50 25 L60 16 L67 30 L60 34 L50 28 L40 34 Z" fill={accentGold} stroke={strokeColor} strokeWidth="2" />
              <circle cx="40" cy="14" r="2.5" fill="#ffffff" />
              <circle cx="50" cy="22" r="3" fill="#ffffff" />
              <circle cx="60" cy="14" r="2.5" fill="#ffffff" />
              {/* Gorgoneion / Owl of Athena Brooch */}
              <circle cx="50" cy="56" rx="6" ry="6" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
              <circle cx="47" cy="55" r="1.5" fill="#000000" />
              <circle cx="53" cy="55" r="1.5" fill="#000000" />
            </g>
          );
        } else {
          // PERSEPHONE & MEDUSA - Queen of Underworld & Gorgon Fury
          return (
            <g>
              <circle cx="50" cy="48" r="41" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              {/* Dark Velveteen Shroud */}
              <path d="M22 85 C27 65, 73 65, 78 85 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Corset & Pomegranate Emblem */}
              <path d="M33 68 L36 46 L64 46 L67 68 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              <ellipse cx="50" cy="38" rx="11" ry="12" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Serpent Tendrils / Gorgon Crown */}
              <path d="M32 26 C28 14, 40 10, 44 20 C48 10, 56 12, 58 20 C64 12, 72 16, 68 28 Z" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
              {/* Crimson Eyes */}
              <ellipse cx="45" cy="38" rx="2" ry="1.5" fill={highlightColor} />
              <ellipse cx="55" cy="38" rx="2" ry="1.5" fill={highlightColor} />
              {/* Pomegranate Ruby Scepter Motif */}
              <circle cx="50" cy="58" r="5" fill="#ef4444" stroke={accentGold} strokeWidth="1.5" />
            </g>
          );
        }

      case 'r': // Rook: Temple of Olympus (White) vs Gates of Tartarus (Black)
        if (isWhite) {
          // TEMPLE OF OLYMPUS / HEPHAESTUS - Doric Columns & Sanctuary
          return (
            <g>
              {/* Stylobate (Temple Base) */}
              <rect x="20" y="76" width="60" height="10" rx="2" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <rect x="24" y="70" width="52" height="6" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Fluted Classical Columns */}
              <rect x="26" y="38" width="8" height="32" rx="1" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              <rect x="40" y="38" width="8" height="32" rx="1" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              <rect x="54" y="38" width="8" height="32" rx="1" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              <rect x="66" y="38" width="8" height="32" rx="1" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Architrave & Entablature */}
              <rect x="22" y="32" width="56" height="6" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Classical Greek Pediment (Triangle Roof) with Battlement Notch */}
              <path d="M18 32 L50 14 L82 32 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <circle cx="50" cy="24" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
            </g>
          );
        } else {
          // GATES OF TARTARUS - Obsidian Spired Fortress
          return (
            <g>
              <rect x="20" y="76" width="60" height="10" rx="2" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Dark Tower Body */}
              <path d="M26 76 L30 36 L70 36 L74 76 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Spiked Abyssal Battlements */}
              <path d="M24 36 L24 22 L34 22 L34 28 L44 22 L56 22 L66 28 L66 22 L76 22 L76 36 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Adamantine Gate Arch */}
              <path d="M40 76 L40 54 C40 48, 60 48, 60 54 L60 76 Z" fill="#000000" stroke={accentGold} strokeWidth="2" />
              {/* Chains motif */}
              <line x1="32" y1="42" x2="32" y2="66" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="68" y1="42" x2="68" y2="66" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3 2" />
            </g>
          );
        }

      case 'b': // Bishop: Apollo (White) vs Ares (Black)
        if (isWhite) {
          // APOLLO - Sun God, Golden Lyre & Celestial Halo
          return (
            <g>
              {/* Sun Ray Halo */}
              <circle cx="50" cy="40" r="28" fill="none" stroke={accentGold} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Toga Base */}
              <path d="M26 84 C30 70, 70 70, 74 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Robe */}
              <path d="M34 72 L38 46 L62 46 L66 72 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Mitre / Sacred Headdress */}
              <path d="M38 46 C36 28, 50 18, 50 18 C50 18, 64 28, 62 46 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Golden Sun Symbol on Mitre */}
              <circle cx="50" cy="33" r="5" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
              <line x1="50" y1="24" x2="50" y2="21" stroke={accentGold} strokeWidth="2" />
              <line x1="50" y1="42" x2="50" y2="45" stroke={accentGold} strokeWidth="2" />
              <line x1="41" y1="33" x2="38" y2="33" stroke={accentGold} strokeWidth="2" />
              <line x1="59" y1="33" x2="62" y2="33" stroke={accentGold} strokeWidth="2" />
              {/* Lyre String lines below */}
              <line x1="44" y1="56" x2="44" y2="68" stroke={strokeColor} strokeWidth="1" />
              <line x1="48" y1="54" x2="48" y2="70" stroke={strokeColor} strokeWidth="1" />
              <line x1="52" y1="54" x2="52" y2="70" stroke={strokeColor} strokeWidth="1" />
              <line x1="56" y1="56" x2="56" y2="68" stroke={strokeColor} strokeWidth="1" />
            </g>
          );
        } else {
          // ARES - God of Savage War, Crested Helmet & Spear
          return (
            <g>
              <path d="M26 84 C30 70, 70 70, 74 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <path d="M34 72 L36 48 L64 48 L66 72 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Fierce Spartan War Helmet */}
              <path d="M36 48 L36 32 C36 22, 64 22, 64 32 L64 48 L58 56 L42 56 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Transverse Red Crest of Ares */}
              <path d="M34 26 C34 12, 66 12, 66 26 Z" fill={highlightColor} stroke={accentGold} strokeWidth="2" />
              <circle cx="50" cy="14" r="3" fill={accentGold} />
              {/* T-shaped Corinthian Visor Eye Slits */}
              <path d="M42 40 L58 40 M50 40 L50 50" stroke={accentGold} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          );
        }

      case 'n': // Knight: Pegasus (White) vs Cerberus (Black)
        if (isWhite) {
          // PEGASUS - Divine Winged Stallion
          return (
            <g>
              {/* Base */}
              <path d="M24 84 C28 72, 72 72, 76 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Stallion Neck & Muscular Head */}
              <path d="M30 80 C28 60, 36 34, 46 26 C52 20, 62 18, 68 28 C74 36, 68 44, 60 48 L70 58 C62 62, 54 62, 50 60 L48 80 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Proud Stallion Ear */}
              <path d="M60 20 L66 12 L70 22 Z" fill={accentGold} stroke={strokeColor} strokeWidth="2" />
              {/* Pegasus Feathered Wing Vaulting Skyward */}
              <path d="M44 48 C48 30, 66 24, 76 18 C78 28, 72 38, 66 44 C76 40, 82 46, 76 56 C70 64, 58 66, 44 48 Z" fill={primaryFill} stroke={accentGold} strokeWidth="2" />
              <circle cx="60" cy="32" r="2.5" fill="#ca8a04" />
            </g>
          );
        } else {
          // CERBERUS - Three-Headed Hound of Tartarus
          return (
            <g>
              <path d="M24 84 C28 72, 72 72, 76 84 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Central Fierce Hound Head */}
              <path d="M36 78 L38 48 C38 34, 62 34, 62 48 L64 78 Z" fill={secondaryFill} stroke={strokeColor} strokeWidth="2.5" />
              {/* Left Snarling Head */}
              <path d="M26 62 C22 46, 36 40, 42 50 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Right Snarling Head */}
              <path d="M74 62 C78 46, 64 40, 58 50 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Spiked Collars */}
              <rect x="32" y="66" width="36" height="5" rx="1" fill="#ca8a04" stroke="#eab308" strokeWidth="1.5" />
              {/* Glowing Red Eyes of the 3 Heads */}
              <circle cx="34" cy="48" r="1.5" fill={highlightColor} />
              <circle cx="45" cy="42" r="2" fill={highlightColor} />
              <circle cx="55" cy="42" r="2" fill={highlightColor} />
              <circle cx="66" cy="48" r="1.5" fill={highlightColor} />
            </g>
          );
        }

      case 'p': // Pawn: Spartan Hoplite (White) vs Tartarean Shade (Black)
        if (isWhite) {
          // SPARTAN HOPLITE - Bronze Phalanx Warrior with Shield & Crest
          return (
            <g>
              {/* Base */}
              <ellipse cx="50" cy="80" rx="20" ry="6" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Bronze Aspis Round Shield with Greek Lambda or Sun */}
              <circle cx="50" cy="54" r="18" fill={primaryFill} stroke={strokeColor} strokeWidth="2.5" />
              <circle cx="50" cy="54" r="13" fill={secondaryFill} stroke={accentGold} strokeWidth="1.5" />
              {/* Greek Lambda (Λ) on Shield */}
              <path d="M42 62 L50 44 L58 62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Hoplite Helmet Peak & Crest */}
              <circle cx="50" cy="26" r="9" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              <path d="M44 20 C44 14, 56 14, 56 20 Z" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
              <line x1="50" y1="14" x2="50" y2="8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            </g>
          );
        } else {
          // TARTAREAN SHADE - Cursed Shadow Warrior
          return (
            <g>
              <ellipse cx="50" cy="80" rx="20" ry="6" fill={secondaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Spectral Hood & Robe */}
              <path d="M32 78 C28 58, 72 58, 68 78 Z" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              <circle cx="50" cy="44" r="12" fill={primaryFill} stroke={strokeColor} strokeWidth="2" />
              {/* Shadow Hood Peak */}
              <path d="M38 42 C38 28, 50 20, 50 20 C50 20, 62 28, 62 42 Z" fill={secondaryFill} stroke={accentGold} strokeWidth="2" />
              {/* Spectral Eyes */}
              <circle cx="46" cy="42" r="1.5" fill={highlightColor} />
              <circle cx="54" cy="42" r="1.5" fill={highlightColor} />
              {/* Obsidian Blade */}
              <path d="M48 62 L52 62 L50 76 Z" fill={accentGold} stroke="#ca8a04" strokeWidth="1" />
            </g>
          );
        }

      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none filter drop-shadow-md transition-transform duration-200 hover:scale-105 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`glow-${type}-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {renderContent()}
    </svg>
  );
};
