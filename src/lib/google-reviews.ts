/**
 * Integração opcional com o Google (Places API — New).
 *
 * Com as variáveis GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID configuradas, o site
 * busca a nota, o total de avaliações e até 5 avaliações públicas da ficha da
 * loja no Google, com revalidação diária. Sem as variáveis (ou em caso de
 * erro), retorna `null` e a seção mostra só a nota agregada de site.ts.
 *
 * As avaliações exibidas são exatamente as retornadas pelo Google, com autor
 * e link de origem — nunca editar ou inventar texto.
 */

export interface GoogleReview {
  author: string;
  authorUrl?: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
  url?: string;
}

export interface GoogleReviewsData {
  rating: number;
  count: number;
  reviews: GoogleReview[];
  mapsUrl?: string;
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
    googleMapsUri?: string;
  }[];
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
        },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PlacesResponse;
    if (typeof data.rating !== "number") return null;

    return {
      rating: data.rating,
      count: data.userRatingCount ?? 0,
      mapsUrl: data.googleMapsUri,
      reviews: (data.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Cliente no Google",
          authorUrl: r.authorAttribution?.uri,
          authorPhoto: r.authorAttribution?.photoUri,
          rating: r.rating ?? 0,
          text: r.originalText?.text ?? r.text?.text ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
          url: r.googleMapsUri,
        }))
        .filter((r) => r.text.trim().length > 0),
    };
  } catch {
    return null;
  }
}
