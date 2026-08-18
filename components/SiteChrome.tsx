import Link from "next/link";

const nav = [["Music","/music"],["Worlds","/worlds"],["Cinema","/cinema"],["About","/about"],["Industry","/industry"],["Request","/request"]];

export function SiteNav(){
  return <nav className="site-nav"><div className="nav-inner"><Link className="site-brand" href="/">BOSSIE <span>ON THE BEAT</span></Link><div className="site-links">{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div><a className="site-listen" href="https://open.spotify.com/search/Bossie%20on%20that%20beat" target="_blank" rel="noreferrer">Listen ↗</a></div></nav>
}

export function SiteFooter(){
  return <footer className="site-footer"><div><strong>BOSSIE</strong><span>ON THE BEAT</span></div><div className="footer-copy">EVERY TRACK IS A NEW WORLD.<br/><small>© 2026 BOSSIE ON THE BEAT</small></div><a className="vdb-credit" href="https://vdbdigital.nl" target="_blank" rel="noreferrer"><small>BUILT BY</small><strong>VDB DIGITAL ↗</strong></a></footer>
}
