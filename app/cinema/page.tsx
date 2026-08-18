import { SiteFooter, SiteNav } from "@/components/SiteChrome";
const videos=[
["THE DOOR WAS NEVER CLOSED","Prestige cinematic visual","https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed"],
["NIMS DAI","Mountain tribute visual","https://www.youtube.com/results?search_query=Bossie+on+that+beat+Nims+Dai"],
["BOSSIE SHORTS","Short-form worlds","https://www.youtube.com/results?search_query=Bossie+on+that+beat+shorts"]];
export default function CinemaPage(){return <><SiteNav/><main className="subpage"><section className="page-hero"><p className="eyebrow">VISUAL PRODUCTION</p><h1>CINEMA</h1><p>Music videos, lyric films, trailers and vertical worlds. Every major Bossie release is designed to carry a visual identity as strong as the track.</p></section><section className="cinema-page-grid">{videos.map((v,i)=><a className="cinema-page-card" key={v[0]} href={v[2]} target="_blank" rel="noreferrer"><div className={`cinema-poster poster-${i+1}`}><span>▶</span></div><small>{v[1]}</small><h2>{v[0]}</h2><b>Watch / discover ↗</b></a>)}</section></main><SiteFooter/></>}
