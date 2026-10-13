import {
  distributionPlatformCount,
  getDistributionPlatforms,
  type DistributionCategory,
} from "@/lib/music/distribution-platforms";
import styles from "./PlatformAvailability.module.css";

const groups: Array<{ key: DistributionCategory; label: string; description: string }> = [
  {
    key: "streaming",
    label: "Streaming & music",
    description: "Major music services and regional streaming platforms carrying Bossie on that beat releases.",
  },
  {
    key: "social",
    label: "Social & discovery",
    description: "Platforms where distributed audio can be discovered, shared or used in social content.",
  },
  {
    key: "distribution",
    label: "Additional distribution",
    description: "Partner services and catalogue destinations included in the active distribution footprint.",
  },
];

export function PlatformAvailability() {
  return (
    <section className={`section-pad ${styles.section}`} aria-labelledby="available-worldwide-title">
      <div className={styles.heading}>
        <div>
          <p className="eyebrow">AVAILABLE WORLDWIDE</p>
          <h2 id="available-worldwide-title">Listen everywhere.</h2>
          <p className={styles.lede}>
            Bossie on that beat is distributed to {distributionPlatformCount} streaming, music discovery and social
            platforms worldwide. Direct artist links are only shown when an official profile has been verified.
          </p>
        </div>
        <div className={styles.count} aria-label={`${distributionPlatformCount} distribution platforms`}>
          <strong>{distributionPlatformCount}</strong>
          <span>platforms</span>
        </div>
      </div>

      <div className={styles.groups}>
        {groups.map((group) => {
          const platforms = getDistributionPlatforms(group.key);
          return (
            <section key={group.key} className={styles.group} aria-labelledby={`platform-group-${group.key}`}>
              <div className={styles.groupHeading}>
                <h3 id={`platform-group-${group.key}`}>{group.label}</h3>
                <p>{group.description}</p>
              </div>
              <ul className={styles.grid}>
                {platforms.map((platform) => {
                  const content = (
                    <>
                      <span className={styles.mark} aria-hidden="true">{platform.mark}</span>
                      <span className={styles.copy}>
                        <strong>{platform.name}</strong>
                        <small>{platform.href ? "Official profile" : "Available"}</small>
                      </span>
                      <span className={styles.action} aria-hidden="true">{platform.href ? "↗" : "✓"}</span>
                    </>
                  );

                  return (
                    <li key={platform.id}>
                      {platform.href ? (
                        <a
                          className={`${styles.card} ${styles.linked}`}
                          href={platform.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${platform.name} — official Bossie on that beat profile`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className={styles.card} aria-label={`${platform.name} — Bossie on that beat is distributed here`}>
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
