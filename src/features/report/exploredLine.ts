const words = (count: number) => `${count} ${count === 1 ? 'word' : 'words'}`;

/**
 * The report's count line names the child it is about (#138): with two children a grown-up could not tell whose
 * progress the report showed. `total` is given on the full report only.
 */
export function exploredLine(childName: string | undefined, seen: number, total?: number): string {
  const count = total === undefined ? `${words(seen)} explored so far` : `${seen} of ${words(total)} explored`;
  if (!childName) return count[0].toUpperCase() + count.slice(1);
  return total === undefined ? `${childName} has explored ${words(seen)}` : `${childName}: ${count}`;
}
