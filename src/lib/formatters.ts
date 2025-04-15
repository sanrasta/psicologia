export function formatEventDescription(durationInMinutes: number): string {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} minutes`;
  }
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
} 