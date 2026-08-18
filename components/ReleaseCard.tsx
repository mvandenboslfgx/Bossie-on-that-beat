import Link from "next/link";
import type { Release } from "@/data/catalog";

export function ReleaseCover({release}:{release:Release}){
  return <div className={`catalog-cover cover-${release.accent}`} style={release.artwork?{backgroundImage:`url(${release.artwork})`}:undefined}>
    {!release.artwork && <><span className="cover-monogram">B</span><span className="cover-title">{release.title}</span></>}
  </div>
}

export function ReleaseCard({release}:{release:Release}){
  return <Link href={`/music/${release.slug}`} className="catalog-card">
    <ReleaseCover release={release}/>
    <div className="catalog-card-copy"><div className="catalog-meta">{release.year} · {release.mood}</div><h3>{release.title}</h3><p>{release.subtitle}</p><span className="catalog-open">Open release ↗</span></div>
  </Link>
}
