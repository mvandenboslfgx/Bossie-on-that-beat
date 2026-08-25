import { redirect } from "next/navigation";
import { getCatalog } from "@/lib/repository/catalog";

export const dynamic = "force-dynamic";

export default async function MusicLatestPage() {
  const { latest } = await getCatalog();
  if (!latest) redirect("/music");
  redirect(`/music/${latest.slug}`);
}
