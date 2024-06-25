export function generateName(name: string, ordinal: number): string {
  return `${name}-${ordinal.toString().padStart(2, '0')}`;
}
