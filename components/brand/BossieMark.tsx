import { brandAssets } from "@/lib/brand/assets";

/** Official Bossie symbol — used for section marks, watermarks and decorative brand signatures. */
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
      {/* Local canonical SVG: no external request and no synthetic placeholder letter. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={brandAssets.mark.src} alt="" width={64} height={64} loading="eager" />
    </span>
  );
}
