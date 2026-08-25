import { revalidatePath } from "next/cache";
import { CATALOG_PATHS } from "@/lib/repository/catalog";

/** Bust prerendered catalog pages after sync or admin publish actions. */
export function revalidateCatalogPaths() {
  for (const path of CATALOG_PATHS) {
    revalidatePath(path);
  }
}
