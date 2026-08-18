import { SiteFooter, SiteNav } from "@/components/SiteChrome";
const worlds=[
["001","THE DOOR WAS NEVER CLOSED","Gothic psychological cinema","Memory, war, ritual, loss and monumental visual storytelling."],
["002","CROWN OF THE ABYSS","Orchestral metal","Angelic voices, subterranean vocals, choirs and cathedral-scale production."],
["003","THE MOUNTAIN REMEMBERS","Cinematic tribute","Altitude, snow, remembrance and human scale."],
["004","AFTER DARK","Global club","Heat, velocity, neon and replay energy."],
["005","NEXT TRANSMISSION","Unknown by design","The next Bossie world is allowed to change the rules again."]];
export default function WorldsPage(){return <><SiteNav/><main className="subpage"><section className="page-hero"><p className="eyebrow">CREATIVE UNIVERSES</p><h1>WORLDS</h1><p>Bossie is organized by worlds, not genre boxes. Each world carries its own sound, art direction, emotional temperature and visual language.</p></section><section className="worlds-page-grid">{worlds.map(w=><article className="world-page-card" key={w[0]}><span>WORLD {w[0]}</span><h2>{w[1]}</h2><strong>{w[2]}</strong><p>{w[3]}</p></article>)}</section></main><SiteFooter/></>}
