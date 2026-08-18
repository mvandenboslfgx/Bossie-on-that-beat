import type { Metadata } from "next";
import RequestForm from "../../components/RequestForm";
import { SiteFooter, SiteNav } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Request a Project",
  description: "Request a custom production, song, beat, remix, cinematic score or collaboration from Bossie on the beat.",
};

export default function RequestPage(){
  return <main className="subpage">
    <SiteNav />
    <header className="page-hero section-pad request-hero">
      <div className="page-hero-inner">
        <p className="eyebrow">WORK WITH BOSSIE</p>
        <h1>REQUEST A<br/><span>PROJECT.</span></h1>
        <p>Have an idea for a track, beat, remix, tribute, cinematic piece, brand project or collaboration? Send the creative brief below. The better the detail, the stronger the first direction can be.</p>
      </div>
    </header>

    <section className="request-section section-pad">
      <div className="request-layout">
        <aside className="request-aside">
          <p className="eyebrow">BEFORE YOU SEND</p>
          <h2>Make the brief count.</h2>
          <p>References are welcome for mood and direction, but the goal is always to create something original rather than copy an existing record.</p>
          <div className="request-notes">
            <div><strong>01</strong><span>Tell the story and desired emotion.</span></div>
            <div><strong>02</strong><span>Share where the music will be used.</span></div>
            <div><strong>03</strong><span>Add a realistic deadline and budget indication.</span></div>
            <div><strong>04</strong><span>Include useful reference links if you have them.</span></div>
          </div>
        </aside>
        <div className="request-panel">
          <RequestForm />
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>
}
