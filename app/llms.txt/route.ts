import { buildLlmsText } from "@/lib/seo/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await buildLlmsText(false), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
