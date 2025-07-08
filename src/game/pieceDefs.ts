// Tetris piece shape definitions (without letters) - all rotation states
export const TETRIS_PIECE_SHAPES = [
  // I piece - 2 rotation states
  [
    // Removed State 0: Pointing to the right
    // Remvoed because a horizontal piece gives too much of a word away
    // [
    //   { x: 0, y: 0 },
    //   { x: 1, y: 0 },
    //   { x: 2, y: 0 },
    //   { x: 3, y: 0 }
    // ],
    // State 1: Pointing to the bottom
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 }
    ],
  ],
  // O piece - 4 rotation states spinning clockwise
  [
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ],
  ],
  // T piece - 4 rotation states, rotating around the third block
  [
    // State 0: T pointing up
    [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ],
    // State 1: T pointing right
    [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    ],
    // State 2: T pointing down
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: -1, y: 0 },
    ],
    // State 3: T pointing left
    [
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 }
    ]
  ],
  // S piece - 2 rotation states, rotating around the third block
  [
    // State 0: Horizontal S
    [
      { x: 0, y: 0 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 2, y: -1 }
    ],
    // State 1: Vertical S
    [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 }
    ]
  ],
  // Z piece - 2 rotation states
  [
    // State 0: Horizontal Z
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ],
    // State 1: Vertical Z
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 }
    ]
  ],
  // L piece - 4 rotation states
  [
    // State 0: L normal position
    [
      { x: 0, y: -2 },
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ],
    // State 1: L rotated 90 degrees clockwise
    [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    ],
    // State 2: L rotated 180 degrees
    [
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: -1, y: 0 }
    ],
    // State 3: L rotated 270 degrees clockwise
    [
      { x: -2, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 }
    ]
  ],
  // J piece - 4 rotation states
  [
    // State 0: J normal position
    [
      { x: 0, y: -2 },
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: -1, y: 0 }
    ],
    // State 1: J rotated 90 degrees clockwise
    [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 }
    ],
    // State 2: J rotated 180 degrees
    [
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ],
    // State 3: J rotated 270 degrees clockwise
    [
      { x: -2, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    ]
  ],
];