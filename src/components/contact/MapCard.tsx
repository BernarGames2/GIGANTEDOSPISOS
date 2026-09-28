"use client";

import { MapPin, MapTrifold, NavigationArrow } from "@phosphor-icons/react";
import { useState } from "react";
import { ButtonLink, Button } from "@/components/ui/Button";
import { site } from "@/content/site";

/** Embed do Google Maps — só existe com o endereço completo confirmado. */
const embedUrl = site.address.street
  ? `https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.cityLine}`)}&output=embed`
  : null;

/**
 * Cartão do mapa. Mostra sempre uma ilustração estilizada (nunca um iframe
 * quebrado). Com o endereço confirmado em site.ts, o mapa real do Google
 * carrega só quando a pessoa pede — mais leve e sem cookies de terceiros
 * antes do clique.
 */
export function MapCard() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="relative min-h-96 flex-1 overflow-hidden rounded-2xl bg-green-800 shadow-[var(--shadow-deep)] ring-1 ring-sand/10 lg:min-h-[36rem]">
      {showMap && embedUrl ? (
        <iframe
          title={`Mapa: ${site.name} em ${site.city}`}
          src={embedUrl}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          <MapIllustration />
          <span className="absolute left-3 top-3 rounded-md bg-green-950/75 px-2.5 py-1 text-xs font-medium text-sand backdrop-blur-sm sm:left-4 sm:top-4">
            Mapa ilustrativo
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
            <MapPin weight="fill" className="size-14 text-red-500 drop-shadow-[0_8px_10px_rgb(5_16_10/0.55)]" aria-hidden="true" />
            <div className="mt-3 w-full max-w-xs rounded-xl bg-cream-50 p-5 text-center shadow-[var(--shadow-lift)]">
              <p className="font-display text-lg font-semibold text-green-900">{site.name}</p>
              <p className="mt-0.5 text-ink-600">{site.address.street ?? site.address.cityLine}</p>
              {site.address.street ? <p className="text-sm text-ink-500">{site.address.cityLine}</p> : null}
              <div className="mt-4 grid gap-2">
                <ButtonLink
                  href={site.google.mapsUrl}
                  variant="green"
                  icon={<NavigationArrow weight="bold" className="size-5" aria-hidden="true" />}
                >
                  Como chegar
                </ButtonLink>
                {embedUrl ? (
                  <Button
                    variant="outline-dark"
                    onClick={() => setShowMap(true)}
                    icon={<MapTrifold weight="bold" className="size-5" aria-hidden="true" />}
                  >
                    Ver mapa aqui
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Quarteirões, avenidas e uma praça em tons de verde — decorativo. */
function MapIllustration() {
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <pattern id="map-blocks" width="64" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
          <rect x="7" y="7" width="50" height="38" rx="5" fill="#24452f" />
        </pattern>
        <radialGradient id="map-fade" cx="50%" cy="50%" r="65%">
          <stop offset="0.35" stopColor="#1e3d28" stopOpacity="0" />
          <stop offset="1" stopColor="#0f2b1c" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill="#1c3a26" />
      <rect width="600" height="600" fill="url(#map-blocks)" />
      {/* praça */}
      <path d="M92 118c38-22 96-14 118 18s4 82-40 92-104-6-112-44 0-44 34-66Z" fill="#2b5638" />
      {/* córrego */}
      <path d="M-20 470c90-40 150 10 230-20s120-110 210-110 130 40 200 20" fill="none" stroke="#2a5048" strokeWidth="16" strokeLinecap="round" />
      {/* avenidas */}
      <g fill="none" stroke="#3b5f47" strokeLinecap="round">
        <path d="M-40 250 640 80" strokeWidth="16" />
        <path d="M180 -40 360 640" strokeWidth="14" />
        <path d="M-40 560 640 380" strokeWidth="10" />
        <path d="M470 -40 560 640" strokeWidth="9" />
      </g>
      <g fill="none" stroke="#d7cfbb" strokeOpacity="0.12" strokeLinecap="round">
        <path d="M-40 250 640 80" strokeWidth="2" strokeDasharray="10 12" />
        <path d="M180 -40 360 640" strokeWidth="2" strokeDasharray="10 12" />
      </g>
      <rect width="600" height="600" fill="url(#map-fade)" />
    </svg>
  );
}
