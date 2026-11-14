/** Lowercase and remove accents, for forgiving Spanish search ("gravedad" = "Gravedad", "climatologia" = "Climatología"). */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
