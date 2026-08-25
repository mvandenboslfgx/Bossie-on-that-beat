import { z } from "zod";

const serverSchema = z.object({
  RESEND_API_KEY: z.string().optional(),
  REQUEST_TO_EMAIL: z.string().email().optional(),
  REQUEST_FROM_EMAIL: z.string().optional(),
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),
  SPOTIFY_ARTIST_ID: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),
  SITE_URL: z.string().url().optional(),
  SYNC_INTERVAL_HOURS: z.coerce.number().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function getServerEnv(): ServerEnv {
  return serverSchema.parse(process.env);
}

export function requireResend() {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.REQUEST_TO_EMAIL) {
    return null;
  }
  return {
    apiKey: env.RESEND_API_KEY,
    to: env.REQUEST_TO_EMAIL,
    from: env.REQUEST_FROM_EMAIL || "Bossie Requests <onboarding@resend.dev>",
  };
}
