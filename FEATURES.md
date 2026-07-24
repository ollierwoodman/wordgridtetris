# Blockle — Feature Reference

A comprehensive list of Blockle's features, organized by area. Compiled from the
actual implementation in `src/`.

> **Accuracy notes**
> - There is **no service worker or web app manifest** in the repo, so the
>   README's "PWA / offline play" claim is not currently implemented.
> - The puzzle-generation pipeline (bitboards, constraint propagation, etc.) is
>   **offline tooling** that produces the shipped solution files — it does not run
>   in the player's browser.

---

## Core Gameplay
- **Tetris-meets-words puzzle**: drag tetris-style pieces (I, O, T, S, Z, L, J) into a central grid so each row spells a valid word.
- **Pieces come pre-rotated** — no rotation needed; players only translate pieces into place.
- **Order-independent solving**: completion checks that the set of formed rows matches the solution set, so words can be placed in any row order.
- **Empty tiles**: grids that don't divide evenly into 4-block pieces have locked "empty" tiles whose letters stay hidden until the puzzle is solved (e.g. 5×5 and 7×7 each have one).
- **Single guaranteed solution** per puzzle (enforced by the generation system).

## Game Modes (4 enabled, 17 configured)
- **Difficulty by grid size**: 5×5, 6×6, 7×7 (English, themed word sets).
- **Languages**: English and Chinese (成语/chengyu). French, German, Russian, Spanish and Vietnamese word lists still ship but their modes are disabled — hidden from puzzle select, and their URLs serve the 404 page.
- **Chengyu mode**: a special 8×8 layout built as **four separate 4×4 quadrants**, filling in 16 four-character Chinese idioms.
- Each mode has its own display name, description, and dedicated URL path.

## Daily Puzzle System
- **New puzzle every day**, deterministic and identical for all players.
- **Seeded generation**: seed built from a per-mode prefix + the calendar date (e.g. `eng5-2026-6-28`); a seeded RNG picks the word set and piece layout.
- Word lists are normalized (uppercased) and shuffled per-seed.

## Special-Date / Holiday Content
- **Custom themed puzzles + greetings** for ~25 special dates (English 5×5/6×6/7×7 only), including New Year, Groundhog Day, Pizza Day, Valentine's, Women's Day, Pi Day, St. Patrick's, World Poetry Day, April Fool's, Earth Day, May the 4th, Chocolate Day, Beer Day, Cat/Dog Day, Day of Peace, World Heart Day, Coffee Day, Teachers' Day, Halloween, and Christmas Eve/Day.
- A festive **greeting message** displays in the footer on those dates.

## Controls & Input
- **Touch / mouse**: tap to select, drag-and-drop pieces, tap empty space to deselect.
- **Drag affordances**: live "ghost" preview of where the piece will land, plus a **grace region** (1.5-tile snap radius) that snaps to the nearest valid position if you drop slightly off.
- **Keyboard**: arrow keys move the selected piece; spacebar cycles through pieces.
- **Collision & bounds checking** so pieces can't overlap or leave the grid; pointer-capture handling for smooth dragging.
- Pieces are auto-scattered around the perimeter, kept out of the solution area at start.

## Visual Feedback
- **12 distinct piece colors** mapped to piece types, with light/dark variants.
- **Validity indicators while dragging**: green ring + circle icon for a valid drop, red ring + X icon for invalid.
- **Selected-piece dot**, locked-tile lock icon, and shaded out-of-solution border tiles.
- Responsive tile sizing and gap scaling based on grid size.

## Hint System
- **Five hint types**, each individually revealable:
  1. **Theme** of the puzzle (when a theme exists)
  2. **Empty tile position** (also blocks pieces from overlapping it once revealed)
  3. **Empty tile letter**
  4. **First piece location** — snaps and **locks** the first piece in place (can't be moved/selected)
  5. **First word**
- Hints are conditionally available (theme/empty-tile hints only appear when relevant).
- Hint usage is counted and surfaced in shared results.

## Player Aids
- **Shuffle / reset pieces** to new random perimeter positions.
- **Give up** (with confirmation modal) — reveals the solution and marks the day's puzzle as given-up.
- **Dev-only "Solve" button** (visible only in development builds).

## Completion & Celebration
- **Confetti burst** on completion, with **score-based color tiers** (gray → green → blue → purple → gold) computed from completion time and fraction of hints used.
- **Completion sound** and **timer auto-stops**.
- Empty tile letters revealed on solve.

## Statistics & Progress Tracking
- Persistent stats stored in localStorage (per puzzle: date, mode, seed, theme, time, moves, hints used, gave-up flag).
- **Stats dashboard** showing:
  - Today's completion status
  - Total puzzles solved
  - **Current streak** and **best streak** (consecutive days)
  - **Fastest times** per mode (bar chart)
  - **Fewest moves** per mode
  - **Puzzles-by-mode** breakdown
- **Clear all statistics** (with confirmation).
- Empty-state handling and given-up puzzles excluded from positive stats.

## Live In-Game Stats
- **Move counter** and **live elapsed timer** (animated spinning clock that stops on completion).

## Sharing
- **Results card** summarizing today's puzzles per mode (completed time + moves + hints, or "Gave up", or a "Play this mode" shortcut).
- **Copy to clipboard** and **native Web Share API** (when supported), with **toast notifications**.
- Context-aware share URL (`blockle.au` or `/chengyu`).
- "New since completion" **badge** on the share button; "come back tomorrow" vs "complete all of today's puzzles" messaging.

## Audio
- **Seven sound effects**: menu click, drag/move, drop-success, drop-fail, hint reveal, level complete, level up — with per-sound volume/playback tuning.
- **Global mute toggle**, persisted; mute state shared via React context.

## Theming
- **Light / Dark / System** themes with a cycle button.
- **System preference detection** with live updates when the OS theme changes.
- Inline pre-paint script prevents flash-of-wrong-theme; dynamic `theme-color` meta for browser chrome.

## Navigation & Routing
- **Client-side routing**: each mode has a clean URL; deep-linkable.
- **Browser back/forward** support and base-path redirect (`/` → `/5x5`).
- **Custom 404 page** for invalid URLs with a way back into the game.

## Onboarding & Menus
- **Tutorial** auto-shown on first visit (with an attention badge), including an **animated puzzle demo** and dynamic per-mode instructions.
- **Modal/dialog system** with: Menu, Settings, Stats, About, Hints, Share, Puzzle Select.
- **Puzzle Select** organized by language category.
- **About**: author link, "Buy me a boba" support link, Discord community link, GitHub/version link.

## Privacy & Analytics
- **Umami** analytics — cookieless, no personal data collected, self-hosted.
- **Named custom events** with event data: dialog opens, puzzle selections and completions (per mode), shuffles, hint reveals, and result shares/copies.
- **Declarative link tracking** via `data-umami-event` on the support and Discord links.

## Persistence
- localStorage for mute, theme, tutorial-seen, and completed puzzles.
- **Cross-tab synchronization** via storage events.

## SEO / Social
- Full **Open Graph + Twitter Card** meta, keywords, robots/language meta, favicon, and social share image.

## Puzzle Generation System (offline tooling)
Pre-generation pipeline (not run in the browser) that produces the shipped solution files:
- **Piece combination generator**, **constraint propagation**, **backtracking search with placement ordering**.
- **Bitboard representation** for fast collision/validation.
- **Symmetry breaking** + **canonical solution detection** to eliminate duplicates.
- **Region validation & pruning** (connected-component analysis) to kill impossible states early.
- **Progress tracking** for long generation runs.
- Ships **1,200+ pre-generated piece-solution JSON files** across 4×4–7×7, plus word lists per language.

## Tech Stack
- **React 19 + TypeScript**, **Vite 7**, **Tailwind CSS 4**, `lucide-react` icons, `use-sound`, `react-confetti-boom`, `sonner` toasts. Tests via **Vitest**.
