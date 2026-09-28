import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { site } from "@/content/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${site.name} | Pisos e revestimentos em ${site.city} – ${site.state}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title,
    description: site.description,
  },
  // Conteúdo de exemplo ainda não substituído → fora do Google (invisível na interface).
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#123322",
  width: "device-width",
  initialScale: 1,
};

// Somente dados confirmados (endereço completo e horário entram quando confirmados).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: "+55 34 3212-8454",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "BR",
  },
  areaServed: site.city,
  sameAs: [site.instagram.url, ...site.otherSocials.map((s) => s.url)],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionProvider>{children}</MotionProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
