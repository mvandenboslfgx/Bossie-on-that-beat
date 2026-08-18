const streamingLinks = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/search/Bossie%20on%20that%20beat",
    note: "Listen",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/results?search_query=Bossie+on+that+beat",
    note: "Watch",
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/search?term=Bossie%20on%20that%20beat",
    note: "Stream",
  },
  {
    label: "Amazon Music",
    href: "https://music.amazon.com/tracks/B0H6SMW3Q2",
    note: "Play",
  },
];

const verifiedReleases = [
  {
    number: "01",
    title: "One World One Dream",
    subtitle: "World Cup Song 2026",
    length: "04:28",
    mood: "GLOBAL ANTHEM",
    href: "https://music.amazon.com/tracks/B0H6SMW3Q2",
    accent: "sun",
  },
  {
    number: "02",
    title: "Symphony Of The Storm",
    subtitle: "Single · 2026",
    length: "04:58",
    mood: "ORCHESTRAL POWER",
    href: "https://music.amazon.in/albums/B0H7NX3MVF",
    accent: "storm",
  },
  {
    number: "03",
    title: "Nul Een Acht Zes",
    subtitle: "Single · 2026",
    length: "02:06",
    mood: "DUTCH ENERGY",
    href: "https://music.amazon.co.uk/albums/B0H7P9852Q",
    accent: "city",
  },
];

const worlds = [
  {
    index: "WORLD 001",
    title: "The Door Was Never Closed",
    type: "GOTHIC PSYCHOLOGICAL CINEMA",
    copy: "A dark prestige universe of memory, war, ritual, loss and a door that was never meant to keep anything out.",
    className: "door",
  },
  {
    index: "WORLD 002",
    title: "Crown of the Abyss",
    type: "ORCHESTRAL METAL",
    copy: "Angelic voices collide with subterranean vocals, monumental choirs and an atmosphere built for cathedral-sized impact.",
    className: "abyss",
  },
  {
    index: "WORLD 003",
    title: "Nims Dai",
    type: "CINEMATIC TRIBUTE",
    copy: "Snow, altitude, remembrance and human scale. A visual world designed to feel larger than the mountain itself.",
    className: "mountain",
  },
  {
    index: "WORLD 004",
    title: "After Dark",
    type: "GLOBAL CLUB ENERGY",
    copy: "Neon, velocity, heat and movement. Built for vertical screens, midnight rooms and replay value.",
    className: "club",
  },
];

const cinema = [
  {
    title: "THE DOOR WAS NEVER CLOSED",
    label: "Prestige cinematic visual",
    href: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed",
  },
  {
    title: "NIMS DAI",
    label: "Mountain tribute visual",
    href: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+Nims+Dai",
  },
  {
    title: "BOSSIE SHORTS",
    label: "Short-form worlds",
    href: "https://www.youtube.com/results?search_query=Bossie+on+that+beat+shorts",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Bossie on the beat",
    alternateName: "Bossie on that beat",
    genre: ["Cinematic", "Metal", "Electronic", "Rap", "Global"],
    description:
      "Independent multi-genre music project where every release becomes its own cinematic world.",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grain" aria-hidden="true" />
      <div className="scroll-line" aria-hidden="true" />

      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Bossie on the beat home">
          BOSSIE <span>ON THE BEAT</span>
        </a>
        <div className="nav-links">
          <a href="#music">Music</a>
          <a href="#worlds">Worlds</a>
          <a href="#cinema">Cinema</a>
          <a href="#about">About</a>
        </div>
        <a
          className="nav-cta"
          href="https://open.spotify.com/search/Bossie%20on%20that%20beat"
          target="_blank"
          rel="noreferrer"
        >
          Listen <Arrow />
        </a>
      </nav>

      <header id="top" className="hero section-pad">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-flare" aria-hidden="true" />

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="kicker"><span /> INDEPENDENT · MULTI-GENRE · CINEMATIC</div>
            <h1>
              BOSSIE
              <span>ON THE BEAT</span>
            </h1>
            <p className="hero-manifesto">EVERY TRACK IS A NEW WORLD.</p>
            <p className="hero-subcopy">
              No fixed genre. No safe repetition. Music built as complete worlds — sound,
              image, atmosphere and story moving as one.
            </p>
            <div className="hero-actions">
              <a
                className="button button-gold"
                href="https://open.spotify.com/search/Bossie%20on%20that%20beat"
                target="_blank"
                rel="noreferrer"
              >
                Enter on Spotify <Arrow />
              </a>
              <a
                className="button button-ghost"
                href="https://www.youtube.com/results?search_query=Bossie+on+that+beat"
                target="_blank"
                rel="noreferrer"
              >
                Watch the worlds <Arrow />
              </a>
            </div>
          </div>

          <div className="hero-art" aria-label="Bossie visual identity artwork">
            <div className="hero-disc">
              <div className="disc-label">
                <small>BOSSIE</small>
                <strong>B</strong>
                <small>ON THE BEAT</small>
              </div>
            </div>
            <div className="hero-art-caption">
              <span>EST. 2026</span>
              <span>NO BOUNDARIES</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>SCROLL TO ENTER</span>
          <div className="hero-footer-line" />
          <span>01 / ∞</span>
        </div>
      </header>

      <section className="signal-strip" aria-label="Bossie statement">
        <div className="signal-track">
          <span>DARK TO EUPHORIC</span><i>✦</i>
          <span>CLASSICAL TO CLUB</span><i>✦</i>
          <span>METAL TO GLOBAL</span><i>✦</i>
          <span>EVERY TRACK IS A NEW WORLD</span><i>✦</i>
          <span>DARK TO EUPHORIC</span><i>✦</i>
          <span>CLASSICAL TO CLUB</span><i>✦</i>
        </div>
      </section>

      <section id="music" className="section-pad music-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CATALOGUE</p>
            <h2>Music already<br />in the world.</h2>
          </div>
          <p>
            Public releases under Bossie on that beat. Built to move across countries,
            moods and genres without losing the core identity.
          </p>
        </div>

        <div className="release-list">
          {verifiedReleases.map((release) => (
            <a
              className={`release-row ${release.accent}`}
              href={release.href}
              target="_blank"
              rel="noreferrer"
              key={release.title}
            >
              <span className="release-number">{release.number}</span>
              <span className="release-visual" aria-hidden="true"><i /></span>
              <span className="release-title">
                <strong>{release.title}</strong>
                <small>{release.subtitle}</small>
              </span>
              <span className="release-mood">{release.mood}</span>
              <span className="release-length">{release.length}</span>
              <span className="release-arrow"><Arrow /></span>
            </a>
          ))}
        </div>

        <div className="platform-grid">
          {streamingLinks.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              <span>{link.note}</span>
              <strong>{link.label}</strong>
              <Arrow />
            </a>
          ))}
        </div>
      </section>

      <section id="worlds" className="worlds-section section-pad">
        <div className="section-heading inverse">
          <div>
            <p className="eyebrow">THE WORLDS</p>
            <h2>One name.<br />Infinite universes.</h2>
          </div>
          <p>
            A Bossie release is not just a song. Each project gets its own visual language,
            emotional temperature and cinematic architecture.
          </p>
        </div>

        <div className="world-grid">
          {worlds.map((world, index) => (
            <article className={`world-card ${world.className}`} key={world.title}>
              <div className="world-index">{world.index}</div>
              <div className="world-sigil" aria-hidden="true">
                <span>{index + 1}</span>
              </div>
              <div className="world-content">
                <p>{world.type}</p>
                <h3>{world.title}</h3>
                <div className="world-rule" />
                <span>{world.copy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-copy section-pad">
          <p className="eyebrow">FEATURED WORLD · 001</p>
          <h2>THE DOOR<br />WAS NEVER<br /><em>CLOSED.</em></h2>
          <p>
            Prestige gothic cinema meets psychological horror, war-memory fragments,
            ritual voices and monumental sound design. A world designed to pull the viewer
            through the door rather than simply play in the background.
          </p>
          <a
            className="text-link"
            href="https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed"
            target="_blank"
            rel="noreferrer"
          >
            Search the film on YouTube <Arrow />
          </a>
        </div>
        <div className="feature-art" aria-hidden="true">
          <div className="door-frame">
            <div className="door-light" />
            <div className="door-mark">B</div>
          </div>
          <span className="latin latin-one">MEMORIA DORMIT</span>
          <span className="latin latin-two">ANIMA MANET</span>
        </div>
      </section>

      <section id="cinema" className="section-pad cinema-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BOSSIE CINEMA</p>
            <h2>Sound should<br />have a picture.</h2>
          </div>
          <p>
            Full visual worlds, lyric films and short-form cuts built to make every release
            recognizable before the first chorus even lands.
          </p>
        </div>

        <div className="cinema-grid">
          {cinema.map((item, index) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>
              <div className={`cinema-frame cinema-${index + 1}`}>
                <span className="play"><i /></span>
                <span className="frame-code">BOSSIE / 0{index + 1}</span>
              </div>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
            </a>
          ))}
        </div>
      </section>

      <section className="manifesto-section section-pad">
        <p className="eyebrow">THE RULE</p>
        <blockquote>
          “Never make the next track<br />because it sounds like the last one.”
        </blockquote>
        <div className="manifesto-meta">
          <span>BOSSIE ON THE BEAT</span>
          <span>EVERY TRACK IS A NEW WORLD</span>
        </div>
      </section>

      <section id="about" className="about-section section-pad">
        <div className="about-number">∞</div>
        <div className="about-copy">
          <p className="eyebrow">ABOUT BOSSIE</p>
          <h2>Built for emotion.<br />Designed for scale.</h2>
          <p className="about-lead">
            Bossie on the beat is an independent multi-genre music project built around
            impact, contrast and visual storytelling.
          </p>
          <div className="about-columns">
            <p>
              From orchestral darkness and metal to rap, electronic music, global anthems
              and club records, the genre changes whenever the world demands it.
            </p>
            <p>
              The constant is the identity: cinematic thinking, a recognizable Bossie mark
              and the ambition to make each release feel larger than a single audio file.
            </p>
          </div>
        </div>
      </section>

      <section className="connect-section section-pad">
        <div className="connect-orbit" aria-hidden="true" />
        <p className="eyebrow">NEXT TRANSMISSION</p>
        <h2>ENTER THE<br /><span>NEXT WORLD.</span></h2>
        <p>Follow Bossie where the next release lands first.</p>
        <div className="connect-links">
          {streamingLinks.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              {link.label} <Arrow />
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <strong>BOSSIE</strong>
          <span>ON THE BEAT</span>
        </div>
        <div className="footer-center">
          <span>EVERY TRACK IS A NEW WORLD.</span>
          <small>© 2026 BOSSIE ON THE BEAT</small>
        </div>
        <a
          className="builder-credit"
          href="https://vdbdigital.nl"
          target="_blank"
          rel="noreferrer"
          aria-label="Built by VDB Digital"
        >
          <small>BUILT BY</small>
          <strong>VDB DIGITAL</strong>
          <Arrow />
        </a>
      </footer>
    </main>
  );
}
