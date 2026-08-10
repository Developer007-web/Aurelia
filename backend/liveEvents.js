/**
 * Live "happening nearby" events lookup.
 *
 * The curated seasonal `events` list in destinations.js only knows about
 * recurring annual festivals — it has no idea a specific concert or pop-up
 * is happening the week of the trip. For that we need an actual live web
 * search, done here at request time (not hardcoded, since "what's on" goes
 * stale within days).
 *
 * This calls SerpApi's Google Events engine (https://serpapi.com) when a
 * key is configured, and returns a clearly-labeled empty result otherwise
 * so the rest of the app keeps working without it — same fallback pattern
 * as the rest of this backend (see pickHotelForBudget's OYO/MMT fallback).
 *
 * To enable live results:
 *   1. Get a free API key at https://serpapi.com/users/sign_up
 *   2. Set it as an environment variable before starting the backend:
 *        export SERPAPI_KEY=your_key_here   (macOS/Linux)
 *        set SERPAPI_KEY=your_key_here      (Windows cmd)
 *   3. Restart `npm run dev` in /backend
 *
 * Without a key, every trip still gets a direct "search it yourself" link
 * built from the same query we would have searched, so nothing is ever a
 * dead end — it's just not auto-populated.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthYearLabel(tripDate) {
  const d = tripDate ? new Date(tripDate) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function buildGoogleSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Fetches whatever is genuinely happening in `destinationLabel` around the
 * trip dates via a live web search, with a hard timeout so a slow/broken
 * search never holds up the whole trip-plan response.
 *
 * Returns:
 *   { source: "live-search" | "unavailable" | "error",
 *     query, googleSearchUrl, events: [{ title, when, venue, link }] }
 */
export async function fetchHappeningEvents({ destinationLabel, tripDate }) {
  const monthLabel = monthYearLabel(tripDate);
  const query = `events in ${destinationLabel} ${monthLabel}`.trim();
  const googleSearchUrl = buildGoogleSearchUrl(query);

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return { source: "unavailable", query, googleSearchUrl, events: [] };
  }

  const url =
    `https://serpapi.com/search.json?engine=google_events&q=${encodeURIComponent(query)}` +
    `&hl=en&api_key=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return { source: "error", query, googleSearchUrl, events: [] };
    }

    const data = await res.json();
    const events = (data.events_results || [])
      .slice(0, 5)
      .map((e) => ({
        title: e.title || "Untitled event",
        when: e.date?.when || e.date?.start_date || "Dates on listing",
        venue: e.venue?.name || e.address?.[0] || destinationLabel,
        link: e.link || googleSearchUrl,
      }));

    return { source: "live-search", query, googleSearchUrl, events };
  } catch {
    // Network error, timeout, or bad JSON — degrade quietly to the
    // "unavailable" shape so the frontend always has something sane to show.
    return { source: "error", query, googleSearchUrl, events: [] };
  }
}

/**
 * Filters the destination's curated recurring/annual events (destinations.js)
 * down to the ones that actually overlap the trip's month, as a sensible
 * fallback alongside (or instead of) live search results.
 */
export function seasonalEventsForTrip(dest, tripDate) {
  if (!dest || !dest.events || !dest.events.length) return [];
  const d = tripDate ? new Date(tripDate) : new Date();
  if (Number.isNaN(d.getTime())) return [];
  const month = d.getMonth() + 1; // 1-12
  return dest.events
    .filter((e) => e.months?.includes(month))
    .map((e) => ({ title: e.name, when: `Typically ${MONTH_NAMES[month - 1]}`, venue: dest.label, note: e.note }));
}
