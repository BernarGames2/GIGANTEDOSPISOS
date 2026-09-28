import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Enquanto houver conteúdo de exemplo, o site fica fora dos buscadores.
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
