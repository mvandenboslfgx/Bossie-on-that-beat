import { releases } from "@/data/catalog";
import { ReleaseCard } from "@/components/ReleaseCard";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export default function MusicPage(){
 return <><SiteNav/><main className="subpage"><section className="page-hero"><p className="eyebrow">THE COMPLETE CATALOGUE</p><h1>MUSIC</h1><p>Every Bossie release and world in one place. Live releases carry direct store links; projects become fully linked as soon as verified release data arrives.</p></section><section className="catalog-page-grid">{releases.map(r=><ReleaseCard key={r.slug} release={r}/>)}</section></main><SiteFooter/></>
}
