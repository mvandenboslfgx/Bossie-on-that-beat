/** @deprecated Use lib/repository/release-repository — kept for backward compatibility */
export type { Release } from "@/lib/types/release";
export { seedReleases as releases } from "@/data/seed/releases";

import { getSeedRelease } from "@/data/seed/releases";

export const getRelease = getSeedRelease;
