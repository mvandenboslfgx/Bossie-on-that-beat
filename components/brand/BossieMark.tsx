import { brandAssets } from "@/lib/brand/assets";

/** The crowned B is cropped from the original approved Bossie logo image. */
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
      {/* The original JPG is cropped using a CSS background: no false vector or overflowing img box. */}
    </span>
  );
}
