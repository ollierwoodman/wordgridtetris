# Blockle

A daily word puzzle game that combines tetris pieces with word formation. Drag and drop tetris-like pieces to form themed horizontal words on a grid.

[Play Blockle](https://blockle.au)

## Game Concept

Blockle presents players with a puzzle challenge: arrange classic tetris pieces (I, O, T, S, Z, L, J) on a grid to form horizontal words. Each puzzle features:

- Multiple difficulty levels: 5×5, 6×6, and 7×7 grids
- Themed word sets: All words in each puzzle relate to a common theme
- Daily puzzles: New challenges every day with special content for holidays

## How to Play

1. Drag and drop tetris pieces from around the grid into the central solution area
2. Form horizontal words - each row should spell out a valid word
3. Discover the theme - tap the theme card to reveal the connection between words
4. Complete the puzzle - fill all rows to see your completion stats

## Features

### Puzzle Generation

- Algorithms generate thousands of unique piece placement combinations
- Constraint satisfaction ensures every puzzle has exactly one valid solution
- Symmetry breaking reduces computational complexity while maintaining variety
- Bitboard optimization enables rapid puzzle validation and generation

### User Experience

- Sound effects for interactions (drag, drop, success, failure)
- Animations with completion celebrations
- Responsive design that works on all devices
- Dark/light themes with system preference detection

### Progress Tracking

- Daily completion streaks
- Performance statistics including completion times per difficulty
- Achievement system with progress indicators
- Historical puzzle replay

### Special Date Content

The game features custom puzzle content for special occasions:

- New Year's Day - celebration-themed words
- Groundhog Day - movie reference puzzles
- Valentine's Day, Pi Day, Earth Day - and other holidays
- Custom greetings and themed word sets for special dates

### Controls & Accessibility

- Multiple input methods:
  - Touch/mouse: Tap and drag pieces
  - Keyboard: Arrow keys to move, spacebar to cycle through pieces
- Visual feedback with color-coded validity indicators
- High contrast mode support
- Sound toggle options

### Technical Implementation

#### Puzzle Generation System

The game uses a multi-layered approach:

1. Piece Combination Generator: Creates diverse sets of tetris pieces for each puzzle size
2. Constraint Propagation: Ensures pieces can form valid word patterns
3. Backtracking Search: Finds valid piece placements efficiently
4. Canonical Solution Detection: Eliminates duplicate solutions through symmetry analysis
5. Region Validation: Prevents impossible puzzle states through connected component analysis

#### Performance Optimizations

- Bitboard representation for collision detection
- Early pruning algorithms reduce search space
- Parallel processing during puzzle pre-generation
- Progressive web app capabilities for offline play

## Technical Stack

- React 19 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Custom game engine with puzzle generation algorithms
- useSound for audio

## Project Structure

```md
src/
├── components/          # React UI components
│   ├── DialogContents/  # Modal content (About, Stats, Tutorial, etc.)
│   └── ui/             # Reusable UI elements
├── game/               # Core game logic
│   ├── logic.ts        # Main game state management
│   ├── pieceDefs.ts    # Tetris piece definitions
│   └── puzzle/         # Puzzle generation system
│       ├── pieceSolutionSearch/  # Generate puzzle solutions
├── hooks/              # Custom React hooks to handle a variety of game related logic
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/ollierwoodman/wordgridtetris.git
cd wordgridtetris

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally
- `npm run test` - Run test suite
