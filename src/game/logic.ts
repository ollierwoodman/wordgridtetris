import { TETRIS_PIECE_SHAPES } from "./pieceDefs";
import type {
  Tile,
  Piece,
  PieceSolutionEntry,
  WordSolution,
  HintState,
} from "../types/game";
import {
  fetchRandomPieceSolution,
  fetchRandomWordSolution,
} from "./puzzle/random";
import { SeededRandom } from "../utils/random";
import { GAME_MODES, type GameMode } from "../types/gameMode";

export const SOLUTION_SIZES = [5, 6, 7, 8];

const NUMBER_BLOCK_PER_PIECE = 4;

export class Game {
  private mode: GameMode;
  private seed: string;
  private solutionSize: number;
  private gridSize: number;
  private solutionOffset: number;
  private numPieces: number;
  private numEmptyTiles: number;
  private wordSolution: WordSolution = { words: [], theme: "", greeting: undefined };
  private pieceSolution: PieceSolutionEntry[] = [];
  private grid: Tile[][] = [];
  private pieces: Piece[] = [];
  private selectedPieceIndex: number | null = null;
  private pieceRotationStates: number[]; // Track current rotation state for each piece
  private emptyTilePositions: { x: number; y: number }[] = [];
  private emptyTileLetters: string[] = [];
  private hintState: HintState = {
    firstPieceLocation: false,
    firstWord: false,
  };
  private numMoves = 0;
  private gaveUp = false;
  private gameStartTime: Date = new Date();
  private gameEndTime: Date | null = null;
  private initializationPromise: Promise<void>;

  constructor(mode: GameMode, seed: string) {
    this.mode = mode;
    this.seed = seed;
    this.solutionSize = GAME_MODES[mode].solutionSize;
    // For chengyu mode (8x8), use special grid sizing with middle column
    if (mode === GAME_MODES.chengyu.mode) {
      this.gridSize = 13;
      this.solutionOffset = 2;
    } else {
      this.gridSize = this.solutionSize + 4;
      this.solutionOffset = (this.gridSize - this.solutionSize) / 2;
    }
    this.numEmptyTiles = (this.solutionSize * this.solutionSize) % NUMBER_BLOCK_PER_PIECE;
    this.numPieces = (this.solutionSize * this.solutionSize - this.numEmptyTiles) / NUMBER_BLOCK_PER_PIECE;

    this.pieceRotationStates = new Array(this.numPieces).fill(0) as number[];

    // Initialize async data - this should be handled by the caller
    this.initializationPromise = this.initializeAsyncData(mode, seed)
      .then(([wordSolution, pieceSolution]) => {
        this.wordSolution = wordSolution;
        this.pieceSolution = pieceSolution;
        this.grid = this.initializeGrid();
        this.pieces = this.initializePieces();
        // Initialize rotation states only for valid pieces (pieceIndex >= 0)
        this.pieceRotationStates = this.pieceSolution
          .filter((pieceInSolution) => pieceInSolution.pieceIndex >= 0)
          .map((pieceInSolution) => pieceInSolution.rotation);
        this.placePieces();

        this.emptyTilePositions = this.pieceSolution
          .filter((pieceInSolution) => pieceInSolution.pieceIndex === -1)
          .map((pieceInSolution) => ({
            // For chengyu mode, coordinates are already in final grid positions
            x: this.solutionSize === 8 ? pieceInSolution.x : pieceInSolution.x + this.solutionOffset,
            y: this.solutionSize === 8 ? pieceInSolution.y : pieceInSolution.y + this.solutionOffset,
          }));

        this.emptyTileLetters = this.emptyTilePositions.map(
          (emptyTilePosition) => {
            if (mode === GAME_MODES.chengyu.mode) {
              // For chengyu mode, use the same mapping as getChengyuLetterAtPosition
              return this.getChengyuLetterAtPosition(emptyTilePosition.x, emptyTilePosition.y);
            } else {
              // Regular mode: convert back to solution coordinates (without offset)
              const solutionY = emptyTilePosition.y - this.solutionOffset;
              const solutionX = emptyTilePosition.x - this.solutionOffset;
              
              // Check bounds before accessing
              if (solutionY >= 0 && solutionY < this.wordSolution.words.length &&
                  solutionX >= 0 && solutionX < this.wordSolution.words[solutionY].length) {
                return this.wordSolution.words[solutionY].charAt(solutionX);
              }
              return ""; // Return empty string if out of bounds
            }
          }
        );

        // set hint state
        this.hintState.theme = this.wordSolution.theme !== "" ? false : undefined; // available if there is a theme
        this.hintState.emptyTilePosition = this.numEmptyTiles > 0 ? false : undefined; // available if there are empty tiles
        this.hintState.emptyTileLetter = this.numEmptyTiles > 0 ? false : undefined; // available if there are empty tiles
        this.hintState.firstPieceLocation = false; // always available
        this.hintState.firstWord = false; // always available
      })
      .catch((error: unknown) => {
        console.error(error);
        throw error;
      });
  }

  private async initializeAsyncData(
    mode: GameMode,
    seed: string
  ): Promise<[WordSolution, PieceSolutionEntry[]]> {
    return await Promise.all([
      fetchRandomWordSolution(mode, seed),
      fetchRandomPieceSolution(mode, seed),
    ]);
  }

  private initializeGrid(): Tile[][] {
    const grid: Tile[][] = [];
    for (let y = 0; y < this.gridSize; y++) {
      grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        grid[y][x] = {
          letter: "",
          x,
          y,
          isSelected: false,
        };
      }
    }
    return grid;
  }

  private initializePieces(): Piece[] {
    return this.pieceSolution
      .filter((pieceInSolution) => pieceInSolution.pieceIndex >= 0)
      .map((pieceInSolution) => {
        const { pieceIndex, rotation, x, y } = pieceInSolution;
        // pieceIndex in the solution refers to the piece type (0-6), not array index
        const blocks = TETRIS_PIECE_SHAPES[pieceIndex][rotation].map(
          (block) => {
            let letter = "";
            
            if (this.solutionSize === 8) {
              // For chengyu mode, convert grid coordinates to solution coordinates
              letter = this.getChengyuLetterAtPosition(x + block.x, y + block.y);
            } else {
              // Regular mode: treat words as rows
              letter = this.wordSolution.words[y + block.y]?.[x + block.x] || "";
            }
            
            return {
              ...block,
              letter,
            };
          }
        );
        return {
          type: pieceIndex,
          blocks,
          x,
          y,
          isSelected: false,
        };
      });
  }

  // Helper: get the letter at a grid position for chengyu mode
  private getChengyuLetterAtPosition(gridX: number, gridY: number): string {
    // Map grid coordinates to quadrant and local coordinates
    let quadrant: number;
    let localX: number, localY: number;
    
    // Determine which quadrant based on grid position
    if (gridX >= 2 && gridX < 6 && gridY >= 2 && gridY < 6) {
      // Top-left quadrant
      quadrant = 0;
      localX = gridX - 2; // 2-5 -> 0-3
      localY = gridY - 2; // 2-5 -> 0-3
    } else if (gridX >= 7 && gridX < 11 && gridY >= 2 && gridY < 6) {
      // Top-right quadrant
      quadrant = 1;
      localX = gridX - 7; // 7-10 -> 0-3
      localY = gridY - 2; // 2-5 -> 0-3
    } else if (gridX >= 2 && gridX < 6 && gridY >= 7 && gridY < 11) {
      // Bottom-left quadrant
      quadrant = 2;
      localX = gridX - 2; // 2-5 -> 0-3
      localY = gridY - 7; // 7-10 -> 0-3
    } else if (gridX >= 7 && gridX < 11 && gridY >= 7 && gridY < 11) {
      // Bottom-right quadrant
      quadrant = 3;
      localX = gridX - 7; // 7-10 -> 0-3
      localY = gridY - 7; // 7-10 -> 0-3
    } else {
      // Outside valid quadrants
      return "";
    }
    
    // Each quadrant has 4 words (rows), get the word for this row
    const wordIndex = quadrant * 4 + localY;
    if (wordIndex >= this.wordSolution.words.length) {
      return "";
    }
    
    const word = this.wordSolution.words[wordIndex];
    if (localX >= word.length) {
      return "";
    }
    
    return word.charAt(localX);
  }

  // Helper: check if a block is inside the solution grid
  private isInSolutionGrid(x: number, y: number): boolean {
    // Special handling for chengyu mode (8x8)
    if (this.solutionSize === 8) {
      // Check if in valid x range, excluding middle spacing column (x=5)
      const isInLeftHalf = x >= 1 && x < 5;  // columns 1-4
      const isInRightHalf = x >= 6 && x < 10; // columns 6-9
      const isInValidXRange = isInLeftHalf || isInRightHalf;
      
      // Check if in valid y range, excluding middle spacing row (y=5)
      const isInTopHalf = y >= 1 && y < 5;   // rows 1-4
      const isInBottomHalf = y >= 6 && y < 10; // rows 6-9
      const isInValidYRange = isInTopHalf || isInBottomHalf;
      
      return isInValidXRange && isInValidYRange;
    }
    
    // Regular mode logic
    return (
      x >= this.solutionOffset &&
      x < this.solutionOffset + this.solutionSize &&
      y >= this.solutionOffset &&
      y < this.solutionOffset + this.solutionSize
    );
  }

  // Helper: check if all blocks of a piece at (x, y) are outside the solution grid
  private areAllBlocksOutsideSolutionGrid(pieceIndex: number, x: number, y: number): boolean {
    const rotationState = this.pieceRotationStates[pieceIndex];
    const pieceType = this.pieces[pieceIndex].type;
    const pieceTemplate = TETRIS_PIECE_SHAPES[pieceType][rotationState];
    for (const block of pieceTemplate) {
      const blockX = x + block.x;
      const blockY = y + block.y;
      if (this.isInSolutionGrid(blockX, blockY)) {
        return false;
      }
    }
    return true;
  }

  private placePieces(shuffle = false): void {
    // If the first-piece location hint is revealed, keep the first piece fixed
    const isFirstPieceLocked = this.hintState.firstPieceLocation;

    // Move all pieces (except locked first piece) to temporary positions outside the grid to avoid initial collisions
    for (let i = 0; i < this.pieces.length; i++) {
      if (isFirstPieceLocked && i === 0) continue;
      this.setPiecePosition(i, -10, -10);
    }

    const randomHelper = new SeededRandom(new Date().getMilliseconds())
    // Build placement order, excluding the first piece when it is locked
    const placePieceOrder = Array.from({length: this.pieces.length}, (_, i) => i)
      .filter((i) => !(isFirstPieceLocked && i === 0));
    if (shuffle) {
      // Shuffle the pieces (excluding locked first piece)
      randomHelper.shuffle(placePieceOrder);
    }

    // Predefined positions spread across the grid to minimize collisions
    const placementPositions = new Array(this.gridSize * this.gridSize).fill(0).map((_, i) => ({ x: i % this.gridSize, y: Math.floor(i / this.gridSize) }));

    // Place each piece in the first available valid position
    for (const pieceIndex of placePieceOrder) {
      let placed = false;
      randomHelper.shuffle(placementPositions);
      // Try predefined positions first
      for (const pos of placementPositions) {
        if (
          this.isValidMoveInternal(pieceIndex, pos.x, pos.y) &&
          this.areAllBlocksOutsideSolutionGrid(pieceIndex, pos.x, pos.y)
        ) {
          this.setPiecePosition(pieceIndex, pos.x, pos.y);
          placed = true;
          break;
        }
      }

      // If predefined positions don't work, find any valid position
      if (!placed) {
        const safePosition = this.findSafePosition(pieceIndex);
        if (safePosition) {
          this.setPiecePosition(pieceIndex, safePosition.x, safePosition.y);
        } else {
          // Fallback to center position
          this.setPiecePosition(pieceIndex, Math.floor(this.gridSize / 2), Math.floor(this.gridSize / 2));
        }
      }
    }
  }

  // Find a safe position for a piece that doesn't collide with existing pieces
  private findSafePosition(
    pieceIndex: number
  ): { x: number; y: number } | null {
    const pieceType = this.pieces[pieceIndex].type;
    const rotationState = this.pieceRotationStates[pieceIndex];
    const pieceTemplate = TETRIS_PIECE_SHAPES[pieceType][rotationState];

    // Calculate valid placement bounds to keep all blocks within the grid
    let minX = 0;
    let minY = 0;
    let maxX = this.gridSize - 1;
    let maxY = this.gridSize - 1;

    for (const block of pieceTemplate) {
      minX = Math.max(minX, -block.x);
      minY = Math.max(minY, -block.y);
      maxX = Math.min(maxX, this.gridSize - 1 - block.x);
      maxY = Math.min(maxY, this.gridSize - 1 - block.y);
    }

    // Search for the first valid position within bounds
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (this.isValidMoveInternal(pieceIndex, x, y)) {
          return { x, y };
        }
      }
    }

    return null;
  }

  // Check if a piece is occupying the empty tile position
  private isPieceOccupyingEmptyTile(): {
    pieceIndex: number;
    blockIndex: number;
  }[] {
    return this.emptyTilePositions
      .map((emptyTile) => this.getPieceAtPosition(emptyTile.x, emptyTile.y))
      .filter((pieceAtEmptyTile) => pieceAtEmptyTile !== null);
  }

  // Move piece away from empty tile if it's occupying it
  // @ts-expect-error - may need in future
  private movePieceAwayFromEmptyTile(): boolean {
    const piecesAtEmptyTiles = this.isPieceOccupyingEmptyTile();

    const moved = piecesAtEmptyTiles.every((pieceAtEmptyTile) => {
      const safePosition = this.findSafePosition(pieceAtEmptyTile.pieceIndex);
      if (safePosition) {
        this.setPiecePosition(
          pieceAtEmptyTile.pieceIndex,
          safePosition.x,
          safePosition.y
        );
        return true;
      }
      return false;
    });
    return moved;
  }

  // Get current game state
  getGrid(): Tile[][] {
    return this.grid;
  }

  getPieces(): Piece[] {
    return this.pieces;
  }

  getSelectedPieceIndex(): number | null {
    return this.selectedPieceIndex;
  }

  // Select a piece
  selectPiece(pieceIndex: number): boolean {
    // If first-piece hint is revealed, the first piece is locked and cannot be selected
    if (this.hintState.firstPieceLocation && pieceIndex === 0) {
      return false;
    }
    if (pieceIndex >= 0 && pieceIndex < this.pieces.length) {
      // Deselect previously selected piece
      if (this.selectedPieceIndex !== null) {
        this.pieces[this.selectedPieceIndex].isSelected = false;
      }

      this.selectedPieceIndex = pieceIndex;
      this.pieces[pieceIndex].isSelected = true;
      return true;
    }
    return false;
  }

  // Deselect current piece
  deselectPiece(): void {
    if (this.selectedPieceIndex !== null) {
      this.pieces[this.selectedPieceIndex].isSelected = false;
      this.selectedPieceIndex = null;
    }
  }

  // Move selected piece
  movePiece(dx: number, dy: number): boolean {
    if (this.selectedPieceIndex === null) return false;
    // If first-piece hint is revealed, the first piece is locked and cannot be moved
    if (this.hintState.firstPieceLocation && this.selectedPieceIndex === 0) {
      return false;
    }

    const piece = this.pieces[this.selectedPieceIndex];
    const newX = piece.x + dx;
    const newY = piece.y + dy;

    // Check if move is valid
    if (this.isValidMove(this.selectedPieceIndex, newX, newY)) {
      piece.x = newX;
      piece.y = newY;
      return true;
    }
    return false;
  }

  // Check if a move is valid
  public isValidMove(pieceIndex: number, newX: number, newY: number): boolean {
    return this.isValidMoveInternal(pieceIndex, newX, newY);
  }

  private isValidMoveInternal(
    pieceIndex: number,
    newX: number,
    newY: number
  ): boolean {
    // Lock the first piece in place once its location hint is revealed
    if (this.hintState.firstPieceLocation && pieceIndex === 0) {
      return false;
    }
    const currentRotationState = this.pieceRotationStates[pieceIndex];
    const pieceType = this.pieces[pieceIndex].type;
    const pieceTemplate = TETRIS_PIECE_SHAPES[pieceType][currentRotationState];
    for (const block of pieceTemplate) {
      const blockX = newX + block.x;
      const blockY = newY + block.y;
      if (
        blockX < 0 ||
        blockX >= this.gridSize ||
        blockY < 0 ||
        blockY >= this.gridSize
      ) {
        return false;
      }
      // Disallow overlapping with revealed empty tile positions
      if (this.hintState.emptyTilePosition) {
        const overlapsEmptyTile = this.emptyTilePositions.some(
          (pos) => pos.x === blockX && pos.y === blockY
        );
        if (overlapsEmptyTile) {
          return false;
        }
      }
      if (this.wouldCollideWithPiece(blockX, blockY, pieceIndex)) {
        return false;
      }
    }
    return true;
  }

  // Check if a position would collide with any piece (excluding the specified piece)
  private wouldCollideWithPiece(
    x: number,
    y: number,
    excludePieceIndex: number
  ): boolean {
    for (let i = 0; i < this.pieces.length; i++) {
      if (i === excludePieceIndex) continue;

      const piece = this.pieces[i];
      const rotationState = this.pieceRotationStates[i];
      const pieceType = this.pieces[i].type;
      const blocks = TETRIS_PIECE_SHAPES[pieceType][rotationState];

      for (const block of blocks) {
        const blockX = piece.x + block.x;
        const blockY = piece.y + block.y;

        if (blockX === x && blockY === y) {
          return true;
        }
      }
    }
    return false;
  }

  // Get piece at specific grid position
  getPieceAtPosition(
    x: number,
    y: number
  ): { pieceIndex: number; blockIndex: number } | null {
    for (let pieceIndex = 0; pieceIndex < this.pieces.length; pieceIndex++) {
      const piece = this.pieces[pieceIndex];
      const currentRotationState = this.pieceRotationStates[pieceIndex];
      const pieceType = this.pieces[pieceIndex].type;
      const pieceTemplate =
        TETRIS_PIECE_SHAPES[pieceType][currentRotationState];

      for (
        let blockIndex = 0;
        blockIndex < pieceTemplate.length;
        blockIndex++
      ) {
        const block = pieceTemplate[blockIndex];
        const blockX = piece.x + block.x;
        const blockY = piece.y + block.y;

        if (blockX === x && blockY === y) {
          return { pieceIndex, blockIndex };
        }
      }
    }
    return null;
  }

  public getPieceByIndex(pieceIndex: number): Piece | null {
    return this.pieces[pieceIndex] || null;
  }

  public getPieceRotationState(pieceIndex: number): number {
    return this.pieceRotationStates[pieceIndex];
  }

  public setPiecePosition(pieceIndex: number, x: number, y: number): void {
    if (pieceIndex >= 0 && pieceIndex < this.pieces.length) {
      this.pieces[pieceIndex].x = x;
      this.pieces[pieceIndex].y = y;
    }
  }

  public solvePuzzle(): void {
    // If we have a pieceSolution, set each piece's position and rotation to match the solution
    if (this.pieceSolution.length > 0) {
      const validPieces = this.pieceSolution.filter(
        (pieceInSolution) => pieceInSolution.pieceIndex >= 0
      );
      for (let i = 0; i < validPieces.length; i++) {
        const entry = validPieces[i];
        const { rotation, x, y } = entry;
        // For chengyu mode, coordinates are already in final grid positions
        if (this.solutionSize === 8) {
          this.setPiecePosition(i, x, y);
        } else {
          this.setPiecePosition(i, x + this.solutionOffset, y + this.solutionOffset);
        }
        this.pieceRotationStates[i] = rotation || 0;
      }
    }
  }

  public getMode(): GameMode {
    return this.mode;
  }

  public getSeed(): string {
    return this.seed;
  }

  public getNumEmptyTiles(): number {
    return this.numEmptyTiles;
  }

  public getEmptyTilePositions(): { x: number; y: number }[] {
    return this.emptyTilePositions;
  }

  public getEmptyTileLetters(): string[] {
    return this.emptyTileLetters;
  }

  public getWordSolution(): WordSolution {
    return this.wordSolution;
  }

  public getWordTheme(): string {
    return this.wordSolution.theme;
  }

  public getGridSize(): number {
    return this.gridSize;
  }

  public getSolutionSize(): number {
    return this.solutionSize;
  }

  public getSolutionOffset(): number {
    return this.solutionOffset;
  }

  public getNumPieces(): number {
    return this.numPieces;
  }

  public getHintState(): HintState {
    return this.hintState;
  }

  public getNumHintsAvailable(): number {
    return Object.values(this.hintState).filter((value) => value !== undefined).length;
  }

  public getNumHintsUsed(): number {
    return Object.values(this.hintState).filter((value) => value === true).length;
  }
  
  public revealHintTheme(): string | null {
    if (this.hintState.theme == undefined) {
      return null;
    }
    
    this.hintState.theme = true;
    return this.wordSolution.theme;
  }

  public getHintTheme(): string | null {
    if (this.hintState.theme) {
      return this.wordSolution.theme;
    }
    return null;
  }

  public revealHintEmptyTilePosition(): { x: number; y: number } | null {
    if (this.hintState.emptyTilePosition == undefined) {
      return null;
    }
    
    this.hintState.emptyTilePosition = true;
    return this.emptyTilePositions[0];
  }

  public getHintEmptyTilePosition(): { x: number; y: number } | null {
    if (this.hintState.emptyTilePosition) {
      return this.emptyTilePositions[0];
    }
    return null;
  }

  public revealHintEmptyTileLetter(): string | null {
    if (this.hintState.emptyTileLetter == undefined) {
      return null;
    }
    
    this.hintState.emptyTileLetter = true;
    return this.emptyTileLetters[0];
  }

  public getHintEmptyTileLetter(): string | null {
    if (this.hintState.emptyTileLetter) {
      return this.emptyTileLetters[0];
    }
    return null;
  }
  
  public revealHintFirstPieceLocation(): { x: number; y: number } {
    const pieceSolution = this.pieceSolution[0];

    const isChengyuMode = this.mode === GAME_MODES.chengyu.mode;
    // In chengyu mode, pieceSolution coordinates are already in final grid
    // coordinates (including the visual spacing). Do not add solutionOffset.
    const targetPieceX = pieceSolution.x + (isChengyuMode ? 0 : this.solutionOffset);
    const targetPieceY = pieceSolution.y + (isChengyuMode ? 0 : this.solutionOffset);

    // move any pieces that would collide with the first piece outside the board
    const collidingPieces = [];
    for (const block of this.pieces[0].blocks) {
      const pieceAtPosition = this.getPieceAtPosition(targetPieceX + block.x, targetPieceY + block.y);
      if (pieceAtPosition && pieceAtPosition.pieceIndex !== 0) {
        collidingPieces.push(pieceAtPosition);
      }
    }

    for (const collidingPiece of collidingPieces) {
      this.setPiecePosition(collidingPiece.pieceIndex, -10 - 10 * collidingPiece.pieceIndex, -10 - 10 * collidingPiece.pieceIndex);
    }

    this.setPiecePosition(0, targetPieceX, targetPieceY);

    for (const collidingPiece of collidingPieces) {
      const safePosition = this.findSafePosition(collidingPiece.pieceIndex);
      if (safePosition) {
        this.setPiecePosition(collidingPiece.pieceIndex, safePosition.x, safePosition.y);
      } else {
        throw Error("No safe position found for colliding piece");
      }
    }

    this.hintState.firstPieceLocation = true;

    // For chengyu mode, coordinates are already in final grid positions
    if (isChengyuMode) {
      return { x: pieceSolution.x, y: pieceSolution.y };
    } else {
      return { x: pieceSolution.x + this.solutionOffset, y: pieceSolution.y + this.solutionOffset };
    }
  }

  public getHintFirstPieceLocation(): { x: number; y: number } | null {
    if (this.hintState.firstPieceLocation) {
      const pieceSolution = this.pieceSolution[0];
      // For chengyu mode, coordinates are already in final grid positions
      if (this.mode === GAME_MODES.chengyu.mode) {
        return { x: pieceSolution.x, y: pieceSolution.y };
      } else {
        return { x: pieceSolution.x + this.solutionOffset, y: pieceSolution.y + this.solutionOffset };
      }
    }
    return null;
  }
  
  public revealHintFirstWord(): string | null {
    this.hintState.firstWord = true;
    return this.wordSolution.words[0];
  }
  
  public getHintFirstWord(): string | null {
    if (this.hintState.firstWord) {
      return this.wordSolution.words[0];
    }
    return null;
  }

  public getNumMoves(): number {
    return this.numMoves;
  }

  public incrementNumMoves(): void {
    this.numMoves++;
  }

  public getGaveUp(): boolean {
    return this.gaveUp;
  }

  public setGaveUp(): void {
    this.gaveUp = true;
    this.setGameEndTime();
  }

  public getCompletionDurationMs(): number | null {
    if (this.gameEndTime) {
      return this.gameEndTime.getTime() - this.gameStartTime.getTime();
    }
    return null;
  }

  public setGameEndTime(): void {
    this.gameEndTime = new Date();
  }

  public getGameEndTime(): Date | null {
    return this.gameEndTime;
  }

  public getElapsedMs(): number {
    const endTime = this.gameEndTime ? this.gameEndTime.getTime() : Date.now();
    return Math.max(0, endTime - this.gameStartTime.getTime());
  }

  // Check if the puzzle is completed by verifying all solution words are present in any order
  public isPuzzleCompleted(): boolean {
    // Special handling for Chengyu mode (size 8)
    if (this.solutionSize === 8) {
      return this.isChengyuPuzzleCompleted();
    }
    
    const actualWordsSet = new Set<string>();
    const emptyTileX = this.emptyTilePositions[0]?.x || null;
    const emptyTileLetter = this.emptyTileLetters[0] || null;
    let emptyTileUsed = false;
    
    // Extract actual words from the grid (in the solution area)
    for (let y = 0; y < this.solutionSize; y++) {
      let word = "";
      for (let x = 0; x < this.solutionSize; x++) {
        const letter = this.getLetterAtPosition(x + this.solutionOffset, y + this.solutionOffset);
        if (letter !== "") {
          word += letter;
        } else if (x + this.solutionOffset === emptyTileX && !emptyTileUsed) {
          word += emptyTileLetter ?? "";
          emptyTileUsed = true;
        }
      }
      actualWordsSet.add(word);
    }

    // Check if sets match
    return this.wordSolution.words.every((word) => actualWordsSet.has(word));
  }

  // Check if the Chengyu puzzle is completed (4 separate 4x4 grids)
  private isChengyuPuzzleCompleted(): boolean {
    const actualWordsSet = new Set<string>();
    
    // Define the 4 quadrants with new layout: [startX, startY]
    // With middle spacing column and row, layout creates 4 separate 4x4 quadrants
    const quadrants = [
      [2, 2], // top-left (columns 2-5, rows 2-5)
      [7, 2], // top-right (columns 7-10, rows 2-5)
      [2, 7], // bottom-left (columns 2-5, rows 7-10)
      [7, 7], // bottom-right (columns 7-10, rows 7-10)
    ];
    
    // Check each quadrant (4x4 grid)
    for (const [startX, startY] of quadrants) {
      // Extract 4 words from this quadrant (4 rows)
      for (let row = 0; row < 4; row++) {
        let word = "";
        for (let col = 0; col < 4; col++) {
          const letter = this.getLetterAtPosition(startX + col, startY + row);
          word += letter;
        }
        if (word.length === 4) {
          actualWordsSet.add(word);
        }
      }
    }

    // Check if all expected chengyus are present
    return this.wordSolution.words.every((word) => actualWordsSet.has(word));
  }

  // Helper method to get the letter at a specific grid position
  private getLetterAtPosition(x: number, y: number): string {
    // Check if there's a piece at this position
    const pieceAtPosition = this.getPieceAtPosition(x, y);

    if (pieceAtPosition) {
      const { pieceIndex, blockIndex } = pieceAtPosition;
      const piece = this.pieces[pieceIndex];
      return piece.blocks[blockIndex].letter;
    }

    // Check if this is the empty tile position
    const emptyTileIndex = this.emptyTilePositions.findIndex(
      (emptyTile) => emptyTile.x === x && emptyTile.y === y
    );
    if (emptyTileIndex >= 0) {
      return this.emptyTileLetters[emptyTileIndex];
    }

    // No letter at this position
    return "";
  }

  // Public method to wait for initialization to complete
  public waitForInitialization(): Promise<void> {
    return this.initializationPromise;
  }

  // Reset pieces to random valid positions around the board
  public resetPieces(): void {
    this.placePieces(true);
  }
}
