import { useEffect,useState } from 'react';
import { getAnalogRankings,getAnalogSources } from '../lib/analogApiClient.js';
import type { ScientificSource } from '../types/planetaryAnalog.js';
type Rows=Awaited<ReturnType<typeof getAnalogRankings>>['data'];
export function BajaAnalogExplorer(){
 const [planet,setPlanet]=useState(''),[profile,setProfile]=useState('balanced');
 const [rows,setRows]=useState<Rows|null>(null),[error,setError]=useState('');
 const [sources,setSources]=useState<ScientificSource[]>([]);
 const [answers,setAnswers]=useState<Record<string,number>>({});
 useEffect(()=>{const c=new AbortController();setRows(null);setError('');
 Promise.all([getAnalogRankings(planet,profile,c.signal),getAnalogSources(c.signal)]).then(([r,s])=>{if(!c.signal.aborted){setRows(r.data);setSources(s.data);}},()=>{if(!c.signal.aborted)setError('The analog catalog could not load. Run the app with its API server and try again.');});
 return()=>c.abort();},[planet,profile]);
 return <section id="baja-explorer" aria-labelledby="baja-title">
  <h2 id="baja-title">From Baja California to space</h2>
  <p>Explore proposed comparisons and the evidence behind them. Research priority is an editorial order; it is not a measured similarity ranking.</p>
  <div className="explorer-controls">
   <label>Destination <select value={planet} onChange={e=>setPlanet(e.target.value)}><option value="">Moon and Mars</option><option>Mars</option><option>Moon</option></select></label>
   <label>Mission <select value={profile} onChange={e=>setProfile(e.target.value)}>{[['balanced','Balanced'],['geology','Mars geology'],['astrobiology','Mars astrobiology'],['mobility','Rover mobility'],['lunar-operations','Lunar operations'],['lunar-resources','Lunar resources'],['human-training','Human training']].map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>
  </div>
  {error&&<p role="alert">{error}</p>}{!error&&!rows&&<p role="status">Loading evidence…</p>}
  {rows?.length===0&&<p>No comparisons meet these filters.</p>}
  {rows?.map(a=><article className="baja-card" key={a.id}>
   <h3>{a.title}</h3><p>{a.educational.summary30}</p>
   <p><strong>{a.ranking.overallScore===null?'Similarity: not yet measured':`Similarity: ${a.ranking.overallScore}/100`}</strong> · Evidence confidence: {a.researchConfidence}</p>
   <details><summary>Why this comparison?</summary><p>{a.priorityReason}</p><p>{a.educational.explanation}</p><p>{a.ranking.reason}</p></details>
   <details><summary>Choose your explanation level</summary><h4>Young explorers</h4><p>{a.educational.youngExplorers}</p><h4>Students</h4><p>{a.educational.students}</p><h4>Advanced explorers</h4><p>{a.educational.advanced}</p></details>
   <details><summary>Where the analogy breaks down</summary><p>{a.educational.analogyBreakdown}</p></details>
   <details><summary>Try a mission: {a.experiment.title}</summary><p>{a.experiment.outcomeLabel}</p><ol>{a.experiment.steps.map(s=><li key={s}>{s}</li>)}</ol><p>{a.experiment.limitations}</p></details>
   <details><summary>Check your understanding</summary><fieldset><legend>{a.educational.quiz.question}</legend>{a.educational.quiz.options.map((o,i)=><label className="quiz-option" key={o}><input type="radio" name={a.id} checked={answers[a.id]===i} onChange={()=>setAnswers({...answers,[a.id]:i})}/>{o}</label>)}</fieldset>{answers[a.id]!==undefined&&<p role="status">{answers[a.id]===a.educational.quiz.answerIndex?'Correct. ':'Try again. '}{a.educational.quiz.explanation}</p>}</details>
   <details><summary>Inspect evidence and sources</summary><ul>{sources.filter(s=>a.sourceIds.includes(s.id)).map(s=><li key={s.id}><a href={s.url}>{s.title}</a><p>{s.organization} · {s.accessStatus}</p><p>{s.limitations}</p></li>)}</ul></details>
  </article>)}
 </section>;
}
