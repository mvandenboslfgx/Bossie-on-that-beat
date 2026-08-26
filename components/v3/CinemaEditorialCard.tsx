import Link from "next/link";
import type { CinemaItem } from "@/lib/types/cinema";
import { BossieMark } from "@/components/brand/BossieMark";
import { formatCinemaMeta, getPublicCinemaSummary, getPublicCinemaTitle } from "@/lib/cinema/editorial";
import { isVerifiedListenUrl } from "@/lib/links/url";

export function CinemaEditorialCard({ item, featured }: { item: CinemaItem; featured?: boolean }) {
  const summary = getPublicCinemaSummary(item);
  const title = getPublicCinemaTitle(item);
  const meta = formatCinemaMeta(item.type, item.durationSeconds);
  const canWatch = Boolean(item.youtubeUrl && isVerifiedListenUrl(item.youtubeUrl));

  return (
    <article className={`cinema-editorial-card ${featured ? "cinema-editorial-featured" : ""}`}>
      <Link
        href={`/cinema/${item.slug}`}
        className="cinema-editorial-thumb-link"
        aria-label={`${title} — ${meta}`}
      >
        {item.thumbnailUrl ? (
          <div className="cinema-editorial-thumb" style={{ backgroundImage: `url(${item.thumbnailUrl})` }}>
            {canWatch && (
              <>
                <BossieMark size="sm" className="cinema-play-mark" />
                <span className="cinema-play-label" aria-hidden="true">
                  ▶
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="cinema-editorial-thumb cinema-thumb-empty" />
        )}
      </Link>
      <div className="cinema-editorial-body">
        <p className="cinema-editorial-meta">{meta}</p>
        <h3>{title}</h3>
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
