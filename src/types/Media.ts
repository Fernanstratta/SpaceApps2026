/**
 * A real-world photograph hosted on Wikimedia Commons. Only images whose
 * license allows reuse (public domain or CC0) are listed. URLs are built from
 * `file` and `commonsPath` (the first characters of the MD5 of the file name,
 * which is how Commons stores files) in `src/utils/commons.ts`.
 */
export interface CommonsImage {
  id: string;
  /** Exact Commons file name, with underscores, e.g. `Apollo_11_bootprint.jpg`. */
  file: string;
  /** Commons storage folder, e.g. `8/89`. */
  commonsPath: string;
  /** Alternative text describing what the photo shows (Spanish; English in `i18n/content/en.ts`). */
  alt: string;
  /** Author / institution as credited on Commons. */
  author: string;
  /** Original license; only its label is translated ("Dominio público" ↔ "Public domain"). */
  license: 'Dominio público' | 'Public domain' | 'CC0 1.0';
}
