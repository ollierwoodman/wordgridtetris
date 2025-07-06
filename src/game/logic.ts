import {
  GRID_WIDTH,
  GRID_HEIGHT,
  TETRIS_PIECE_SHAPES,
  NUM_PIECES,
} from "./constants";
import type {
  Tile,
  Piece,
  PieceSolutionEntry,
  WordSolution,
} from "../types/game";

export class Game {
  private grid: Tile[][];
  private pieces: Piece[];
  private selectedPieceIndex: number | null = null;
  private pieceRotationStates: number[] = new Array(NUM_PIECES).fill(0); // Track current rotation state for each piece
  private wordSolution: WordSolution;
  private pieceSolution: PieceSolutionEntry[];
  private emptyTilePosition: { x: number; y: number };
  private emptyTileLetter: string;
  private hintProgress: number = 0; // 0-3: 0=no hints, 1=theme, 2=position, 3=letter

  constructor(
    wordSolution: WordSolution = { theme: "", words: [] },
    pieceSolution: PieceSolutionEntry[] = []
  ) {
    this.wordSolution = wordSolution;
    this.pieceSolution = pieceSolution;

    this.grid = this.initializeGrid();
    this.pieces = this.initializePieces();
    // Initialize rotation states only for valid pieces (pieceIndex >= 0)
    this.pieceRotationStates = this.pieceSolution
      .filter((pieceInSolution) => pieceInSolution.pieceIndex >= 0)
      .map((pieceInSolution) => pieceInSolution.rotation);

    this.placePieces();

    const emptyTile = this.pieceSolution.find(
      (pieceInSolution) => pieceInSolution.pieceIndex === -1
    ) || { x: 0, y: 0, letter: "" };

    this.emptyTilePosition = {
      x: emptyTile.x + 2,
      y: emptyTile.y + 2,
    };
    this.emptyTileLetter = this.wordSolution.words[emptyTile.y]?.charAt(emptyTile.x) || "";
  }

  private initializeGrid(): Tile[][] {
    const grid: Tile[][] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
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

  private placePieces(): void {
    // Move all pieces to temporary positions outside the grid to avoid initial collisions
    for (let i = 0; i < this.pieces.length; i++) {
      this.setPiecePosition(i, -10, -10);
    }
    
    // Predefined positions spread across the grid to minimize collisions
    const placementPositions = [
      { x: 1, y: 1 },
      { x: 6, y: 1 },
      { x: 1, y: 6 },
      { x: 6, y: 6 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 6, y: 3 },
      { x: 3, y: 6 },
    ];
    
    // Place each piece in the first available valid position
    for (let i = 0; i < this.pieces.length; i++) {
      let placed = false;
      
      // Try predefined positions first
      for (const pos of placementPositions) {
        if (this.isValidMoveInternal(i, pos.x, pos.y)) {
          this.setPiecePosition(i, pos.x, pos.y);
          placed = true;
          break;
        }
      }
      
      // If predefined positions don't work, find any valid position
      if (!placed) {
        const safePosition = this.findSafePosition(i);
        if (safePosition) {
          this.setPiecePosition(i, safePosition.x, safePosition.y);
        } else {
          // Fallback to center position
          this.setPiecePosition(i, 4, 4);
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
    let maxX = GRID_WIDTH - 1;
    let maxY = GRID_HEIGHT - 1;
    
    for (const block of pieceTemplate) {
      minX = Math.max(minX, -block.x);
      minY = Math.max(minY, -block.y);
      maxX = Math.min(maxX, GRID_WIDTH - 1 - block.x);
      maxY = Math.min(maxY, GRID_HEIGHT - 1 - block.y);
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
  } | null {
    return this.getPieceAtPosition(
      this.emptyTilePosition.x,
      this.emptyTilePosition.y
    );
  }

  // Move piece away from empty tile if it's occupying it
  private movePieceAwayFromEmptyTile(): boolean {
    const pieceAtEmptyTile = this.isPieceOccupyingEmptyTile();

    if (pieceAtEmptyTile) {
      const { pieceIndex } = pieceAtEmptyTile;
      const safePosition = this.findSafePosition(pieceIndex);

      if (safePosition) {
        this.setPiecePosition(pieceIndex, safePosition.x, safePosition.y);
        return true;
      }
    }

    return false;
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
        blockX >= GRID_WIDTH ||
        blockY < 0 ||
        blockY >= GRID_HEIGHT
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
      const blocks =
        TETRIS_PIECE_SHAPES[pieceType][rotationState];

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

  // Rotate selected piece
  rotatePiece(): boolean {
    if (this.selectedPieceIndex === null) return false;

    const piece = this.pieces[this.selectedPieceIndex];
    const currentRotationState =
      this.pieceRotationStates[this.selectedPieceIndex];
    const pieceType = this.pieces[this.selectedPieceIndex].type;
    const numRotationStates = TETRIS_PIECE_SHAPES[pieceType].length;
    const nextRotationState = (currentRotationState + 1) % numRotationStates;
    const nextPieceTemplate = TETRIS_PIECE_SHAPES[pieceType][nextRotationState];

    // Check if rotation is valid
    for (const block of nextPieceTemplate) {
      const blockX = piece.x + block.x;
      const blockY = piece.y + block.y;

      if (
        blockX < 0 ||
        blockX >= GRID_WIDTH ||
        blockY < 0 ||
        blockY >= GRID_HEIGHT
      ) {
        return false;
      }

      if (this.wouldCollideWithPiece(blockX, blockY, this.selectedPieceIndex)) {
        return false;
      }
    }

    // Apply rotation by updating the rotation state
    this.pieceRotationStates[this.selectedPieceIndex] = nextRotationState;
    return true;
  }

  // Reset game
  resetGame(
    wordSolution: WordSolution = { theme: "", words: [] },
    pieceSolution: PieceSolutionEntry[] = []
  ): void {
    this.wordSolution = wordSolution;
    this.pieceSolution = pieceSolution;
    this.grid = this.initializeGrid();
    this.pieces = this.initializePieces();
    // Initialize rotation states before placing pieces
    this.pieceRotationStates = this.pieceSolution
      .filter((pieceInSolution) => pieceInSolution.pieceIndex >= 0)
      .map((pieceInSolution) => pieceInSolution.rotation);
    this.placePieces();
    this.selectedPieceIndex = null;
    // Reset hint progress
    this.hintProgress = 0;

    const emptyTile = this.pieceSolution.find(
      (pieceInSolution) => pieceInSolution.pieceIndex === -1
    ) || { x: 0, y: 0, letter: "" };

    this.emptyTilePosition = {
      x: emptyTile.x + 2,
      y: emptyTile.y + 2,
    };
    this.emptyTileLetter = this.wordSolution.words[emptyTile.y]?.charAt(emptyTile.x) || "";
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
        this.setPiecePosition(i, x + 2 || 0, y + 2 || 0);
        this.pieceRotationStates[i] = rotation || 0;
      }
    }
  }

  // Empty tile methods
  public getEmptyTilePosition(): { x: number; y: number } {
    return this.emptyTilePosition;
  }

  public getEmptyTileLetter(): string {
    return this.emptyTileLetter;
  }

  public getWordSolution(): WordSolution {
    return this.wordSolution;
  }

  public getWordTheme(): string {
    return this.wordSolution.theme;
  }

  // Hint progress methods
  public getHintProgress(): number {
    return this.hintProgress;
  }

  public revealNextHint(): boolean {
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

  // Check if the puzzle is completed by verifying letters are in correct positions
  public isPuzzleCompleted(): boolean {
    // Check each word in the solution
    for (let y = 0; y < this.wordSolution.words.length; y++) {
      const expectedWord = this.wordSolution.words[y];

      for (let x = 0; x < expectedWord.length; x++) {
        const expectedLetter = expectedWord[x];
        const actualLetter = this.getLetterAtPosition(x + 2, y + 2);

        if (actualLetter !== expectedLetter) {
          return false;
        }
      }
    }

    return true;
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
    if (x === (this.emptyTilePosition.x) && y === (this.emptyTilePosition.y)) {
      return this.emptyTileLetter;
    }

    // No letter at this position
    return "";
  }


}
