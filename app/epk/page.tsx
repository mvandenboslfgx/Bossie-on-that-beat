import { SiteNav, SiteFooter } from "../../components/SiteChrome";

export const metadata = { title: "EPK / Press" };

const facts = [
  ["Artist / producer", "Bossie on the beat"],
  ["Positioning", "Producer · Composer · Artist · World Builder"],
  ["Core line", "Every track is a new world."],
  ["Focus", "Cinematic production, cross-genre releases, visual storytelling"],
  ["Availability", "Selected collaborations, press, sync, brand and creative projects"],
];

export default function EpkPage(){
  return <main><SiteNav/><section className="page-hero"><div className="page-shell"><p className="eyebrow">Electronic press kit</p><h1>EPK / PRESS</h1><p>One professional destination for media, labels, curators, collaborators and brands.</p></div></section><section className="page-section"><div className="page-shell epk-layout"><div className="epk-statement"><p className="eyebrow">Positioning</p><h2>Genre-fluid.<br/>Cinematic by design.</h2><p>Bossie on the beat is an independent producer and artist project built around contrast, scale and complete release worlds. Each project is developed as sound, image and story rather than as an isolated track.</p><a className="gold-link" href="/request">Request a project ↗</a></div><div className="fact-list">{facts.map(([a,b])=><div className="fact-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div></div></section><section className="page-section"><div className="page-shell"><p className="eyebrow">Selected work</p><div className="epk-cards"><article><h3>CROWN OF THE ABYSS</h3><p>Orchestral metal / cinematic darkness.</p><a href="https://open.spotify.com/album/2ZWAT8pIDAZwrTkcbmlBMx" target="_blank" rel="noreferrer">Spotify ↗</a></article><article><h3>ONE WORLD ONE DREAM</h3><p>Global anthem / stadium-scale songwriting.</p><a href="https://music.amazon.com/tracks/B0H6SMW3Q2" target="_blank" rel="noreferrer">Amazon Music ↗</a></article><article><h3>THE DOOR WAS NEVER CLOSED</h3><p>Prestige gothic cinematic world.</p><a href="https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed" target="_blank" rel="noreferrer">YouTube ↗</a></article></div></div></section><SiteFooter/></main>
}