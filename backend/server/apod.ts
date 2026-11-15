import { convert } from 'html-to-text';
import type { Apod } from '../src/lib/spaceApiTypes';

const NASA_APOD_FEED = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const UPSTREAM_TIMEOUT_MS = 4_000;

const fallback: Apod = {
  title: 'Welcome to Planet Earth',
  date: '2007-03-25',
  description: 'The Apollo 17 crew took this photo of Earth in 1972. Look for Africa, Antarctica, and swirling white clouds. The picture is known as the Blue Marble.',
  imageUrl: '/space/apod-blue-marble.jpg',
  sourceUrl: 'https://science.nasa.gov/image-article/apod-2007-march-25-welcome-to-planet-earth/',
  credit: 'Apollo 17 Crew, NASA',
  source: 'fallback',
};

function plainText(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '';

  return convert(value, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
      { selector: 'iframe', format: 'skip' },
      { selector: 'video', format: 'skip' },
      { selector: 'script', format: 'skip' },
      { selector: 'style', format: 'skip' },
    ],
  }).replace(/\s+/g, ' ').trim();
}

function httpsUrl(value: unknown): URL | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

function nasaPage(value: unknown): string | null {
  const url = httpsUrl(value);
  if (!url) return null;
  if (url.hostname === 'science.nasa.gov' && url.pathname.startsWith('/image-article/')) {
    return url.href;
  }
  if (url.hostname === 'apod.nasa.gov' && /^\/apod\/ap\d{6}\.html$/.test(url.pathname)) {
    return url.href;
  }
  return null;
}

function imageLink(value: unknown): string | null {
  const url = httpsUrl(value);
  return url && /\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname) ? url.href : null;
}

function isApodDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function mapLatestApod(payload: unknown): Apod | null {
  if (!Array.isArray(payload)) return null;

  let latest: Apod | null = null;
  for (const entry of payload) {
    if (entry === null || typeof entry !== 'object') continue;
    const record = entry as Record<string, unknown>;
    if (!isApodDate(record.date) || (latest && latest.date >= record.date)) continue;

    const title = plainText(record.title);
    const description = plainText(record.explanation).replace(/^Explanation:\s*/i, '');
    const sourceUrl = nasaPage(record.permalink) ?? nasaPage(record.url);
    if (!title || !description || !sourceUrl) continue;

    const hasEmbed = typeof record.basic_html === 'string' && /<(iframe|video)\b/i.test(record.basic_html);
    const imageUrl = record.media_type === 'image' && !hasEmbed
      ? imageLink(record.hdurl) ?? imageLink(record.url)
      : null;
    const credit = plainText(record.credit) || plainText(record.copyright);
    latest = {
      title,
      date: record.date,
      description,
      imageUrl,
      sourceUrl,
      credit: credit || null,
      source: 'nasa',
    };
  }
  return latest;
}

export async function getLatestApod(): Promise<Apod> {
  try {
    const response = await fetch(NASA_APOD_FEED, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (response.ok) {
      const payload: unknown = await response.json();
      return mapLatestApod(payload) ?? fallback;
    }
  } catch {
    // A failed fetch or unreadable response can still serve the bundled APOD.
  }
  return fallback;
}
