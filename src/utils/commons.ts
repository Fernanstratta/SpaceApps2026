import type { CommonsImage } from '../types';

const UPLOAD_BASE = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

/** Standard thumbnail widths served by Wikimedia (keep requests cacheable). */
export type ThumbWidth = 500 | 960;

/** Thumbnail URL of a Commons image at the given width. */
export function commonsThumbUrl(image: CommonsImage, width: ThumbWidth): string {
  const file = encodeURIComponent(image.file);
  return `${UPLOAD_BASE}/${image.commonsPath}/${file}/${width}px-${file}`;
}

/** The image's description page on Commons (license and author details). */
export function commonsPageUrl(image: CommonsImage): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.file)}`;
}
