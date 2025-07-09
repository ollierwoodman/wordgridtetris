import { TETRIS_PIECE_SHAPES } from "./pieceDefs";
import type {
  Tile,
  Piece,
  PieceSolutionEntry,
  WordSolution,
} from "../types/game";
import {
  fetchRandomPieceSolution,
  fetchRandomWordSolution,
} from "./puzzle/random";
import { SeededRandom } from "../utils/random";

const NUMBER_BLOCK_PER_PIECE = 4;

export class Game {
  private solutionSize: number;
  private gridSize: number;
  private solutionOffset: number;
  private numPieces: number;
  private numEmptyTiles: number;
  private wordSolution: WordSolution = { words: [], theme: "" };
  private pieceSolution: PieceSolutionEntry[] = [];
  private greeting: string = "";
  private grid: Tile[][] = [];
  private pieces: Piece[] = [];
  private selectedPieceIndex: number | null = null;
  private pieceRotationStates: number[]; // Track current rotation state for each piece
  private emptyTilePositions: { x: number; y: number }[] = [];
  private emptyTileLetters: string[] = [];
  private hintProgress: number = 0; // 0-3: 0=no hints, 1=theme, 2=position, 3=letter
  private initializationPromise: Promise<void>;

  constructor(solutionSize: number, seed: string) {
    this.solutionSize = solutionSize;
    this.gridSize = solutionSize + 4;
    this.solutionOffset = (this.gridSize - this.solutionSize) / 2;
    this.numEmptyTiles = (this.solutionSize * this.solutionSize) % NUMBER_BLOCK_PER_PIECE;
    this.numPieces = (this.solutionSize * this.solutionSize - this.numEmptyTiles) / NUMBER_BLOCK_PER_PIECE;

    switch (solutionSize) {
      case 5:
      case 6:
      case 7:
        break;
      default:
        throw new Error(`Grid size ${solutionSize} not supported`);
    }

    this.pieceRotationStates = new Array(this.numPieces).fill(0);

    // Initialize async data - this should be handled by the caller
    this.initializationPromise = this.initializeAsyncData(solutionSize, seed)
      .then(([wordSolution, pieceSolution]) => {
        this.wordSolution = wordSolution;
        this.pieceSolution = pieceSolution;
        this.greeting = wordSolution.greeting || "";
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
            x: pieceInSolution.x + this.solutionOffset,
            y: pieceInSolution.y + this.solutionOffset,
          }));

        this.emptyTileLetters = this.emptyTilePositions.map(
          (emptyTilePosition) => {
            // Convert back to solution coordinates (without offset)
            const solutionY = emptyTilePosition.y - this.solutionOffset;
            const solutionX = emptyTilePosition.x - this.solutionOffset;
            
            // Check bounds before accessing
            if (solutionY >= 0 && solutionY < this.wordSolution.words.length &&
                solutionX >= 0 && solutionX < this.wordSolution.words[solutionY].length) {
              return this.wordSolution.words[solutionY].charAt(solutionX);
            }
            return ""; // Return empty string if out of bounds
          }
        );
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  private async initializeAsyncData(
    solutionSize: number,
    seed: string
  ): Promise<[WordSolution, PieceSolutionEntry[]]> {
    return await Promise.all([
      fetchRandomWordSolution(solutionSize, seed),
      fetchRandomPieceSolution(solutionSize, seed),
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
            const letter =
              this.wordSolution.words[y + block.y]?.[x + block.x] || "";
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

  private placePieces(shuffle: boolean = false): void {
    // Move all pieces to temporary positions outside the grid to avoid initial collisions
    for (let i = 0; i < this.pieces.length; i++) {
      this.setPiecePosition(i, -10, -10);
    }

    const randomHelper = new SeededRandom(new Date().getMilliseconds())
    const placePieceOrder = Array.from({length: this.pieces.length}, (_, i) => i);
    if (shuffle) {
      // Shuffle the pieces
      randomHelper.shuffle(placePieceOrder);
    }

    // Predefined positions spread across the grid to minimize collisions
    const placementPositions = [
      { x: 1, y: 1 },
      { x: this.gridSize - 3, y: 1 },
      { x: 1, y: this.gridSize - 3 },
      { x: this.gridSize - 3, y: this.gridSize - 3 },
      { x: Math.floor(this.gridSize / 2), y: 1 },
      { x: 1, y: Math.floor(this.gridSize / 2) },
      { x: this.gridSize - 3, y: Math.floor(this.gridSize / 2) },
      { x: Math.floor(this.gridSize / 2), y: this.gridSize - 3 },
    ];

    // Place each piece in the first available valid position
    for (const pieceIndex of placePieceOrder) {
      let placed = false;

      // Try predefined positions first
      for (const pos of placementPositions) {
        if (this.isValidMoveInternal(pieceIndex, pos.x, pos.y)) {
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

  // // Rotate selected piece
  // rotatePiece(): boolean {
  //   if (this.selectedPieceIndex === null) return false;

  //   const piece = this.pieces[this.selectedPieceIndex];
  //   const currentRotationState =
  //     this.pieceRotationStates[this.selectedPieceIndex];
  //   const pieceType = this.pieces[this.selectedPieceIndex].type;
  //   const numRotationStates = TETRIS_PIECE_SHAPES[pieceType].length;
  //   const nextRotationState = (currentRotationState + 1) % numRotationStates;
  //   const nextPieceTemplate = TETRIS_PIECE_SHAPES[pieceType][nextRotationState];

  //   // Check if rotation is valid
  //   for (const block of nextPieceTemplate) {
  //     const blockX = piece.x + block.x;
  //     const blockY = piece.y + block.y;

  //     if (
  //       blockX < 0 ||
  //       blockX >= this.gridSize ||
  //       blockY < 0 ||
  //       blockY >= this.gridSize
  //     ) {
  //       return false;
  //     }

  //     if (this.wouldCollideWithPiece(blockX, blockY, this.selectedPieceIndex)) {
  //       return false;
  //     }
  //   }

  //   // Apply rotation by updating the rotation state
  //   this.pieceRotationStates[this.selectedPieceIndex] = nextRotationState;
  //   return true;
  // }

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
        this.setPiecePosition(i, x + this.solutionOffset, y + this.solutionOffset);
        this.pieceRotationStates[i] = rotation || 0;
      }
    }
  }

  // Empty tile methods
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

  public getGreeting(): string {
    return this.greeting;
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

  // Hint progress methods
  public getHintProgress(): number {
    return this.hintProgress;
  }

  public areHintsEnabled(): boolean {
    return this.solutionSize <= 5;
  }

  public revealNextHint(): boolean {
    // Disable hints for solution sizes above 5
    if (this.solutionSize > 5) {
      return false;
    }
    
    if (this.hintProgress < 3) {
      this.hintProgress++;

      // When revealing the empty tile position (hintProgress becomes 2),
      // check if any piece is occupying that position and move it if necessary
      if (this.hintProgress === 2) {
        this.movePieceAwayFromEmptyTile();
      }

      return true;
    }
    return false;
  }

  // Check if the puzzle is completed by verifying all solution words are present in any order
  public isPuzzleCompleted(): boolean {
    const actualWordsSet: Set<string> = new Set();
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
          word += emptyTileLetter;
          emptyTileUsed = true;
        }
      }
      actualWordsSet.add(word);
    }

    console.log(actualWordsSet, this.wordSolution.words);

    // Check if sets match
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
