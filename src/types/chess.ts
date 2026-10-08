export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface GodInfo {
  name: string;
  greekName: string;
  title: string;
  domain: string;
  symbol: string;
  lore: string;
  chessRole: string;
  quote: string;
}

export const GOD_ROSTER: Record<string, GodInfo> = {
  // White Pieces - Olympians
  'w-k': {
    name: 'Zeus',
    greekName: 'Ζεύς',
    title: 'King of Olympus & God of the Sky',
    domain: 'Thunder, Lightning, Justice & Hospitality',
    symbol: '⚡ Thunderbolt & Golden Eagle',
    lore: 'The supreme ruler of Mount Olympus who vanquished the Titans. His lightning bolt can strike anywhere on the mortal realm, yet his royal crown requires supreme vigilance.',
    chessRole: 'The King. The heart of Olympus. If Zeus falls, the heavens collapse into chaos.',
    quote: 'Hear my thunder, mortals, and bow before the decree of Olympus!'
  },
  'w-q': {
    name: 'Athena & Hera',
    greekName: 'Ἀθηνᾶ & Ἥρα',
    title: 'Goddess of Wisdom & Sovereign Queen',
    domain: 'Strategic Warfare, Wisdom, Royalty & Craft',
    symbol: '🛡️ Aegis Shield & Golden Scepter',
    lore: 'Athena leaped fully armored from Zeus’s forehead, embodying calculated battlefield intellect, while Queen Hera commands imperial authority over gods and men alike.',
    chessRole: 'The Queen. The most devastating force on the board, striking in all directions with peerless tactical foresight.',
    quote: 'War is won not by sheer brute strength, but by flawless design.'
  },
  'w-r': {
    name: 'Temple of Hephaestus',
    greekName: 'Ἥφαιστος',
    title: 'Citadel of Mount Olympus & Forge',
    domain: 'Divine Architecture, Fire & Metallurgy',
    symbol: '🏛️ Fluted Doric Pillars & Anvil',
    lore: 'Carved from sacred Pentelic marble and reinforced by the fire god Hephaestus, these Olympian bastions stand impenetrable across horizontal and vertical horizons.',
    chessRole: 'The Rook. Unyielding siege engines that control open files and castle to shield the King.',
    quote: 'Our foundations are anchored into the bedrock of eternity.'
  },
  'w-b': {
    name: 'Apollo',
    greekName: 'Ἀπόλλων',
    title: 'God of Light, Sun & Prophecy',
    domain: 'Music, Archery, Truth & Healing',
    symbol: '☀️ Golden Lyre & Sun Chariot',
    lore: 'Radiant son of Zeus whose golden arrows pierce across vast diagonals of the battlefield. Apollo sees the tapestry of fate before mortal eyes can perceive.',
    chessRole: 'The Bishop. Long-range divine archer controlling diagonal corridors of light or shadow.',
    quote: 'The golden arrows of Phoebus illuminate all darkness.'
  },
  'w-n': {
    name: 'Pegasus',
    greekName: 'Πήγασος',
    title: 'The Winged Stallion of the Heavens',
    domain: 'Flight, Springs & Divine Inspiration',
    symbol: '🪽 Celestial Wings & Golden Hooves',
    lore: 'Born from the sea foam and Medusa’s essence, this immortal steed vaults effortlessly over enemy battle lines, leaping beyond standard geometries.',
    chessRole: 'The Knight. The only piece capable of jumping over friend and foe in erratic L-shaped maneuvers.',
    quote: 'No mortal barrier can constrain wings forged in divine skies.'
  },
  'w-p': {
    name: 'Spartan Hoplite',
    greekName: 'Ὁπλίτης',
    title: 'Warrior of the Olympian Phalanx',
    domain: 'Courage, Discipline & Bronze Shields',
    symbol: '🛡️ Bronze Aspis & Dory Spear',
    lore: 'Disciplined warriors locked in bronze phalanx formation. One step at a time they march relentlessly forward, with the divine promise of ascension into Olympian glory.',
    chessRole: 'The Pawn. The soul of chess. Stepping forward into danger to capture diagonally and promote at the final rank.',
    quote: 'Come back with your shield, or on it.'
  },

  // Black Pieces - Chthonic & Underworld Titans
  'b-k': {
    name: 'Hades',
    greekName: 'ᾍδης',
    title: 'Lord of the Underworld & Tartarus',
    domain: 'The Dead, Mineral Wealth & The Unseen',
    symbol: '👑 Helm of Darkness & Bident',
    lore: 'Brother of Zeus and sovereign of the silent realm below. Wielder of the Helm of Darkness that renders him invisible, surrounded by the cold waters of the Styx.',
    chessRole: 'The Black King. Guarded by Tartarean horrors. His survival guarantees the dominion of night.',
    quote: 'All mortals eventually cross the River Styx. I merely wait.'
  },
  'b-q': {
    name: 'Persephone & Medusa',
    greekName: 'Περσεφόνη & Μέδουσα',
    title: 'Queen of the Underworld & Gorgon Terror',
    domain: 'Spring, Death, Petrifying Gaze & Serpent Fury',
    symbol: '🐍 Gorgoneion & Pomegranate',
    lore: 'Reigning over the shadowy halls of Tartarus alongside serpents whose single gaze turns mortal warriors to stone, sweeping across ranks and files without mercy.',
    chessRole: 'The Black Queen. Lethal chthonic monarch wielding catastrophic sweeping power.',
    quote: 'Look upon our gaze and be frozen in eternal granite.'
  },
  'b-r': {
    name: 'Gates of Tartarus',
    greekName: 'Τάρταρος',
    title: 'Abyssal Stronghold of the Titans',
    domain: 'Eternal Imprisonment & Shadow Chasm',
    symbol: '⛓️ Adamantine Chains & Iron Gates',
    lore: 'Surrounded by a triple wall of bronze and nocturnal gloom, Tartarus holds ancient titan monsters locked behind adamantine gates.',
    chessRole: 'The Black Rook. Massive dark battle towers that dominate ranks and open files.',
    quote: 'Once these adamantine gates swing open, oblivion marches forth.'
  },
  'b-b': {
    name: 'Ares',
    greekName: 'Ἄρης',
    title: 'God of Brutal Warfare & Bloodshed',
    domain: 'Carnage, Battle Frenzy & War Dogs',
    symbol: '⚔️ Blood-stained Spear & Crested Helmet',
    lore: 'The untamed tempest of violent conflict. Ares revels in clashing bronze and crimson fields, cutting through ranks along fierce diagonal avenues of destruction.',
    chessRole: 'The Black Bishop. Aggressive zealot striking deep into the enemy lines.',
    quote: 'Let the earth drink blood and the skies echo with the clash of bronze!'
  },
  'b-n': {
    name: 'Cerberus',
    greekName: 'Κέρβερος',
    title: 'Three-Headed Hound of the River Styx',
    domain: 'Guarding the Underworld Gates & Serpent Tails',
    symbol: '🐕 Triple Fangs & Iron Collars',
    lore: 'The fearsome beast with three razor-fanged heads and a tail of serpents. He lunges through unexpected blind spots, snapping at Olympian intruders.',
    chessRole: 'The Black Knight. Unpredictable hunter leaping over defenders to execute deadly forks.',
    quote: 'None may escape the triple jaws of the underworld.'
  },
  'b-p': {
    name: 'Tartarean Shade',
    greekName: 'Σκιά',
    title: 'Wraith of the Underworld Host',
    domain: 'Shadows, Cold Vengeance & Asphodel Fields',
    symbol: '🗡️ Obsidian Dagger & Shroud',
    lore: 'Lost souls summoned from the Asphodel Meadows, cloaked in mist and seeking vengeance. They march silently in formation toward resurrection.',
    chessRole: 'The Black Pawn. Spectral foot soldiers advancing toward promotion into underworld terror.',
    quote: 'We were legions once, and we shall rise again.'
  }
};

export type AIDifficulty = 'minotaur' | 'ares' | 'athena' | 'zeus';

export interface AIPersonality {
  id: AIDifficulty;
  name: string;
  greekName: string;
  title: string;
  rating: number;
  avatarIcon: string;
  description: string;
  flavorQuote: string;
  depth: number;
  playstyle: string;
  accentColor: string;
}

export const AI_PERSONAS: Record<AIDifficulty, AIPersonality> = {
  minotaur: {
    id: 'minotaur',
    name: 'The Minotaur',
    greekName: 'Μινώταυρος',
    title: 'Beast of the Knossos Labyrinth',
    rating: 800,
    avatarIcon: '🐂',
    description: 'A raging beast that attacks recklessly. Prone to blundering into clever tactical traps.',
    flavorQuote: 'ROAARRR! None escape the labyrinth alive!',
    depth: 1,
    playstyle: 'Wild & Aggressive (Novice)',
    accentColor: '#f97316'
  },
  ares: {
    id: 'ares',
    name: 'Ares',
    greekName: 'Ἄρης',
    title: 'God of Savage War',
    rating: 1350,
    avatarIcon: '⚔️',
    description: 'Obsessed with capturing enemy pieces and launching fierce direct attacks against your king.',
    flavorQuote: 'Peace is for the weak! Let steel meet bone!',
    depth: 2,
    playstyle: 'Fierce Attacker (Intermediate)',
    accentColor: '#ef4444'
  },
  athena: {
    id: 'athena',
    name: 'Athena',
    greekName: 'Ἀθηνᾶ',
    title: 'Goddess of Strategic Warfare & Wisdom',
    rating: 1750,
    avatarIcon: '🦉',
    description: 'Masters positional control, center dominance, and multi-move defensive maneuvers.',
    flavorQuote: 'Strategy triumphs where brute fury falters.',
    depth: 3,
    playstyle: 'Positional Tactician (Advanced)',
    accentColor: '#38bdf8'
  },
  zeus: {
    id: 'zeus',
    name: 'Zeus',
    greekName: 'Ζεύς',
    title: 'Supreme Sovereign of Mount Olympus',
    rating: 2200,
    avatarIcon: '⚡',
    description: 'Commands the board with divine foresight. Punishes every tactical inaccuracy with lightning.',
    flavorQuote: 'Witness the majesty of Olympus. Checkmate is inevitable.',
    depth: 4,
    playstyle: 'Olympian Grandmaster (Master)',
    accentColor: '#eab308'
  }
};

export interface MythPuzzle {
  id: string;
  laborNumber: number;
  title: string;
  mythLore: string;
  objective: string;
  fen: string;
  solutionMoves: string[]; // in SAN e.g. ["Qxf7#"] or algebraic ["f3f7"]
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Heroic';
}

export const HERCULES_TRIALS: MythPuzzle[] = [
  {
    id: 'trial-1',
    laborNumber: 1,
    title: 'Slaying the Nemean Lion',
    mythLore: 'Heracles corners the golden-furred beast whose skin repels bronze weapons. Strike with an irresistible decisive blow!',
    objective: 'White to move — Mate in 1 (Smite the trapped King)',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
    solutionMoves: ['Qxf7#'],
    explanation: 'Zeus’s Queen strikes f7 directly, protected by the Olympian Bishop on c4. The Lion King has nowhere to escape!',
    difficulty: 'Easy'
  },
  {
    id: 'trial-2',
    laborNumber: 2,
    title: 'The Lernean Hydra’s Heart',
    mythLore: 'For every head severed, two grow in its place. You must land a stunning back-rank strike to cauterize the beast forever.',
    objective: 'White to move — Mate in 1 (Back-Rank Annihilation)',
    fen: '6k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1',
    solutionMoves: ['Qe8#'],
    explanation: 'The Queen charges down the e-file to e8. The Hydra King is suffocated behind his own pawns on the back rank!',
    difficulty: 'Easy'
  },
  {
    id: 'trial-3',
    laborNumber: 3,
    title: 'Capture of the Golden Hind',
    mythLore: 'The sacred stag of Artemis runs with unmatched swiftness. Heracles must execute a divine royal fork to corner it.',
    objective: 'White to move — Fork King & Queen with Pegasus',
    fen: 'r3k2r/ppp2ppp/8/4q3/3N4/8/PPP2PPP/R2Q1RK1 w kq - 0 14',
    solutionMoves: ['Re1'],
    explanation: 'White plays Re1! Pinning the Black Queen to the undefended King on e8. Artemis’s prize is won without bloodshed!',
    difficulty: 'Medium'
  },
  {
    id: 'trial-4',
    laborNumber: 4,
    title: 'The Erymanthian Boar Trap',
    mythLore: 'Lure the ferocious beast into the deep snowdrifts of Mount Erymanthos to restrict its movement.',
    objective: 'White to move — Mate in 1 (Bishop Diagonal Sniping)',
    fen: 'r1b1k2r/pppp1ppp/8/4P3/1b1q4/2N5/PPPB1PPP/R2QKB1R w KQkq - 0 9',
    solutionMoves: ['Qe2'],
    explanation: 'Safeguarding the e-pawn while cementing control over the central corridor.',
    difficulty: 'Medium'
  },
  {
    id: 'trial-5',
    laborNumber: 5,
    title: 'Stymphalian Birds Smothered Mate',
    mythLore: 'Bronze-beaked birds shooting deadly feathers. Trap their sovereign in a claustrophobic cage of his own troops!',
    objective: 'White to move — Mate in 1 (Smothered Mate by Pegasus)',
    fen: '6rk/5Npp/8/8/8/8/8/6K1 w - - 0 1',
    solutionMoves: ['Nh6#'], // variation
    explanation: 'The classic smothered mate: Pegasus lands delivering checkmate while the King is entombed by his own soldiers!',
    difficulty: 'Heroic'
  },
  {
    id: 'trial-6',
    laborNumber: 6,
    title: 'The Golden Apples of Hesperides',
    mythLore: 'At the edge of the world, Atlas holds the heavens. Deliver the ultimate Olympian Queen sacrifice to win immortal glory!',
    objective: 'White to move — Deliver Anastasias Mate',
    fen: '5rk1/5ppp/8/8/8/1N6/4QPPP/2R3K1 w - - 0 1',
    solutionMoves: ['Qe7'],
    explanation: 'Dominating the seventh rank and suffocating all underworld counter-play.',
    difficulty: 'Heroic'
  }
];

export interface CaptureEvent {
  id: string;
  attacker: {
    color: PieceColor;
    type: PieceType;
    god: GodInfo;
  };
  victim: {
    color: PieceColor;
    type: PieceType;
    god: GodInfo;
  };
  square: string; // e.g. "e4"
  x: number;
  y: number;
  timestamp: number;
  quote: string;
}
