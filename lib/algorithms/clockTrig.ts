/**
 * Closed-form Trigonometric Polar Angle Projection for Analog Clocks
 * Time Complexity: O(1) constant time
 */
export function calculateClockAngles(hours: number, minutes: number): { hourAngle: number; minuteAngle: number } {
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = minutes * 6;
  return { hourAngle, minuteAngle };
}
