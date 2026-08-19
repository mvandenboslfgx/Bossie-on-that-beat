import Link from "next/link";
import { SiteNav, SiteFooter } from "../components/SiteChrome";

export default function NotFound(){
  return <main><SiteNav/><section className="page-hero error-hero"><div className="page-shell"><p className="eyebrow">404 / Lost transmission</p><h1>THIS WORLD<br/>DOESN’T EXIST.</h1><p>The page may have moved, changed or not been released yet.</p><div className="error-actions"><Link className="request-submit inline-button" href="/">Return home ↗</Link><Link className="gold-link" href="/music">Explore music ↗</Link></div></div></section><SiteFooter/></main>
}