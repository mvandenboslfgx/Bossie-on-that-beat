export interface World {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  video?: string;
  themes?: string[];
  aesthetic?: string[];
  featured?: boolean;
  manualOverride?: boolean;
}
