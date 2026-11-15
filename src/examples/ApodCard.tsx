import { useEffect, useState } from 'react';
import { getApod } from '../lib/spaceApi';
import type { Apod } from '../lib/spaceApiTypes';

export function ApodCard() {
  const [apod, setApod] = useState<Apod | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getApod(controller.signal).then(
      (entry) => {
        if (!controller.signal.aborted) setApod(entry);
      },
      () => {
        if (!controller.signal.aborted) setFailed(true);
      },
    );

    return () => controller.abort();
  }, []);

  if (failed) return <p role="alert">The space picture could not load. Try again later.</p>;
  if (!apod) return <p role="status">Loading the space picture…</p>;

  return (
    <article>
      <h3>{apod.title}</h3>
      {apod.source === 'fallback' && <p>From the NASA archive</p>}
      <time dateTime={apod.date}>{apod.date}</time>
      {apod.imageUrl && <img src={apod.imageUrl} alt={apod.title} width={400} />}
      <p>{apod.description}</p>
      {apod.credit && <p>{apod.credit}</p>}
      <a href={apod.sourceUrl}>View the original APOD on NASA</a>
    </article>
  );
}
