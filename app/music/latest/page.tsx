import { redirect } from "next/navigation";
import { getLatestRelease } from "@/lib/repository/release-repository";

export default async function MusicLatestPage() {
  const latest = await getLatestRelease();
  if (!latest) redirect("/music");
  redirect(`/music/${latest.slug}`);
}
