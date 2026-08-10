/**
 * Curated, real-world destination data (hotels, attractions, food, flight
 * routing) for the most-requested Indian & international destinations.
 * This replaces generic placeholder text ("Signature landmark #1") with
 * actual named places whenever the traveler's destination matches one of
 * these entries. Unmatched destinations fall back to a clearly-labeled
 * generic template in tripPlanner.js (meta.matched = false).
 */

export const DESTINATIONS = {
  delhi: {
    match: ["delhi", "new delhi"],
    label: "Delhi",
    code: "DEL",
    country: "India",
    bestSeason: "October – March (cool, dry winter)",
    weather: "12–25°C in winter; hot & dusty May–June (40°C+)",
    attractions: {
      Top: ["Red Fort", "India Gate", "Qutub Minar", "Humayun's Tomb"],
      "Hidden Gems": ["Lodhi Garden ruins", "Mehrauli Archaeological Park"],
      Adventure: ["Hot-air ballooning near NCR", "Cycling tour of Old Delhi"],
      "Free to Enjoy": ["India Gate lawns at sunset", "Lodhi Garden morning walk"],
    },
    // Interest-specific real named places, keyed EXACTLY to the frontend's
    // interest chips. Used to pull named venues into the itinerary for
    // whatever the traveler actually selected (e.g. Nightlife -> Hauz Khas).
    interests: {
      Nightlife: ["Hauz Khas Village bars & rooftop lounges", "Cyber Hub, Gurugram", "Kitty Su at The Lalit", "PCO Delhi speakeasy"],
      Shopping: ["Chandni Chowk for spices & fabric", "Khan Market boutiques", "Dilli Haat handicrafts market", "Sarojini Nagar street market"],
      Culture: ["Jama Masjid", "National Museum, Delhi", "Red Fort", "Humayun's Tomb"],
      Photography: ["Humayun's Tomb at golden hour", "Lodhi Garden ruins", "Jama Masjid rooftop views at dusk"],
      Spiritual: ["Akshardham Temple", "Lotus Temple", "Gurudwara Bangla Sahib", "Jama Masjid"],
    },
    // Recurring annual events with the month(s) they typically fall in, used
    // to surface a genuinely relevant "Happening Nearby" pick when a trip's
    // dates overlap. Live/current-week events are pulled separately at
    // request time via the events search endpoint — this is the seasonal
    // fallback for months without live coverage.
    events: [
      { name: "India International Trade Fair, Pragati Maidan", months: [11], note: "Huge annual trade & culture fair, late Nov" },
      { name: "Qutub Festival (classical music & dance at Qutub Minar)", months: [10, 11], note: "Evening performances against the Qutub complex" },
      { name: "Delhi Winter Carnival, Hauz Khas", months: [12, 1], note: "Pop-up markets, live music, food stalls" },
      { name: "Holi celebrations across Delhi", months: [3], note: "City-wide colour festival" },
    ],
    hotels: [
      { name: "The Leela Palace New Delhi", rating: "5-star luxury", price: "₹24,000/night", why: "Grand Chanakyapuri palace-style property, close to diplomatic enclave", nearby: "Lodhi Garden, Humayun's Tomb", priority: "Book early — festival season fills fast" },
      { name: "The Oberoi, New Delhi", rating: "5-star luxury", price: "₹27,500/night", why: "Golf-course views, one of the city's most awarded kitchens", nearby: "Delhi Golf Club, Humayun's Tomb", priority: "Book within 2 weeks" },
      { name: "Taj Mahal Hotel, New Delhi", rating: "5-star heritage", price: "₹21,000/night", why: "Classic Lutyens-Delhi address, walking distance to India Gate", nearby: "India Gate, Connaught Place", priority: "Flexible timing" },
      { name: "ITC Maurya", rating: "5-star luxury", price: "₹19,500/night", why: "Home to Bukhara — one of India's most iconic restaurants", nearby: "Diplomatic Enclave", priority: "Book Bukhara table 2 weeks ahead" },
      { name: "The Imperial New Delhi", rating: "5-star heritage", price: "₹22,000/night", why: "Art-deco 1930s icon on Janpath, steeped in colonial history", nearby: "Connaught Place, Janpath Market", priority: "Book early for heritage rooms" },
    ],
    food: {
      Breakfast: "Chole bhature at your hotel or a Cannaught Place café",
      Lunch: "Bukhara at ITC Maurya — legendary dal bukhara & kebabs",
      Dinner: "Indian Accent — modern Indian tasting menu",
      "Street Food": "Paranthe Wali Gali & Chandni Chowk chaat crawl",
      Desserts: "Jalebi at Old Famous Jalebi Wala, Chandni Chowk",
      "Must Try": "Butter chicken at Moti Mahal, Daryaganj",
    },
    flight: { toCode: "DEL" },
  },

  mumbai: {
    match: ["mumbai", "bombay"],
    label: "Mumbai",
    code: "BOM",
    country: "India",
    bestSeason: "November – February (pleasant, dry)",
    weather: "24–33°C, humid; heavy monsoon June–September",
    attractions: {
      Top: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus"],
      "Hidden Gems": ["Sassoon Docks at dawn", "Khotachiwadi heritage lane"],
      Adventure: ["Ferry to Elephanta Island", "Kayaking in Vasai creek"],
      "Free to Enjoy": ["Marine Drive sunset", "Juhu Beach evening walk"],
    },
    interests: {
      Nightlife: ["Bandra's Linking Road & Hill Road bars", "Kitty Su, Andheri", "Aer rooftop bar, Four Seasons Worli", "Bastian, Bandra late-night"],
      Shopping: ["Colaba Causeway street market", "Linking Road, Bandra", "Phoenix Palladium, Lower Parel", "Zaveri Bazaar for jewelry"],
      Culture: ["Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)", "Kala Ghoda Arts District", "Dhobi Ghat"],
      Photography: ["Marine Drive ('Queen's Necklace') at sunset", "Gateway of India at sunrise", "Bandra-Worli Sea Link at night"],
      Beaches: ["Juhu Beach", "Versova Beach", "Aksa Beach"],
    },
    events: [
      { name: "Kala Ghoda Arts Festival", months: [2], note: "9-day citywide street-art & culture festival" },
      { name: "Ganesh Chaturthi immersion processions", months: [8, 9], note: "City-wide, especially Lalbaugcha Raja" },
      { name: "Mumbai Film Festival (MAMI)", months: [10, 11], note: "Major independent film festival" },
      { name: "Prithvi Theatre Festival, Juhu", months: [11], note: "Annual theatre festival" },
    ],
    hotels: [
      { name: "Taj Mahal Palace, Mumbai", rating: "5-star iconic", price: "₹32,000/night", why: "The city's most legendary address, right on the harbour by the Gateway", nearby: "Gateway of India, Colaba Causeway", priority: "Book sea-view room early" },
      { name: "The Oberoi, Mumbai", rating: "5-star luxury", price: "₹29,000/night", why: "Sweeping Marine Drive & Arabian Sea views from every room", nearby: "Marine Drive, Nariman Point", priority: "Book within 2 weeks" },
      { name: "The St. Regis Mumbai", rating: "5-star luxury", price: "₹22,000/night", why: "Best rooftop skyline views in Lower Parel", nearby: "Phoenix Mills, Lower Parel", priority: "Flexible timing" },
      { name: "Trident, Nariman Point", rating: "5-star", price: "₹18,500/night", why: "Excellent value with unbroken Arabian Sea views", nearby: "Marine Drive, Nariman Point", priority: "Book within 2 weeks" },
      { name: "JW Marriott Mumbai Juhu", rating: "5-star resort-style", price: "₹20,000/night", why: "Beachfront resort feel without leaving the city", nearby: "Juhu Beach, ISKCON Temple", priority: "Flexible timing" },
    ],
    food: {
      Breakfast: "Misal pav at a Dadar Irani café",
      Lunch: "Trishna — legendary Koliwada-style seafood",
      Dinner: "Britannia & Co. — Parsi berry pulao (lunch-only, plan ahead)",
      "Street Food": "Vada pav & bhel puri, Mohammed Ali Road",
      Desserts: "Kulfi at Bachelorr's, Chowpatty",
      "Must Try": "Bombay Duck fry & Malvani fish curry",
    },
    flight: { toCode: "BOM" },
  },

  manali: {
    match: ["manali"],
    label: "Manali",
    code: "KUU",
    country: "India",
    bestSeason: "March – June & October – February (snow season Dec–Feb)",
    weather: "5–20°C summer; sub-zero and snowy December–February",
    attractions: {
      Top: ["Solang Valley", "Rohtang Pass", "Hadimba Devi Temple", "Old Manali"],
      "Hidden Gems": ["Jogini Waterfall trek", "Naggar Castle"],
      Adventure: ["Paragliding at Solang", "River rafting on the Beas"],
      "Free to Enjoy": ["Vashisht hot springs", "Beas River walk"],
    },
    interests: {
      Mountains: ["Rohtang Pass", "Solang Valley", "Hampta Pass viewpoint"],
      Snow: ["Rohtang Pass (snow Dec–Feb)", "Solang Valley skiing slopes", "Gulaba snow point"],
      Nature: ["Jogini Waterfall trail", "Beas River banks", "Naggar Castle orchards"],
      Photography: ["Solang Valley meadows", "Old Manali café-and-river views"],
      "Road Trips": ["Manali–Leh Highway (seasonal)", "Kasol & Parvati Valley day trip", "Chandigarh–Manali highway drive"],
      Shopping: ["Mall Road, Manali", "Old Manali Tibetan market"],
      Nightlife: ["Old Manali café-bars (34 Third Street, Johnson's Bar)"],
    },
    events: [
      { name: "Winter Carnival, Manali", months: [1], note: "Skiing, ice-skating, cultural performances" },
      { name: "Hadimba Devi Fair", months: [5], note: "Traditional fair at Hadimba Temple" },
      { name: "Dussehra Kullu (nearby)", months: [10], note: "Famous week-long Kullu Dussehra festival" },
    ],
    hotels: [
      { name: "The Himalayan, Manali", rating: "5-star luxury", price: "₹18,000/night", why: "Riverside stone-and-timber luxury with valley views", nearby: "Manali town, Club House", priority: "Book early for winter season" },
      { name: "Span Resort & Spa", rating: "5-star resort", price: "₹15,500/night", why: "On the Beas River, half-way between Manali and Naggar", nearby: "Naggar Castle, Beas River", priority: "Book within 2 weeks" },
      { name: "Snow Valley Resorts", rating: "4-star boutique", price: "₹9,500/night", why: "Close to Old Manali's café strip, mountain-facing rooms", nearby: "Old Manali, Hadimba Temple", priority: "Flexible timing" },
      { name: "Manuallaya – The Resort Spa", rating: "4-star", price: "₹8,000/night", why: "Quiet orchard setting just outside town, good spa", nearby: "Club House Road", priority: "Flexible timing" },
      { name: "Apple Country Resorts", rating: "4-star", price: "₹7,000/night", why: "Set inside an apple orchard, popular with families", nearby: "Old Manali", priority: "Book early in apple season (Sept)" },
    ],
    food: {
      Breakfast: "Himachali siddu with ghee at a Old Manali café",
      Lunch: "Trout fish, farm-fresh, at a riverside dhaba",
      Dinner: "Full Himachali Dham thali (rajma, madra, chana)",
      "Street Food": "Momos on the Mall Road stalls",
      Desserts: "Apple crumble — Manali's apple orchards are famous",
      "Must Try": "Chandan Vaishno Dhaba's thali",
    },
    flight: { toCode: "KUU (Bhuntar/Kullu, then 50 km drive) or drive from Chandigarh (5–6h)" },
  },

  goa: {
    match: ["goa"],
    label: "Goa",
    code: "GOI",
    country: "India",
    bestSeason: "November – February (dry, pleasant)",
    weather: "24–32°C; heavy monsoon June–September, best avoided",
    attractions: {
      Top: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"],
      "Hidden Gems": ["Chapora Fort at sunset", "Divar Island by ferry"],
      Adventure: ["Dudhsagar jeep safari", "Scuba diving off Grande Island"],
      "Free to Enjoy": ["Anjuna flea market (Wed)", "Palolem Beach sunset"],
    },
    interests: {
      Nightlife: ["Tito's Lane, Baga", "Curlies, Anjuna", "Club Cubana, Arpora", "Silent noise beach party, Vagator"],
      Beaches: ["Baga Beach", "Anjuna Beach", "Palolem Beach", "Vagator Beach", "Candolim Beach"],
      Shopping: ["Anjuna Flea Market (Wed)", "Mapusa Municipal Market", "Saturday Night Market, Arpora"],
      Culture: ["Basilica of Bom Jesus", "Se Cathedral, Old Goa", "Fontainhas Latin Quarter"],
      Photography: ["Chapora Fort at sunset", "Palolem Beach at dawn", "Fontainhas' colourful lanes"],
    },
    events: [
      { name: "Goa Carnival", months: [2], note: "Colourful street parades across Goa" },
      { name: "Sunburn Festival, Vagator", months: [12], note: "One of Asia's largest EDM festivals" },
      { name: "Saturday Night Market, Arpora", months: [11, 12, 1, 2, 3], note: "Weekly Nov–Mar flea market with live music" },
      { name: "Shigmo Festival", months: [3], note: "Goa's traditional spring festival with processions" },
    ],
    hotels: [
      { name: "Taj Exotica Resort & Spa, Benaulim", rating: "5-star luxury", price: "₹26,000/night", why: "Manicured beachfront resort, South Goa's most refined stay", nearby: "Benaulim Beach", priority: "Book early for sea-facing villas" },
      { name: "W Goa", rating: "5-star design", price: "₹24,000/night", why: "Vagator clifftop resort with a lively design-forward energy", nearby: "Vagator Beach, Chapora Fort", priority: "Book within 2 weeks" },
      { name: "The Leela Goa", rating: "5-star luxury", price: "₹22,500/night", why: "Set on a private peninsula between river and sea", nearby: "Mobor Beach", priority: "Flexible timing" },
      { name: "Alila Diwa Goa", rating: "5-star", price: "₹15,000/night", why: "Terraced rice-paddy setting near Majorda Beach", nearby: "Majorda Beach", priority: "Flexible timing" },
      { name: "Vivenda dos Palhaços", rating: "Boutique heritage", price: "₹7,000/night", why: "Portuguese-era mansion turned intimate boutique hotel", nearby: "Majorda", priority: "Book early — limited rooms" },
    ],
    food: {
      Breakfast: "Goan poi bread with omelette at a beach shack",
      Lunch: "Fish curry rice at a Betalbatim beach shack",
      Dinner: "Prawn balchão and pork vindaloo, Panjim old-quarter",
      "Street Food": "Ros omelette & chorizo pao",
      Desserts: "Bebinca, the layered Goan classic",
      "Must Try": "Feni tasting at a local bar",
    },
    flight: { toCode: "GOI/GOX" },
  },

  jaipur: {
    match: ["jaipur"],
    label: "Jaipur",
    code: "JAI",
    country: "India",
    bestSeason: "October – March (pleasant, dry)",
    weather: "8–25°C winter; scorching 40°C+ in May–June",
    attractions: {
      Top: ["Amber Fort", "Hawa Mahal", "City Palace", "Jal Mahal"],
      "Hidden Gems": ["Nahargarh Fort at sunset", "Panna Meena ka Kund stepwell"],
      Adventure: ["Elephant Village visit, Amber", "Hot-air ballooning over Jaipur"],
      "Free to Enjoy": ["Hawa Mahal exterior at sunrise", "Jal Mahal lakeside view"],
    },
    interests: {
      Culture: ["Amber Fort", "City Palace, Jaipur", "Jantar Mantar"],
      Shopping: ["Johari Bazaar for jewelry", "Bapu Bazaar for textiles & juttis", "Tripolia Bazaar for lac bangles"],
      Nightlife: ["Bar Palladio", "Rooftop bar at Nahargarh, Ki Terrace"],
      Photography: ["Hawa Mahal at sunrise", "Nahargarh Fort viewpoint at dusk", "Patrika Gate, Jawahar Circle"],
      Spiritual: ["Govind Dev Ji Temple", "Galtaji (Monkey Temple)"],
    },
    events: [
      { name: "Jaipur Literature Festival", months: [1, 2], note: "World's largest free literary festival" },
      { name: "Elephant Festival, Jaipur", months: [3], note: "Holi-time elephant parade & polo" },
      { name: "Teej Festival", months: [7, 8], note: "Processions celebrating monsoon" },
    ],
    hotels: [
      { name: "Rambagh Palace", rating: "5-star palace", price: "₹35,000/night", why: "Former Maharaja's residence, Jaipur's most iconic address", nearby: "Central Jaipur", priority: "Book palace-view rooms early" },
      { name: "Taj Jai Mahal Palace", rating: "5-star heritage", price: "₹18,000/night", why: "18-acre Mughal gardens in the heart of the Pink City", nearby: "Civil Lines", priority: "Book within 2 weeks" },
      { name: "Fairmont Jaipur", rating: "5-star luxury", price: "₹16,000/night", why: "Rajputana-style palace on the outskirts, striking architecture", nearby: "Ajmer Road", priority: "Flexible timing" },
      { name: "ITC Rajputana", rating: "5-star", price: "₹13,500/night", why: "Central location, strong traditional Rajasthani hospitality", nearby: "Railway Station area", priority: "Flexible timing" },
      { name: "Alsisar Haveli", rating: "Heritage boutique", price: "₹6,500/night", why: "Restored 19th-century haveli with courtyard charm", nearby: "Old City", priority: "Book early — limited rooms" },
    ],
    food: {
      Breakfast: "Pyaaz kachori at Rawat Mishthan Bhandar",
      Lunch: "Dal baati churma, thali-style",
      Dinner: "Laal maas at Suvarna Mahal, Rambagh Palace",
      "Street Food": "Chaat at Laxmi Mishthan Bhandar (LMB)",
      Desserts: "Ghewar during festival season",
      "Must Try": "Gatte ki sabzi",
    },
    flight: { toCode: "JAI" },
  },

  udaipur: {
    match: ["udaipur"],
    label: "Udaipur",
    code: "UDR",
    country: "India",
    bestSeason: "September – March (post-monsoon, cool)",
    weather: "10–28°C winter; lake levels best just after monsoon",
    attractions: {
      Top: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon ki Bari"],
      "Hidden Gems": ["Bagore ki Haveli evening dance show", "Monsoon Palace at sunset"],
      Adventure: ["Boat ride to Jag Mandir", "Kumbhalgarh Fort day trip"],
      "Free to Enjoy": ["Fateh Sagar Lake promenade", "Old City ghats at dusk"],
    },
    interests: {
      Culture: ["City Palace, Udaipur", "Jagdish Temple", "Bagore ki Haveli"],
      Nightlife: ["Ambrai rooftop bar, lake-facing", "Upre by 1559 AD rooftop lounge"],
      Shopping: ["Hathi Pol Bazaar for miniature paintings", "Bapu Bazaar, Udaipur"],
      Photography: ["Lake Pichola at sunset", "Monsoon Palace viewpoint"],
      Spiritual: ["Jagdish Temple", "Eklingji Temple (22 km outside town)"],
    },
    events: [
      { name: "Mewar Festival, Udaipur", months: [3, 4], note: "Spring festival with processions along Lake Pichola" },
      { name: "World Music Festival, Udaipur", months: [2], note: "Live performances across heritage venues" },
    ],
    hotels: [
      { name: "Taj Lake Palace", rating: "5-star iconic", price: "₹42,000/night", why: "The floating white-marble palace in the middle of Lake Pichola", nearby: "Lake Pichola", priority: "Book 3+ months ahead" },
      { name: "The Oberoi Udaivilas", rating: "5-star luxury", price: "₹48,000/night", why: "Consistently rated among the world's best hotels, lakeside domes", nearby: "Lake Pichola", priority: "Book 3+ months ahead" },
      { name: "The Leela Palace Udaipur", rating: "5-star luxury", price: "₹30,000/night", why: "Private peninsula on Lake Pichola facing the City Palace", nearby: "Lake Pichola", priority: "Book within 2 weeks" },
      { name: "Radisson Blu Udaipur Palace Resort", rating: "5-star", price: "₹14,000/night", why: "Fateh Sagar lakefront, good value with lake views", nearby: "Fateh Sagar Lake", priority: "Flexible timing" },
      { name: "Amet Haveli", rating: "Heritage boutique", price: "₹8,000/night", why: "300-year-old haveli directly on Lake Pichola", nearby: "Lake Pichola ghats", priority: "Book early — limited rooms" },
    ],
    food: {
      Breakfast: "Poha and masala chai lakeside",
      Lunch: "Dal baati churma at Ambrai, lake-facing terrace",
      Dinner: "Rooftop dinner at Upre by 1559 AD, City Palace views",
      "Street Food": "Mirchi bada near Jagdish Chowk",
      Desserts: "Malpua from a Chetak Circle sweet shop",
      "Must Try": "Gatte ki sabzi and Kair sangri",
    },
    flight: { toCode: "UDR" },
  },

  shimla: {
    match: ["shimla"],
    label: "Shimla",
    code: "SLV",
    country: "India",
    bestSeason: "March – June & December – January (snow)",
    weather: "0–10°C winter with snow; 15–28°C pleasant summer",
    attractions: {
      Top: ["The Ridge", "Mall Road", "Jakhu Temple", "Kufri"],
      "Hidden Gems": ["Chadwick Falls", "Summer Hill viewpoint"],
      Adventure: ["Skiing at Kufri (winter)", "Toy train ride from Kalka"],
      "Free to Enjoy": ["The Ridge sunset", "Christ Church exterior"],
    },
    interests: {
      Snow: ["Kufri skiing slopes (winter)", "The Ridge under snow"],
      Mountains: ["Jakhu Hill", "Kufri viewpoint"],
      Nature: ["Chadwick Falls", "Summer Hill"],
      Shopping: ["Mall Road, Shimla", "Lakkar Bazaar for wooden crafts"],
      "Road Trips": ["Shimla–Kufri drive", "Narkanda day trip"],
      Photography: ["The Ridge at sunset", "Christ Church against snow"],
    },
    events: [
      { name: "Shimla Summer Festival", months: [5, 6], note: "Music, food & cultural events on The Ridge" },
      { name: "Winter Carnival, Shimla", months: [12, 1], note: "Ice-skating & snow-season celebrations" },
    ],
    hotels: [
      { name: "Wildflower Hall, An Oberoi Resort", rating: "5-star luxury", price: "₹32,000/night", why: "Forested mountaintop estate once Lord Kitchener's residence", nearby: "Mashobra, Shimla outskirts", priority: "Book early for winter snow season" },
      { name: "The Oberoi Cecil", rating: "5-star heritage", price: "₹18,000/night", why: "Colonial-era landmark right off the Mall Road", nearby: "Mall Road, The Ridge", priority: "Book within 2 weeks" },
      { name: "Clarkes Hotel", rating: "Heritage", price: "₹10,000/night", why: "Shimla's oldest hotel (est. 1898), central Ridge location", nearby: "The Ridge", priority: "Flexible timing" },
      { name: "Snow Valley Resorts, Shimla", rating: "4-star", price: "₹7,500/night", why: "Quiet, forested, short drive from Mall Road", nearby: "Chotta Shimla", priority: "Flexible timing" },
    ],
    food: {
      Breakfast: "Siddu with dal at a Mall Road café",
      Lunch: "Chana madra, Himachali-style",
      Dinner: "Trout curry at a Ridge-side restaurant",
      "Street Food": "Momos and Maggi at the Ridge stalls",
      Desserts: "Roasted chestnuts in winter",
      "Must Try": "Himachali Dham thali",
    },
    flight: { toCode: "SLV (small airport) or drive from Chandigarh (3h)" },
  },

  leh: {
    match: ["leh", "ladakh"],
    label: "Leh-Ladakh",
    code: "IXL",
    country: "India",
    bestSeason: "May – September (roads open, passes clear)",
    weather: "5–25°C summer; extreme sub-zero winters, roads shut Oct–Apr",
    attractions: {
      Top: ["Pangong Lake", "Nubra Valley", "Magnetic Hill", "Leh Palace"],
      "Hidden Gems": ["Shanti Stupa at sunrise", "Diskit Monastery"],
      Adventure: ["Khardung La ride", "Camel safari, Nubra dunes"],
      "Free to Enjoy": ["Shanti Stupa view", "Leh Main Bazaar stroll"],
    },
    interests: {
      Mountains: ["Khardung La", "Nubra Valley sand dunes"],
      Nature: ["Pangong Lake", "Magnetic Hill"],
      Spiritual: ["Diskit Monastery", "Thiksey Monastery", "Hemis Monastery"],
      "Road Trips": ["Leh–Nubra Valley drive via Khardung La", "Leh–Pangong Lake road trip"],
      Wildlife: ["Hemis National Park (snow leopard habitat)"],
      Photography: ["Pangong Lake at sunrise", "Magnetic Hill optical-illusion stop"],
    },
    events: [
      { name: "Hemis Festival, Hemis Monastery", months: [6, 7], note: "Masked Cham dance festival" },
      { name: "Ladakh Festival, Leh", months: [9], note: "Cultural showcase — archery, polo, folk dance" },
    ],
    hotels: [
      { name: "The Grand Dragon Ladakh", rating: "5-star", price: "₹14,000/night", why: "Leh's most refined hotel, oxygen-enriched rooms available", nearby: "Leh town center", priority: "Book early — high season fills fast" },
      { name: "Nimmu House", rating: "Heritage boutique", price: "₹11,000/night", why: "18th-century royal residence on the Indus, 25 min from Leh", nearby: "Nimmu village, Indus River", priority: "Book early — limited rooms" },
      { name: "Chospa Ladakh", rating: "4-star boutique", price: "₹8,000/night", why: "Contemporary design with mountain views close to town", nearby: "Leh town", priority: "Flexible timing" },
    ],
    food: {
      Breakfast: "Butter tea and Tibetan bread",
      Lunch: "Thukpa (noodle soup) at a Leh Market café",
      Dinner: "Skyu, a traditional Ladakhi pasta-stew",
      "Street Food": "Momos at Leh Main Bazaar",
      Desserts: "Apricot delicacies — Ladakh apricots are prized",
      "Must Try": "Chhutagi, a Ladakhi dumpling-pasta dish",
    },
    flight: { toCode: "IXL" },
  },

  rishikesh: {
    match: ["rishikesh"],
    label: "Rishikesh",
    code: "DED",
    country: "India",
    bestSeason: "September – November & February – April",
    weather: "15–35°C; monsoon June–August brings high river levels",
    attractions: {
      Top: ["Laxman Jhula", "Ram Jhula", "Triveni Ghat Ganga Aarti", "Beatles Ashram"],
      "Hidden Gems": ["Neer Garh Waterfall", "Kunjapuri Temple sunrise"],
      Adventure: ["White-water rafting on the Ganges", "Bungee jumping at Jumpin Heights"],
      "Free to Enjoy": ["Triveni Ghat evening aarti", "Ram Jhula riverside walk"],
    },
    interests: {
      Spiritual: ["Triveni Ghat Ganga Aarti", "Parmarth Niketan ashram", "Beatles Ashram"],
      Nature: ["Neer Garh Waterfall", "Ganges riverbanks"],
      Shopping: ["Ram Jhula market for spiritual souvenirs"],
      "Road Trips": ["Rishikesh–Devprayag drive"],
      Photography: ["Laxman Jhula suspension bridge", "Ganga Aarti at dusk"],
    },
    events: [
      { name: "International Yoga Festival, Parmarth Niketan", months: [3], note: "Week-long yoga & wellness gathering" },
      { name: "Ganga Dussehra", months: [6], note: "Major riverside festival on the Ganges" },
    ],
    hotels: [
      { name: "Ananda in the Himalayas", rating: "5-star wellness resort", price: "₹40,000/night", why: "World-renowned Himalayan wellness retreat above the Ganges", nearby: "Narendra Nagar, above Rishikesh", priority: "Book early — wellness packages fill fast" },
      { name: "Taj Rishikesh Resort & Spa", rating: "5-star", price: "₹19,000/night", why: "Riverside resort right on the Ganges with adventure activities", nearby: "Ganges riverfront", priority: "Book within 2 weeks" },
      { name: "Aloha on the Ganges", rating: "4-star riverside", price: "₹9,500/night", why: "Cottages directly on the riverbank, popular for yoga retreats", nearby: "Ganges riverfront", priority: "Flexible timing" },
    ],
    food: {
      Breakfast: "Sattvic vegetarian thali (no onion/garlic, common here)",
      Lunch: "Thali at Chotiwala, Ram Jhula's most famous eatery",
      Dinner: "German Bakery riverside café",
      "Street Food": "Aloo puri at a Laxman Jhula stall",
      Desserts: "Fresh fruit lassi",
      "Must Try": "Ganga aarti followed by a riverside thali",
    },
    flight: { toCode: "DED (Dehradun, 35 km)" },
  },

  munnar: {
    match: ["munnar", "kerala", "kochi", "alleppey", "alappuzha"],
    label: "Munnar & Kerala Backwaters",
    code: "COK",
    country: "India",
    bestSeason: "September – March (post-monsoon, cool)",
    weather: "15–25°C in Munnar hills; humid 24–32°C in backwaters",
    attractions: {
      Top: ["Munnar tea gardens", "Alleppey backwater houseboat cruise", "Periyar Wildlife Sanctuary, Thekkady", "Fort Kochi"],
      "Hidden Gems": ["Top Station viewpoint", "Kumarakom bird sanctuary"],
      Adventure: ["Spice plantation trek, Thekkady", "Bamboo rafting in Periyar"],
      "Free to Enjoy": ["Fort Kochi Chinese fishing nets at sunset", "Tea garden walks, Munnar"],
    },
    interests: {
      Nature: ["Munnar tea gardens", "Kumarakom bird sanctuary"],
      Wildlife: ["Periyar Wildlife Sanctuary, Thekkady", "Kumarakom bird sanctuary"],
      Mountains: ["Top Station viewpoint", "Munnar tea hills"],
      Photography: ["Tea garden rows at sunrise", "Alleppey backwater reflections"],
      Shopping: ["Spice plantations & markets, Munnar", "Fort Kochi antique shops"],
      Culture: ["Fort Kochi Chinese fishing nets", "Kathakali performance, Kochi"],
    },
    events: [
      { name: "Onam festival celebrations", months: [8, 9], note: "Kerala's biggest festival — boat races, feasts" },
      { name: "Nehru Trophy Boat Race, Alleppey", months: [8], note: "Famous snake-boat race on the backwaters" },
      { name: "Kochi-Muziris Biennale", months: [12, 1, 2, 3], note: "Major contemporary art exhibition (odd years)" },
    ],
    hotels: [
      { name: "Kumarakom Lake Resort", rating: "5-star luxury", price: "₹28,000/night", why: "Heritage-style lake villas, one of Kerala's most awarded resorts", nearby: "Vembanad Lake", priority: "Book early for lake villas" },
      { name: "Windermere Estate, Munnar", rating: "Boutique plantation", price: "₹12,000/night", why: "Working cardamom & coffee estate with valley views", nearby: "Munnar tea gardens", priority: "Book within 2 weeks" },
      { name: "Taj Malabar Resort & Spa, Kochi", rating: "5-star", price: "₹16,000/night", why: "Harbor-front colonial-era property in Fort Kochi", nearby: "Fort Kochi, Chinese fishing nets", priority: "Flexible timing" },
      { name: "Punnamada Backwater Resort", rating: "4-star houseboat & resort", price: "₹9,000/night", why: "Combine a houseboat night with resort comfort", nearby: "Alleppey backwaters", priority: "Book houseboat 2 weeks ahead" },
    ],
    food: {
      Breakfast: "Appam with vegetable stew",
      Lunch: "Kerala Sadya on a banana leaf",
      Dinner: "Fish moilee, cooked in coconut milk",
      "Street Food": "Banana chips and Kerala-style bonda",
      Desserts: "Payasam",
      "Must Try": "Karimeen (pearl spot fish) pollichathu",
    },
    flight: { toCode: "COK (Kochi, gateway to Munnar & backwaters)" },
  },

  agra: {
    match: ["agra"],
    label: "Agra",
    code: "AGR",
    country: "India",
    bestSeason: "October – March (cool, clear skies for Taj views)",
    weather: "8–25°C winter; scorching 40°C+ summer",
    attractions: {
      Top: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
      "Hidden Gems": ["Itmad-ud-Daulah (Baby Taj)", "Sikandra, Akbar's Tomb"],
      Adventure: ["Sunrise cycling tour to the Taj", "Village walk near Fatehpur Sikri"],
      "Free to Enjoy": ["Mehtab Bagh sunset view of the Taj", "Yamuna riverfront walk"],
    },
    interests: {
      Culture: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
      Shopping: ["Sadar Bazaar for marble inlay & leather", "Kinari Bazaar"],
      Photography: ["Taj Mahal at sunrise from Mehtab Bagh", "Agra Fort ramparts"],
    },
    events: [
      { name: "Taj Mahotsav, Agra", months: [2], note: "10-day arts, crafts & culture festival near the Taj" },
    ],
    hotels: [
      { name: "The Oberoi Amarvilas", rating: "5-star luxury", price: "₹45,000/night", why: "Every room has a direct Taj Mahal view, 600m away", nearby: "Taj Mahal East Gate", priority: "Book 2+ months ahead for Taj-facing rooms" },
      { name: "ITC Mughal", rating: "5-star", price: "₹16,000/night", why: "Mughal-garden inspired sprawling property", nearby: "Taj Mahal (2 km)", priority: "Book within 2 weeks" },
      { name: "Trident Agra", rating: "5-star", price: "₹9,500/night", why: "Excellent value, red-sandstone architecture close to the Taj", nearby: "Taj Mahal (1 km)", priority: "Flexible timing" },
    ],
    food: {
      Breakfast: "Bedai with aloo sabzi, an Agra breakfast classic",
      Lunch: "Mughlai kebabs at a Sadar Bazaar restaurant",
      Dinner: "Rooftop dinner with a Taj Mahal view",
      "Street Food": "Petha (Agra's iconic sweet) tasting",
      Desserts: "Petha in multiple flavors",
      "Must Try": "Mughlai-style Dal Moth",
    },
    flight: { toCode: "AGR (limited flights) — most visitors arrive by train/road from Delhi (3–4h)" },
  },

  bali: {
    match: ["bali", "ubud", "seminyak", "denpasar"],
    label: "Bali",
    code: "DPS",
    country: "Indonesia",
    bestSeason: "May – September (Dry Season)",
    weather: "28–32°C, low humidity, occasional evening showers",
    attractions: {
      Top: ["Tegalalang Rice Terrace", "Uluwatu Temple", "Tirta Empul", "Mount Batur"],
      "Hidden Gems": ["Tibumana Waterfall", "Sidemen Valley"],
      Adventure: ["Mount Batur sunrise trek", "Ayung River rafting"],
      "Free to Enjoy": ["Campuhan Ridge Walk", "Kuta Beach sunset"],
    },
    interests: {
      Nightlife: ["Sky Garden & Bounty, Kuta", "Potato Head Beach Club, Seminyak", "La Plancha, Seminyak", "Single Fin, Uluwatu"],
      Beaches: ["Kuta Beach", "Seminyak Beach", "Double-Six Beach", "Jimbaran Bay"],
      Shopping: ["Ubud Art Market", "Seminyak Village boutiques", "Beachwalk Mall, Kuta"],
      Culture: ["Uluwatu Temple Kecak fire dance", "Ubud Palace", "Tirta Empul purification ceremony"],
      Photography: ["Tegalalang Rice Terrace", "Uluwatu cliffs at sunset"],
      Spiritual: ["Tirta Empul holy spring", "Besakih Mother Temple"],
    },
    events: [
      { name: "Bali Arts Festival, Denpasar", months: [6, 7], note: "Month-long celebration of Balinese arts & dance" },
      { name: "Nyepi (Day of Silence)", months: [3], note: "Island-wide silence day — plan around it, not during it" },
      { name: "Ubud Writers & Readers Festival", months: [10], note: "Major literary festival" },
    ],
    hotels: [
      { name: "Villa Kayu Ubud", rating: "5-star boutique", price: "₹22,000/night", why: "Secluded jungle villa with private pool, ideal for a slow, romantic pace", nearby: "Tegalalang Rice Terrace, Ubud Palace", priority: "Book first — limited villas" },
      { name: "The Kayana Seminyak", rating: "5-star", price: "₹19,500/night", why: "Adults-only sanctuary, steps from Seminyak's best beach clubs", nearby: "Double-Six Beach, La Plancha", priority: "Book within 2 weeks" },
      { name: "Four Seasons Resort Bali at Jimbaran Bay", rating: "5-star luxury", price: "₹48,000/night", why: "The splurge night — private beachfront pavilion", nearby: "Jimbaran seafood beach cafés", priority: "Book 1 night only" },
      { name: "Komaneka at Bisma", rating: "5-star boutique", price: "₹17,000/night", why: "Valley-view suites, excellent for photography lovers and quiet mornings", nearby: "Campuhan Ridge Walk", priority: "Flexible timing" },
      { name: "Alila Uluwatu", rating: "5-star design hotel", price: "₹31,000/night", why: "Clifftop infinity pool, best sunset in Bali", nearby: "Uluwatu Temple, Single Fin", priority: "Book early for cliffside room" },
    ],
    food: {
      Breakfast: "Nasi goreng with a soft egg at your villa, or Seniman Coffee Studio",
      Lunch: "Locavore (Ubud) — degustation using hyper-local ingredients",
      Dinner: "Jimbaran Bay beachside seafood grill, table in the sand",
      "Street Food": "Warung Babi Guling Ibu Oka",
      Desserts: "Es campur and fresh mangosteen",
      "Must Try": "Bebek Betutu (slow-roasted spiced duck)",
    },
    flight: { toCode: "DPS" },
  },
};

const AIRPORT_CODES = {
  delhi: "DEL", "new delhi": "DEL", mumbai: "BOM", bombay: "BOM",
  bangalore: "BLR", bengaluru: "BLR", chennai: "MAA", kolkata: "CCU",
  hyderabad: "HYD", pune: "PNQ", chandigarh: "IXC", goa: "GOI",
  jaipur: "JAI", ahmedabad: "AMD", kochi: "COK", lucknow: "LKO",
};

export function findDestinationData(destinationInput) {
  if (!destinationInput || !destinationInput.trim()) return null;
  const q = destinationInput.toLowerCase();
  for (const key of Object.keys(DESTINATIONS)) {
    const entry = DESTINATIONS[key];
    if (entry.match.some((alias) => q.includes(alias))) {
      return entry;
    }
  }
  return null;
}

export function guessDepartureCode(cityName) {
  if (!cityName) return "DEL";
  const q = cityName.toLowerCase().trim();
  return AIRPORT_CODES[q] || cityName.slice(0, 3).toUpperCase();
}
