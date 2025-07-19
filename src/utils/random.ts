function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * A seeded random number generator using the splitmix32 algorithm.
 * Provides deterministic random number generation for consistent results.
 */
export class SeededRandom {
  private rng: () => number;
  private seed: number;

  /**
   * Creates a new SeededRandom instance.
   * @param seed - The seed value for the random number generator
   */
  constructor(seed: number) {
    this.seed = seed;
    this.rng = splitmix32(this.seed);
  }

  /**
   * Creates a SeededRandom instance from a string seed.
   * @param seed - The string seed to convert to a numeric seed
   */
  static fromString(seed: string): SeededRandom {
    const hashFn = xmur3(seed);
    return new SeededRandom(hashFn());
  }

  /**
   * Generates a random float between 0 (inclusive) and 1 (exclusive).
   */
  random(): number {
    return this.rng();
  }

  /**
   * Generates a random integer between min (inclusive) and max (exclusive).
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   */
  randInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  /**
   * Generates a random float between min (inclusive) and max (exclusive).
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   */
  randFloat(min?: number, max?: number): number {
    min ??= 0;
    max ??= 1;
    return this.random() * (max - min) + min;
  }

  /**
   * Returns a random element from the provided array.
   * @param array - The array to choose from
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot choose from empty array');
    }
    return array[this.randInt(0, array.length)];
  }

  /**
   * Shuffles an array in-place using the Fisher-Yates algorithm.
   * @param array - The array to shuffle
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randInt(0, i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Returns a new shuffled copy of the array.
   * @param array - The array to shuffle
   */
  shuffled<T>(array: T[]): T[] {
    return this.shuffle([...array]);
  }

  /**
   * Generates a random boolean value.
   * @param probability - The probability of returning true (0-1, default 0.5)
   */
  randBool(probability = 0.5): boolean {
    return this.random() < probability;
  }

  /**
   * Returns multiple random elements from the array without replacement.
   * @param array - The array to sample from
   * @param count - The number of elements to sample
   */
  sample<T>(array: T[], count: number): T[] {
    if (count > array.length) {
      throw new Error('Sample size cannot be larger than array length');
    }
    if (count < 0) {
      throw new Error('Sample size cannot be negative');
    }
    
    const shuffled = this.shuffled(array);
    return shuffled.slice(0, count);
  }
}
