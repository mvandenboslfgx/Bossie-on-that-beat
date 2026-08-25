import Link from "next/link";
import type { CinemaItem } from "@/lib/types/cinema";
import { BossieMark } from "@/components/brand/BossieMark";
import { formatCinemaMeta, getPublicCinemaSummary } from "@/lib/cinema/editorial";
import { isVerifiedListenUrl } from "@/lib/links/url";

export function CinemaEditorialCard({ item, featured }: { item: CinemaItem; featured?: boolean }) {
  const summary = getPublicCinemaSummary(item);
  const meta = formatCinemaMeta(item.type, item.durationSeconds);
  const canWatch = Boolean(item.youtubeUrl && isVerifiedListenUrl(item.youtubeUrl));

  return (
    <article className={`cinema-editorial-card ${featured ? "cinema-editorial-featured" : ""}`}>
      <Link href={`/cinema/${item.slug}`} className="cinema-editorial-thumb-link">
        {item.thumbnailUrl ? (
          <div className="cinema-editorial-thumb" style={{ backgroundImage: `url(${item.thumbnailUrl})` }}>
            <BossieMark size="sm" className="cinema-play-mark" decorative={false} />
            <span className="cinema-play-label">▶</span>
          </div>
        ) : (
          <div className="cinema-editorial-thumb cinema-thumb-empty">
            <BossieMark size="sm" className="cinema-play-mark" />
          </div>
        )}
      </Link>
      <div className="cinema-editorial-body">
        <p className="cinema-editorial-meta">{meta}</p>
        <h3>{item.title}</h3>
        <blockquote className="cinema-editorial-quote">{summary}</blockquote>
        <div className="cinema-editorial-actions">
          {canWatch && (
            <a className="button button-gold" href={item.youtubeUrl!} target="_blank" rel="noreferrer">
              WATCH →
            </a>
          )}
          <Link className="text-link" href={`/cinema/${item.slug}`}>
            Details ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
