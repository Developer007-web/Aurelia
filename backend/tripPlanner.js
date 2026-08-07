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

function calcAge(formData) {
  // Preferred: an explicit age field. Falls back to a legacy dob field
  // for backwards compatibility with older clients.
  if (formData && formData.age != null && formData.age !== "") {
    const a = Number(formData.age);
    return Number.isFinite(a) ? a : null;
  }
  const dob = formData && formData.dob;
  if (!dob) return null;
  const b = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

function budgetSplit(total) {
  const total_ = Number(total) || 250000;
  const shares = {
    flights: 0.22,
    hotels: 0.31,
    food: 0.13,
    localTransport: 0.06,
    activities: 0.15,
    shopping: 0.07,
    buffer: 0.06,
  };
  const keys = Object.keys(shares);
  const split = { total: total_ };
  let running = 0;
  // Round every category, then push the leftover rounding difference into
  // the last category so the parts always add up exactly to the total —
  // otherwise "Remaining"/"Utilization" drift away from what's displayed.
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      split[k] = total_ - running;
    } else {
      const v = Math.round(total_ * shares[k]);
      split[k] = v;
      running += v;
    }
  });
  return split;
}

function generateTripCore(formData, dest) {
  const {
    destination,
    tripType = "Couple",
    travelStyle = "Luxury",
    interests = [],
  } = formData;

  const age = calcAge(formData);
  const label = dest ? dest.label : destination.split(",")[0];

  const attractions = dest
    ? {
        ...dest.attractions,
        Adventure: interests.includes("Adventure")
          ? dest.attractions.Adventure
          : dest.attractions.Adventure.slice(0, 1),
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
      `Itinerary paced for ${formData.pace || "a balanced"} travel rhythm`,
      `Experiences curated around: ${interests.join(", ") || "your preferences"}`,
      "A dedicated splurge day, sized to your total budget",
    ],
    budget: budgetSplit(formData.budget),
    hotels: dest
      ? dest.hotels
      : [
          { name: `Search results for ${label}`, rating: "—", price: "—", why: `We don't have curated hotels for ${label} yet — try Delhi, Mumbai, Goa, Jaipur, Udaipur, Manali, Shimla, Rishikesh, Leh-Ladakh, Munnar/Kerala, Agra, or Bali for a fully-real itinerary.`, nearby: "—", priority: "—" },
        ],
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
    flight: {
      fromCode: guessDepartureCode(formData.departureCity),
      fromCity: formData.departureCity || "Delhi",
      toCode: dest ? dest.code : label.slice(0, 3).toUpperCase(),
      toCity: label,
      country: dest ? dest.country : undefined,
    },
  };
}

function generateItinerary(formData, dest) {
  const days = Number(formData.days) || 7;
  const label = dest ? dest.label : (formData.destination || "").split(",")[0];
  const titles = ["Arrival & Settling In", "Cultural Immersion", "Adventure Day", "Coastal Transfer", "Signature Landmark", "The Splurge", "Leisure & Departure"];
  const perDayBudget = Math.round((Number(formData.budget) || 250000) / days / 10) * 10;

  const topSpots = dest ? dest.attractions.Top : [];
  const hotelNames = dest ? dest.hotels.map((h) => h.name) : [];

  return Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    title: titles[i % titles.length],
    morning: {
      breakfast: dest ? dest.food.Breakfast : "Breakfast at your accommodation",
      activity: dest ? `Visit ${topSpots[i % topSpots.length]}` : `Morning activity in ${label}`,
      travel: "20–45 min",
    },
    lunch: dest ? dest.food.Lunch : "Recommended local restaurant",
    afternoon: dest
      ? `Explore ${dest.attractions["Hidden Gems"][i % dest.attractions["Hidden Gems"].length]}`
      : "Afternoon activity or leisure time, paced to your preference",
    evening: dest ? dest.food.Dinner : "Dinner at a highly rated spot nearby",
    night: dest ? dest.food["Street Food"] : "Evening experience — nightlife, stargazing, or rest",
    shopping: i === days - 1 ? "Last-minute souvenir run" : dest ? `Try: ${dest.food["Must Try"]}` : "Optional — local market nearby",
    spend: perDayBudget,
    map: dest ? hotelNames[i % hotelNames.length] : `Central area of ${label}`,
  }));
}

export function buildTripPlan(formData) {
  const destination = (formData.destination || "").trim();
  if (!destination) {
    const err = new Error("Destination is required");
    err.code = "DESTINATION_REQUIRED";
    throw err;
  }

  const dest = findDestinationData(destination);

  return {
    trip: generateTripCore(formData, dest),
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
