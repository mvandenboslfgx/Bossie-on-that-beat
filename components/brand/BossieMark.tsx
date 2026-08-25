import { brandAssets } from "@/lib/brand/assets";

/** Subtle B signature — section marks, loading, 404, cinema watermark. */
export function BossieMark({
  size = "md",
  className,
  decorative = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  decorative?: boolean;
}) {
  return (
    <span
      className={`bossie-mark bossie-mark-${size} ${className ?? ""}`.trim()}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : brandAssets.mark.alt}
    >
      B
    </span>
  );
}
