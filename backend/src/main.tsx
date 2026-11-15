import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnalogComparisons } from './analogs/AnalogComparisons';
import { LunarAnalogComparator } from './analogs/LunarAnalogComparator';
import { ApodCard } from './examples/ApodCard';
import { BajaAnalogExplorer } from './examples/BajaAnalogExplorer';
import { getPlanets } from './lib/spaceApi';
import type { Planet } from './lib/spaceApiTypes';
import './styles.css';

function App() {
  const [planets, setPlanets] = useState<Planet[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getPlanets(controller.signal).then(
      (entries) => {
        if (!controller.signal.aborted) setPlanets(entries);
      },
      () => {
        if (!controller.signal.aborted) setFailed(true);
      },
    );
    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Starman Space Explorer</h1>
      <nav className="explorer-nav" aria-label="Explore Starman">
        <a href="#lunar-analogs" lang="es">Comparador lunar</a>
        <a href="#baja-explorer">Baja discoveries</a>
        <a href="#analog-comparisons">Earth analogs</a>
        <a href="#apod-heading">Astronomy picture</a>
        <a href="#planets-heading">Planets</a>
      </nav>
      <LunarAnalogComparator />
      <BajaAnalogExplorer />
      <AnalogComparisons />
      <section aria-labelledby="apod-heading">
        <h2 id="apod-heading">Astronomy Picture of the Day</h2>
        <ApodCard />
      </section>
      <section aria-labelledby="planets-heading">
        <h2 id="planets-heading">The eight planets</h2>
        {failed && <p role="alert">The planets could not load. Try again later.</p>}
        {!failed && !planets && <p role="status">Loading planets…</p>}
        {planets && (
          <ol>
            {planets.map((planet) => (
              <li key={planet.id}>
                <h3>{planet.name}</h3>
                <p>{planet.summary}</p>
                <p>{planet.funFact}</p>
                <a href={planet.sourceUrl}>Explore {planet.name} on NASA</a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
