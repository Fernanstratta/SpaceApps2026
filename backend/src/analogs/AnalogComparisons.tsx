import { comparisons } from './comparisons';

type Site = (typeof comparisons)[number]['earth'];

function EvidenceCard({ site }: { site: Site }) {
  const { evidence } = site;

  return (
    <article className="evidence-card">
      <h4>{site.name}</h4>
      {evidence.kind === 'image' ? (
        <figure className="evidence-figure">
          <img
            src={evidence.image.src}
            alt={evidence.image.alt}
            width={evidence.image.width}
            height={evidence.image.height}
          />
          <figcaption>{evidence.credit}</figcaption>
        </figure>
      ) : (
        <table className="thermal-samples">
          <caption>{evidence.quantity}</caption>
          <thead>
            <tr>
              <th scope="col">Lunar cell center</th>
              <th scope="col">Peak ({evidence.unit})</th>
            </tr>
          </thead>
          <tbody>
            {evidence.samples.map(({ latitude, longitude, value }) => (
              <tr key={latitude}>
                <td>{Math.abs(latitude).toFixed(5)}° S, {longitude.toFixed(5)}° E</td>
                <td>{value.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>{evidence.detail}</p>
      <dl className="evidence-meta">
        <dt>Product</dt>
        <dd>{evidence.product}</dd>
        <dt>Observation</dt>
        <dd>{evidence.period}</dd>
        {evidence.kind === 'image' ? (
          <>
            <dt>Source scale</dt>
            <dd>{evidence.scale}</dd>
          </>
        ) : (
          <>
            <dt>Coordinates</dt>
            <dd>Moon-centered latitude and east-positive longitude</dd>
            <dt>Credit</dt>
            <dd>{evidence.credit}</dd>
          </>
        )}
      </dl>
      <a href={evidence.sourceUrl}>{evidence.sourceLabel}</a>
    </article>
  );
}

export function AnalogComparisons() {
  return (
    <section id="analog-comparisons" aria-labelledby="analogs-heading">
      <h2 id="analogs-heading">Earth analogs</h2>
      <p>Compare two places on Earth with evidence from the Moon and Mars.</p>
      <nav className="explorer-nav" aria-label="Earth analog comparisons">
        <a href="#moon-comparison">Moon comparison</a>
        <a href="#mars-comparison">Mars comparison</a>
      </nav>
      {comparisons.map(({ id, title, earth, destination, commonGround, limitations }) => (
        <section key={id} id={id} aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>{title}</h3>
          <div className="evidence-grid">
            <EvidenceCard site={earth} />
            <EvidenceCard site={destination} />
          </div>
          <div className="analogy">
            <h4>What they have in common</h4>
            <p>{commonGround}</p>
            <h4>Where the analogy breaks down</h4>
            <p>{limitations}</p>
          </div>
        </section>
      ))}
    </section>
  );
}
