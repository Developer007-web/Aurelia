/**
 * buildTripPlan(formData) -> { trip, itinerary, meta }
 *
 * Destination is REQUIRED. When the destination matches a curated entry in
 * destinations.js (Delhi, Mumbai, Manali, Goa, Jaipur, Udaipur, Shimla,
 * Leh-Ladakh, Rishikesh, Munnar/Kerala, Agra, Bali) the plan is built from
 * real named hotels, attractions, and food — not placeholder text. If the
 * destination isn't in the curated list yet, we say so explicitly via
 * meta.matched = false rather than silently inventing "Signature landmark #1"
 * style filler.
 */
import { findDestinationData, guessDepartureCode } from "./destinations.js";
import { fetchHappeningEvents, seasonalEventsForTrip } from "./liveEvents.js";

function calcAge(age) {
  const n = Number(age);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Parses a price string like "₹24,000/night" into a plain number (24000).
function parseNightlyPrice(priceStr) {
  if (!priceStr) return null;
  const digits = String(priceStr).replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

function addDays(dateStr, n) {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + n);
  return d;
}

function ymd(d) {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

function slugify(label) {
  return String(label || "")
    .toLowerCase()
    .split(",")[0]
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Builds real, direct search links to OYO and MakeMyTrip for the destination
 * city (and dates/guests when we have them), so travelers whose budget
 * doesn't fit our curated 5-star list still get somewhere to actually book
 * an affordable room, instead of just a warning with nowhere to go.
 */
function buildBookingLinks(label, tripDate, nights, travelers) {
  const city = (label || "").split(",")[0].trim();
  if (!city) return null;

  const checkinDate = tripDate ? new Date(tripDate) : null;
  const checkin = checkinDate && !Number.isNaN(checkinDate.getTime()) ? ymd(checkinDate) : null;
  const checkout = checkin ? ymd(addDays(tripDate, Math.max(Number(nights) || 1, 1))) : null;
  const guests = Math.max(Number(travelers) || 1, 1);

  const oyoParams = new URLSearchParams({ location: city });
  if (checkin) oyoParams.set("checkin", checkin);
  if (checkout) oyoParams.set("checkout", checkout);
  oyoParams.set("guests", String(guests));
  oyoParams.set("rooms", "1");

  return {
    oyo: `https://www.oyorooms.com/search?${oyoParams.toString()}`,
    mmt: `https://www.makemytrip.com/hotels/${slugify(city)}-hotels.html`,
  };
}

// Rough city tiers used only as a last-resort fallback when NO curated
// 5-star hotel fits the budget. Grounded in published OYO/MakeMyTrip
// budget-category listings (₹1,200+ in metros per OYO's own Delhi page,
// ~₹800–1,500 for budget rooms in smaller cities) — not live prices (those
// change daily and need OYO/MMT's own API), but a realistic starting point
// so the trip doesn't get stuck recommending a 5-star hotel nobody can afford.
const METRO_CITIES = ["delhi", "new-delhi", "mumbai", "bangalore", "bengaluru", "chennai", "kolkata", "hyderabad", "pune"];
function oyoMmtNightlyEstimate(label) {
  return METRO_CITIES.includes(slugify(label)) ? 1500 : 1100;
}

/**
 * Picks ONE real hotel from the destination's curated list that actually
 * fits the traveler's budget, instead of just dumping every hotel on the
 * page regardless of price. We reserve a target share of the total budget
 * for lodging (roughly 30%, nudged by travel style), then choose the
 * priciest hotel whose full-stay cost still fits inside that reserve.
 *
 * If NO curated hotel fits, we don't just hand over an unaffordable 5-star
 * pick — we fall back to a realistic OYO/MakeMyTrip budget-category
 * estimate for that city so the recommendation stays genuinely bookable.
 * Only if even that doesn't fit do we mark the trip `insufficient` and fall
 * back to the cheapest curated option, so the numbers stay honest.
 */
function pickHotelForBudget(dest, days, totalBudget, travelStyle) {
  if (!dest || !dest.hotels || !dest.hotels.length) return null;

  const styleWeight = { Luxury: 0.34, Premium: 0.3, Budget: 0.22, Backpacking: 0.16 };
  const hotelShare = styleWeight[travelStyle] ?? 0.3;
  const nights = Math.max(Number(days) || 1, 1);
  const lodgingReserve = totalBudget * hotelShare;

  const priced = dest.hotels
    .map((h) => ({ ...h, nightly: parseNightlyPrice(h.price) }))
    .filter((h) => h.nightly != null)
    .sort((a, b) => a.nightly - b.nightly);

  if (!priced.length) return { hotel: dest.hotels[0], nightly: null, totalStayCost: null };

  const affordable = priced.filter((h) => h.nightly * nights <= lodgingReserve);

  if (affordable.length) {
    const chosen = affordable[affordable.length - 1];
    return { hotel: chosen, nightly: chosen.nightly, totalStayCost: chosen.nightly * nights, insufficient: false };
  }

  // Nothing curated fits — always prefer a realistic OYO/MMT budget-tier
  // stay over an unaffordable curated 5-star pick, even if that estimate
  // itself slightly exceeds the budget. It's still far closer to affordable
  // than a luxury hotel, and we flag any real shortfall honestly either way.
  const estNightly = oyoMmtNightlyEstimate(dest.label);
  const estTotal = estNightly * nights;
  return {
    hotel: {
      name: `Budget stay via OYO / MakeMyTrip — ${dest.label}`,
      rating: "2–3 star, budget category",
      price: `₹${estNightly.toLocaleString("en-IN")}/night`,
      why: "Our curated 5-star picks for this city exceed your budget — this reflects typical OYO/MakeMyTrip budget-category pricing here, so your trip stays realistic and actually bookable.",
      nearby: "City centre / well-connected area — exact property shown when you search",
      priority: "Book directly on OYO or MakeMyTrip",
    },
    nightly: estNightly,
    totalStayCost: estTotal,
    insufficient: estTotal > totalBudget,
    source: "oyo-mmt-estimate",
  };
}

/**
 * Splits the total budget across categories. Hotel cost is taken from the
 * ACTUAL selected hotel (nightly rate × nights) rather than a flat
 * percentage, so the numbers reflect a real stay. Everything else is then
 * distributed across the remaining budget using proportional weights, so
 * every category (including hotels) always adds up to exactly `total`.
 */
function budgetSplit(total, hotelStayCost, needsFlight = true) {
  const total_ = Number(total) || 250000;

  // Relative weights for every non-hotel category (must sum to <1, the
  // rest is reserved for hotels). When departure and destination are the
  // same city, there's no flight to book — that weight gets redistributed
  // across the remaining categories instead of being wasted.
  const baseWeights = { flights: 0.22, food: 0.13, localTransport: 0.06, activities: 0.15, shopping: 0.07, buffer: 0.06 };
  const weights = needsFlight ? baseWeights : { ...baseWeights, flights: 0 };
  const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  // Hotel line item is always the REAL selected hotel's cost — never
  // silently capped/shrunk to fit the display, since that's what caused
  // the hotel price and total budget to visibly contradict each other.
  const hotels = Math.round(hotelStayCost ?? total_ * 0.31);

  // If the real hotel cost alone exceeds (or nearly exhausts) the user's
  // budget, there's nothing left to distribute — surface that honestly
  // via `overBudget`/`shortfall` instead of pretending the numbers add up.
  const overBudget = hotels > total_;
  const remaining = Math.max(total_ - hotels, 0);
  const out = { total: total_, hotels, overBudget, shortfall: overBudget ? hotels - total_ : 0 };
  let allocated = 0;
  const keys = Object.keys(weights);
  keys.forEach((key, i) => {
    if (key === "flights" && !needsFlight) {
      out[key] = 0;
      return;
    }
    if (i === keys.length - 1) {
      // last category absorbs any rounding remainder so the sum is exact
      out[key] = Math.max(remaining - allocated, 0);
    } else {
      const amt = Math.round((remaining * weights[key]) / weightSum);
      out[key] = amt;
      allocated += amt;
    }
  });
  return out;
}

function pickHotelSet(dest, days, totalBudget, travelStyle, label, tripDate, travelers) {
  const bookingLinks = buildBookingLinks(label, tripDate, days, travelers);

  if (!dest || !dest.hotels || !dest.hotels.length) {
    return [
      { name: `Search results for ${label}`, rating: "—", price: "—", why: `We don't have curated hotels for ${label} yet — try Delhi, Mumbai, Goa, Jaipur, Udaipur, Manali, Shimla, Rishikesh, Leh-Ladakh, Munnar/Kerala, Agra, or Bali for a fully-real itinerary.`, nearby: "—", priority: "—", bookingLinks },
    ];
  }

  const picked = pickHotelForBudget(dest, days, totalBudget, travelStyle);
  const nights = Math.max(Number(days) || 1, 1);

  const primary = {
    ...picked.hotel,
    allocated: true,
    stayCost: picked.totalStayCost,
    insufficient: !!picked.insufficient,
    source: picked.source || "curated",
    priority: picked.totalStayCost
      ? `Allocated for your budget — ₹${picked.totalStayCost.toLocaleString("en-IN")} for ${nights} night${nights > 1 ? "s" : ""}`
      : picked.hotel.priority,
    bookingLinks,
  };

  // Offer one real alternate (closest-priced different hotel) so the
  // traveler has a second option, clearly marked as not the primary pick.
  const alt = dest.hotels.find((h) => h.name !== primary.name);
  const alternate = alt
    ? { ...alt, allocated: false, stayCost: parseNightlyPrice(alt.price) ? parseNightlyPrice(alt.price) * nights : null, bookingLinks }
    : null;

  return alternate ? [primary, alternate] : [primary];
}

function generateTripCore(formData, dest) {
  const {
    destination,
    tripType = "Couple",
    travelStyle = "Luxury",
    interests = [],
  } = formData;

  const age = calcAge(formData.age);
  const label = dest ? dest.label : destination.split(",")[0];
  const days_ = Number(formData.days) || 7;
  const hotelSet = pickHotelSet(dest, days_, Number(formData.budget) || 250000, travelStyle, label, formData.tripDate, formData.travelers);
  const hotelStayCost = hotelSet.find((h) => h.allocated)?.stayCost ?? null;
  const hotelBookingLinks = hotelSet[0]?.bookingLinks ?? buildBookingLinks(label, formData.tripDate, days_, formData.travelers);

  // If departure city and destination are the same place, there's nothing
  // to fly for — no flight card, and that budget share goes to the rest of
  // the trip instead of sitting unused.
  const sameCity = !!formData.departureCity && slugify(formData.departureCity) === slugify(label);
  const needsFlight = !sameCity;

  // Fold each SELECTED interest that has curated named places (destinations.js
  // `interests` map — e.g. Nightlife -> Hauz Khas Village for Delhi, Beaches
  // -> Baga/Anjuna/Palolem for Goa) into the attractions shown, so the picks
  // the traveler actually tapped are represented with real venues, not just
  // mentioned in the theme text.
  const interestAttractions = {};
  if (dest?.interests) {
    interests.forEach((tag) => {
      if (dest.interests[tag] && dest.interests[tag].length) {
        interestAttractions[tag] = dest.interests[tag];
      }
    });
  }

  const attractions = dest
    ? {
        ...dest.attractions,
        Adventure: interests.includes("Adventure")
          ? dest.attractions.Adventure
          : dest.attractions.Adventure.slice(0, 1),
        ...interestAttractions,
      }
    : {
        Top: [`Central sights of ${label} (add real picks once this destination is in our curated list)`],
        "Hidden Gems": ["Ask a local guide for their favorite quiet spot"],
        Adventure: interests.includes("Adventure") ? ["Locally available adventure activity"] : ["Optional add-on activity"],
        "Free to Enjoy": ["A free public viewpoint or walk"],
      };

  return {
    tripName: `${label} ${travelStyle} Escape`,
    theme: `A ${travelStyle.toLowerCase()} ${tripType.toLowerCase()} journey through ${label}, shaped around ${interests.slice(0, 2).join(" & ") || "your interests"}`,
    mood: age && age < 30 ? "Energetic, spontaneous, golden-hour chasing" : "Slow mornings, refined pace, quiet luxury",
    bestSeason: dest ? dest.bestSeason : "Check seasonal advisories for this destination",
    weather: dest ? dest.weather : "Weather data not yet curated for this destination",
    highlights: [
      `Private ${travelStyle.toLowerCase()}-tier accommodation matched to a ${tripType.toLowerCase()} trip`,
      `Itinerary paced for a balanced travel rhythm`,
      `Experiences curated around: ${interests.join(", ") || "your preferences"}`,
      "A dedicated splurge day, sized to your total budget",
    ],
    budget: budgetSplit(formData.budget, hotelStayCost, needsFlight),
    hotels: hotelSet,
    hotelBookingLinks,
    food: dest
      ? dest.food
      : {
          Breakfast: "Curated data not yet available for this destination",
          Lunch: "Curated data not yet available for this destination",
          Dinner: "Curated data not yet available for this destination",
          "Street Food": "Curated data not yet available for this destination",
          Desserts: "Curated data not yet available for this destination",
          "Must Try": "Curated data not yet available for this destination",
        },
    attractions,
    scores: {
      Budget: 82,
      Luxury: travelStyle === "Luxury" ? 91 : 70,
      Adventure: interests.includes("Adventure") ? 85 : 60,
      Comfort: 95,
      Safety: 88,
      Food: 93,
    },
    overall: 90,
    sameCity,
    flight: sameCity
      ? null
      : {
          fromCode: guessDepartureCode(formData.departureCity),
          fromCity: formData.departureCity || "Delhi",
          toCode: dest ? dest.code : label.slice(0, 3).toUpperCase(),
          toCity: label,
          country: dest ? dest.country : undefined,
        },
  };
}

// A larger, more varied theme pool than the days people typically travel
// for, so titles don't visibly repeat on any normal trip length. First and
// last day are always framed as arrival/departure when there's more than
// one day.
const DAY_THEMES = [
  "Cultural Immersion", "Hidden Corners", "Adventure Day", "Local Flavors Trail",
  "Signature Landmark", "Nature & Views", "Market & Craft Trail", "Slow Morning, Big Evening",
  "Sunset Chasing", "The Splurge", "Off the Main Road", "Golden Hour Wander",
];

function dayTitle(i, days) {
  if (days === 1) return "Arrival, Exploring & Departure";
  if (i === 0) return "Arrival & Settling In";
  if (i === days - 1) return "Leisure & Departure";
  return DAY_THEMES[(i - 1) % DAY_THEMES.length];
}

/**
 * Builds a genuinely day-by-day-different itinerary. Instead of cycling a
 * short attraction list with the same modulo (which repeats the same
 * combination every N days), we pool every real place we have for the
 * destination (Top + Hidden Gems + Adventure + Free-to-enjoy) and step
 * through that pool with an offset per field, so morning/afternoon/evening
 * rarely land on the same combination twice even on longer trips.
 */
function generateItinerary(formData, dest) {
  const days = Number(formData.days) || 7;
  const label = dest ? dest.label : (formData.destination || "").split(",")[0];
  const sameCity = !!formData.departureCity && slugify(formData.departureCity) === slugify(label);
  const budget = budgetSplit(formData.budget, null, !sameCity);
  // Daily spend drawn from the categories a traveler actually spends
  // day-to-day (food, activities), not the whole trip total — hotels &
  // flights are already booked separately. Local (in-city) travel is
  // tracked and shown as its own per-day line so travelers can see exactly
  // how much of each day's budget is for getting around town.
  const dailySpendPool = budget.food + budget.activities;
  const perDayBudget = Math.round(dailySpendPool / days / 10) * 10;
  const perDayLocalTravel = Math.max(Math.round(budget.localTransport / days / 10) * 10, 0);

  if (!dest) {
    return Array.from({ length: days }).map((_, i) => ({
      day: i + 1,
      title: dayTitle(i, days),
      morning: { breakfast: "Breakfast at your accommodation", activity: `Morning exploring around ${label} (day ${i + 1} plan)`, travel: "20–45 min" },
      lunch: "Recommended local restaurant",
      afternoon: "Afternoon activity or leisure time, paced to your preference",
      evening: "Dinner at a highly rated spot nearby",
      night: "Evening experience — nightlife, stargazing, or rest",
      shopping: i === days - 1 ? "Last-minute souvenir run" : "Optional — local market nearby",
      spend: perDayBudget,
      localTravel: perDayLocalTravel,
      map: `Central area of ${label}`,
    }));
  }

  const { Top, "Hidden Gems": Hidden, Adventure, "Free to Enjoy": Free } = dest.attractions;
  const selectedInterests = Array.isArray(formData.interests) ? formData.interests : [];
  const interestPlaces = dest.interests || {};

  // Named places for whatever the traveler actually selected (e.g. Beaches,
  // Culture, Wildlife) get first priority in the morning/afternoon pool, so
  // they show up early in the trip rather than only maybe appearing by
  // chance. Nightlife and Shopping are handled separately below since they
  // map to their own dedicated day fields instead of morning/afternoon.
  const priorityPool = [
    ...new Set(
      selectedInterests
        .filter((tag) => tag !== "Nightlife" && tag !== "Shopping" && interestPlaces[tag]?.length)
        .flatMap((tag) => interestPlaces[tag])
    ),
  ];
  // Combined pool for morning/afternoon anchors, deduplicated, priority-first.
  const pool = [...new Set([...priorityPool, ...Top, ...Hidden, ...Adventure, ...Free])];
  const poolLen = pool.length || 1;

  // If "Nightlife" was selected and this destination has curated venues
  // (e.g. Hauz Khas Village for Delhi), those venues drive the night plan
  // instead of the generic street-food/dessert rotation.
  const nightlifePool = selectedInterests.includes("Nightlife") ? (interestPlaces.Nightlife || []) : [];
  // Same idea for "Shopping" — real markets/bazaars instead of the generic
  // "Try: <Must Try dish>" filler.
  const shoppingPool = selectedInterests.includes("Shopping") ? (interestPlaces.Shopping || []) : [];

  const picked = pickHotelForBudget(dest, days, Number(formData.budget) || 250000, formData.travelStyle || "Luxury");
  const hotelName = picked?.hotel?.name || dest.hotels[0]?.name || label;

  return Array.from({ length: days }).map((_, i) => {
    // Offsets are chosen to be coprime-ish with typical pool sizes so
    // morning/afternoon/night rarely repeat the same place on the same day.
    const morningIdx = i % poolLen;
    const afternoonIdx = (i + Math.ceil(poolLen / 2)) % poolLen;
    const isLastDay = i === days - 1;
    const isSplurge = !isLastDay && i > 0 && (i + 1) % 5 === 0; // occasional "splurge" beat

    return {
      day: i + 1,
      title: dayTitle(i, days),
      morning: {
        breakfast: dest.food.Breakfast,
        activity: `Visit ${pool[morningIdx]}`,
        travel: ["15–30 min", "20–45 min", "30–50 min"][i % 3],
      },
      lunch: i % 2 === 0 ? dest.food.Lunch : `Try the ${dest.food["Street Food"]} instead of a sit-down lunch`,
      afternoon: `Explore ${pool[afternoonIdx]}`,
      evening: isSplurge ? `Splurge night: ${dest.food.Dinner}` : dest.food.Dinner,
      night: nightlifePool.length
        ? `Nightlife: ${nightlifePool[i % nightlifePool.length]}`
        : (i % 2 === 0 ? dest.food["Street Food"] : dest.food.Desserts),
      shopping: isLastDay
        ? "Last-minute souvenir run"
        : shoppingPool.length
          ? `Shop: ${shoppingPool[i % shoppingPool.length]}`
          : `Try: ${dest.food["Must Try"]}`,
      spend: isSplurge ? Math.round(perDayBudget * 1.6 / 10) * 10 : perDayBudget,
      localTravel: perDayLocalTravel,
      map: hotelName,
    };
  });
}

export async function buildTripPlan(formData) {
  const destination = (formData.destination || "").trim();
  if (!destination) {
    const err = new Error("Destination is required");
    err.code = "DESTINATION_REQUIRED";
    throw err;
  }

  const tripDate = (formData.tripDate || "").trim();
  if (!tripDate) {
    const err = new Error("Trip start date is required");
    err.code = "TRIP_DATE_REQUIRED";
    throw err;
  }

  const dest = findDestinationData(destination);
  const label = dest ? dest.label : destination.split(",")[0];

  const trip = generateTripCore(formData, dest);

  // "Happening Nearby" — a live web search for whatever's actually going on
  // during the trip dates (concerts, festivals, pop-ups), plus the curated
  // seasonal/annual events for this destination as a fallback. Always
  // optional: the frontend clearly marks these as "worth checking, not
  // booked into your plan" rather than baking them into the day-by-day.
  const [live, seasonal] = await Promise.all([
    fetchHappeningEvents({ destinationLabel: label, tripDate }),
    Promise.resolve(seasonalEventsForTrip(dest, tripDate)),
  ]);
  trip.happeningEvents = {
    source: live.source, // "live-search" | "unavailable" | "error"
    query: live.query,
    googleSearchUrl: live.googleSearchUrl,
    live: live.events,
    seasonal,
  };

  return {
    trip,
    itinerary: generateItinerary(formData, dest),
    meta: {
      generatedAt: new Date().toISOString(),
      source: "rule-based-v2",
      matched: !!dest,
      matchedDestination: dest ? dest.label : null,
      curatedDestinations: [
        "Delhi", "Mumbai", "Goa", "Jaipur", "Udaipur", "Manali", "Shimla",
        "Leh-Ladakh", "Rishikesh", "Munnar/Kerala", "Agra", "Bali",
      ],
    },
  };
}
