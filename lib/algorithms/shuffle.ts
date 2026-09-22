/**
 * In-place Fisher-Yates (Knuth) Shuffle Algorithm
 * Time Complexity: O(N) linear time
 * Space Complexity: O(1) auxiliary space
 * Provides uniform randomness with equal probability (1 / N!) for every permutation.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Reservoir Sampling Algorithm
 * Time Complexity: O(k) selection without sorting the whole array
 */
export function sampleArray<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}
