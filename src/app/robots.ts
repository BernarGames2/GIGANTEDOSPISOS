import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Proposta com placeholders não deve ser indexada.
  if (site.pitchMode) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
