import React, { useState, useEffect, useRef, useMemo } from "react";

/* ============================================================
   DESIGN SYSTEM
   Subject: a private travel concierge. The signature element is
   the boarding pass / ticket stub — perforated edges, a dashed
   cut-line, mono data readouts — used for flights, the day-by-day
   itinerary selector, and the visa stamp. It's the one motif that
   could only belong to a travel product.
   ============================================================ */
const C = {
  primary: "#0B0F19",   // Midnight Black
  secondary: "#121826", // Luxury Navy
  gold: "#D4AF37",      // Accent Gold — spent sparingly, on gestures not surfaces
  rose: "#C9A36B",      // Rose Gold
  jade: "#3E7C6B",       // second accent: quiet, cool counterweight to gold
  ivory: "#F8F6F2",
  white: "#FFFFFF",
  slate: "#2A3441",
  glass: "rgba(255,255,255,.055)",
  border: "rgba(212,175,55,.22)",
  success: "#3CB371",
  danger: "#C0392B",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,450;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const pageBg = {
  background:
    "radial-gradient(1200px 700px at 15% -10%, rgba(212,175,55,.05), transparent), linear-gradient(180deg, #0B0F19 0%, #0E141F 45%, #121826 100%)",
};

/* ============================================================
   MOTION PRIMITIVES
   ============================================================ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 22 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedBar({ pct, label, color = C.gold, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(248,246,242,.7)", marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 7, borderRadius: 6, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
        <div
          style={{
            width: visible ? `${pct}%` : "0%",
            height: "100%",
            borderRadius: 6,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            transition: `width 1.1s cubic-bezier(.16,1,.3,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function CountUp({ to, duration = 1200, prefix = "", suffix = "" }) {
  const [ref, visible] = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

/* ============================================================
   SHARED UI
   ============================================================ */
/* Ambient floating particles behind the hero — pure CSS animation */
function AmbientField() {
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 8,
        dur: 10 + Math.random() * 12,
        drift: -40 + Math.random() * 80,
        color: i % 3 === 0 ? C.rose : i % 3 === 1 ? C.jade : C.gold,
      })),
    []
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {dots.map((d) => (
        <span
          key={d.id}
          style={{
            position: "absolute",
            left: `${d.left}%`,
            bottom: -20,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: 0.35,
            filter: "blur(.5px)",
            animation: `floatUp ${d.dur}s linear ${d.delay}s infinite`,
            "--drift": `${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function Shimmer({ height = 14, width = "100%" }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: 6,
        background: "linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(212,175,55,.14) 50%, rgba(255,255,255,.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

/* Full-page loading state while the concierge "plans" the trip */
function PlanningLoader({ destination }) {
  const steps = [
    "Reading your preferences",
    `Mapping real places in ${destination || "your destination"}`,
    "Balancing the budget",
    "Building the day-by-day itinerary",
    "Polishing the details",
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ maxWidth: 560, margin: "80px auto", textAlign: "center" }}>
      <div
        style={{
          width: 72,
          height: 72,
          margin: "0 auto 28px",
          borderRadius: "50%",
          border: `2px solid rgba(212,175,55,.15)`,
          borderTopColor: C.gold,
          borderRightColor: C.rose,
          animation: "spin 1s cubic-bezier(.5,0,.5,1) infinite",
        }}
      />
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: C.ivory, marginBottom: 22 }}>
        Crafting your escape…
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", maxWidth: 340, margin: "0 auto" }}>
        {steps.map((s, i) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: i === active ? C.gold : i < active ? "rgba(248,246,242,.5)" : "rgba(248,246,242,.25)",
              transition: "color .3s",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i <= active ? C.gold : "rgba(255,255,255,.15)",
                boxShadow: i === active ? `0 0 10px ${C.gold}` : "none",
                transition: "all .3s",
              }}
            />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlassCard({ children, style, hover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: C.glass,
        border: `1px solid ${hover && hovered ? "rgba(212,175,55,.4)" : C.border}`,
        borderRadius: 16,
        padding: "26px",
        backdropFilter: "blur(16px)",
        transform: hover && hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover && hovered ? "0 14px 34px rgba(0,0,0,.35), 0 0 30px rgba(212,175,55,.1)" : "0 4px 18px rgba(0,0,0,.2)",
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, accent = C.gold }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 19, opacity: 0.9 }}>{icon}</span>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontOpticalSizing: "auto", fontWeight: 450, fontSize: 27, color: C.ivory, letterSpacing: 0.2, margin: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && <p style={{ color: "rgba(248,246,242,.5)", fontSize: 13, margin: "6px 0 0 31px" }}>{subtitle}</p>}
      <div style={{ height: 1, width: 64, background: accent, marginTop: 14, marginLeft: 31, opacity: 0.6 }} />
    </div>
  );
}

function Tag({ children, tone = "gold" }) {
  const color = tone === "jade" ? C.jade : C.gold;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 13px",
        borderRadius: 999,
        fontSize: 11.5,
        color,
        border: `1px solid ${color}44`,
        background: `${color}14`,
        marginRight: 8,
        marginBottom: 8,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12, color: "rgba(248,246,242,.55)", fontFamily: "'Inter', sans-serif" }}>
      <span style={{ letterSpacing: 0.5, textTransform: "uppercase", fontSize: 10.5 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,.04)",
  border: `1px solid rgba(255,255,255,.1)`,
  borderRadius: 10,
  padding: "11px 13px",
  color: C.ivory,
  fontSize: 14,
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color .2s",
};

function focusRing(e) { e.target.style.borderColor = C.gold; }
function blurRing(e) { e.target.style.borderColor = "rgba(255,255,255,.1)"; }

/* ============================================================
   CUSTOM ANIMATED DATE PICKER (no native <input type=date>)
   ============================================================ */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange, label = "Date", minYearsAhead = false }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    if (value) return new Date(value);
    return minYearsAhead ? new Date() : new Date(1996, 0, 1);
  });
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const firstDow = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];

  const selected = value ? new Date(value) : null;
  const isSelected = (d) => selected && selected.getDate() === d && selected.getMonth() === view.getMonth() && selected.getFullYear() === view.getFullYear();

  const years = [];
  const thisYear = new Date().getFullYear();
  if (minYearsAhead) {
    for (let y = thisYear; y <= thisYear + 3; y++) years.push(y);
  } else {
    for (let y = thisYear - 5; y >= thisYear - 90; y--) years.push(y);
  }

  const displayVal = value
    ? `${String(new Date(value).getDate()).padStart(2, "0")} ${MONTHS[new Date(value).getMonth()].slice(0,3)} ${new Date(value).getFullYear()}`
    : "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Field label={label}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            ...inputStyle,
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: open ? C.gold : "rgba(255,255,255,.1)",
          }}
        >
          <span style={{ color: displayVal ? C.ivory : "rgba(248,246,242,.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            {displayVal || "DD MMM YYYY"}
          </span>
          <span style={{ color: C.gold, fontSize: 14 }}>📅</span>
        </button>
      </Field>

      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          zIndex: 40,
          width: 288,
          background: "#131A28",
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,.5), 0 0 30px rgba(212,175,55,.08)",
          transformOrigin: "top left",
          transform: open ? "scale(1) translateY(0)" : "scale(.94) translateY(-6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform .22s cubic-bezier(.16,1,.3,1), opacity .18s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 15, padding: 4 }}>‹</button>
          <div style={{ display: "flex", gap: 6 }}>
            <select value={view.getMonth()} onChange={(e) => setView(new Date(view.getFullYear(), Number(e.target.value), 1))}
              style={{ background: "transparent", border: "none", color: C.ivory, fontSize: 12.5, fontFamily: "'Inter', sans-serif" }}>
              {MONTHS.map((m, i) => <option key={m} value={i} style={{ background: "#131A28" }}>{m}</option>)}
            </select>
            <select value={view.getFullYear()} onChange={(e) => setView(new Date(Number(e.target.value), view.getMonth(), 1))}
              style={{ background: "transparent", border: "none", color: C.ivory, fontSize: 12.5, fontFamily: "'Inter', sans-serif" }}>
              {years.map((y) => <option key={y} value={y} style={{ background: "#131A28" }}>{y}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 15, padding: 4 }}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, color: "rgba(248,246,242,.35)", padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {cells.map((d, i) => (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => {
                const nd = new Date(view.getFullYear(), view.getMonth(), d);
                onChange(nd.toISOString().slice(0, 10));
                setOpen(false);
              }}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                border: "none",
                background: d && isSelected(d) ? C.gold : "transparent",
                color: !d ? "transparent" : isSelected(d) ? C.primary : "rgba(248,246,242,.8)",
                fontSize: 12,
                cursor: d ? "pointer" : "default",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (d && !isSelected(d)) e.target.style.background = "rgba(212,175,55,.15)"; }}
              onMouseLeave={(e) => { if (d && !isSelected(d)) e.target.style.background = "transparent"; }}
            >
              {d || ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BOARDING-PASS TICKET — signature element
   Used for: flight recommendations & the itinerary day selector
   ============================================================ */
function Perforation() {
  return (
    <div
      style={{
        position: "relative",
        width: 1,
        background: `repeating-linear-gradient(180deg, transparent 0 6px, rgba(212,175,55,.35) 6px 7px)`,
      }}
    >
      <div style={{ position: "absolute", top: -9, left: -9, width: 18, height: 18, borderRadius: "50%", background: C.primary, border: `1px solid ${C.border}` }} />
      <div style={{ position: "absolute", bottom: -9, left: -9, width: 18, height: 18, borderRadius: "50%", background: C.primary, border: `1px solid ${C.border}` }} />
    </div>
  );
}

function BoardingPass({ from, to, fromCode, toCode, airline, duration, cls, badge }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 130px",
        background: "linear-gradient(115deg, rgba(212,175,55,.07), rgba(255,255,255,.02))",
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{badge}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: C.ivory, letterSpacing: 1 }}>{fromCode}</div>
            <div style={{ fontSize: 11, color: "rgba(248,246,242,.5)" }}>{from}</div>
          </div>
          <div style={{ flex: 1, position: "relative", height: 1, background: "rgba(212,175,55,.3)", minWidth: 40 }}>
            <span style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(90deg)", fontSize: 12, color: C.gold }}>✈</span>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: C.ivory, letterSpacing: 1 }}>{toCode}</div>
            <div style={{ fontSize: 11, color: "rgba(248,246,242,.5)" }}>{to}</div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(248,246,242,.55)" }}>{airline}</div>
      </div>
      <Perforation />
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
        <div>
          <div style={{ fontSize: 9.5, color: "rgba(248,246,242,.4)", textTransform: "uppercase", letterSpacing: 1 }}>Duration</div>
          <div style={{ fontSize: 13, color: C.ivory, fontFamily: "'JetBrains Mono', monospace" }}>{duration}</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: "rgba(248,246,242,.4)", textTransform: "uppercase", letterSpacing: 1 }}>Cabin</div>
          <div style={{ fontSize: 13, color: C.gold }}>{cls}</div>
        </div>
      </div>
    </div>
  );
}

/* Ticket-stub day selector for itinerary */
function DayStub({ day, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        position: "relative",
        width: 128,
        padding: "12px 10px 14px",
        borderRadius: 10,
        border: `1px solid ${active ? C.gold : "rgba(255,255,255,.1)"}`,
        background: active ? "linear-gradient(160deg, rgba(212,175,55,.16), rgba(212,175,55,.03))" : "rgba(255,255,255,.02)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all .25s cubic-bezier(.16,1,.3,1)",
        transform: active ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div style={{ fontSize: 9.5, letterSpacing: 1.5, color: active ? C.gold : "rgba(248,246,242,.4)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
        Day {String(day).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 12, color: active ? C.ivory : "rgba(248,246,242,.6)", marginTop: 4, lineHeight: 1.3 }}>{title}</div>
      <div style={{ position: "absolute", bottom: 0, left: 10, right: 10, height: 1, background: `repeating-linear-gradient(90deg, transparent 0 4px, ${active ? "rgba(212,175,55,.5)" : "rgba(255,255,255,.15)"} 4px 5px)` }} />
    </button>
  );
}

/* Passport-style circular stamp for visa/currency */
// eslint-disable-next-line no-unused-vars
function Stamp({ label, value }) {
  return (
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: "50%",
        border: `1.5px dashed ${C.jade}88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexShrink: 0,
        transform: "rotate(-6deg)",
        color: C.jade,
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", opacity: 0.85 }}>{label}</div>
      <div style={{ fontSize: 15, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ============================================================
   SAMPLE DATA
   ============================================================ */
const SAMPLE = {
  tripName: "Bali Luxury Retreat",
  theme: "Tropical serenity meets refined indulgence",
  mood: "Slow mornings, golden light, quiet luxury",
  bestSeason: "May – September (Dry Season)",
  weather: "28–32°C, low humidity, occasional evening showers",
  highlights: [
    "Private villa with infinity pool overlooking rice terraces",
    "Sunrise trek up Mount Batur",
    "Candlelit dinner on Jimbaran Bay",
    "Traditional Balinese purification ceremony at Tirta Empul",
  ],
  budget: { total: 250000, flights: 55000, hotels: 78000, food: 32000, localTransport: 14000, activities: 38000, shopping: 18000, buffer: 12000 },
  hotels: [
    { name: "Villa Kayu Ubud", rating: "5-star boutique", price: "₹22,000/night", why: "Secluded jungle villa with private pool, ideal for a slow, romantic pace", nearby: "Tegalalang Rice Terrace, Ubud Palace", priority: "Book first — limited villas" },
    { name: "The Kayana Seminyak", rating: "5-star", price: "₹19,500/night", why: "Adults-only sanctuary, steps from Seminyak's best beach clubs", nearby: "Double-Six Beach, La Plancha", priority: "Book within 2 weeks" },
    { name: "Four Seasons Jimbaran Bay", rating: "5-star luxury", price: "₹48,000/night", why: "The splurge night — private beachfront pavilion for the anniversary dinner", nearby: "Jimbaran seafood beach cafés", priority: "Book 1 night only" },
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
  attractions: {
    Top: ["Tegalalang Rice Terrace", "Uluwatu Temple", "Tirta Empul", "Mount Batur"],
    "Hidden Gems": ["Tibumana Waterfall", "Sidemen Valley"],
    Adventure: ["Mount Batur sunrise trek", "Ayung River rafting"],
    "Free to Enjoy": ["Campuhan Ridge Walk", "Kuta Beach sunset"],
  },
  scores: { Budget: 82, Luxury: 91, Adventure: 74, Comfort: 95, Safety: 88, Food: 93 },
  overall: 90,
  happeningEvents: {
    source: "unavailable",
    query: "events in Bali",
    googleSearchUrl: "https://www.google.com/search?q=events%20in%20Bali",
    live: [],
    seasonal: [
      { title: "Bali Arts Festival, Denpasar", when: "Typically June", venue: "Bali", note: "Month-long celebration of Balinese arts & dance" },
    ],
  },
};

const ITINERARY_DAYS = [
  { day: 1, title: "Arrival & Ubud", morning: { breakfast: "In-flight", activity: "Land in Denpasar, private villa transfer", travel: "1h 30m" }, lunch: "Warung Sopa, Ubud", afternoon: "Check-in, unwind by the villa pool", evening: "Dinner at Locavore", night: "Quiet villa evening, stargazing", shopping: "None — arrival day", spend: 9500, map: "Villa Kayu Ubud" },
  { day: 2, title: "Rice Terraces", morning: { breakfast: "Villa breakfast", activity: "Tegalalang Rice Terrace at sunrise light", travel: "20 min" }, lunch: "Sari Organik", afternoon: "Tirta Empul purification ceremony", evening: "Dinner at Hujan Locale", night: "Ubud Art Market stroll", shopping: "Ikat textiles, wood carvings", spend: 6200, map: "Tegalalang, Tirta Empul" },
  { day: 3, title: "Sunrise Summit", morning: { breakfast: "Trail breakfast", activity: "Pre-dawn Mount Batur trek", travel: "1h drive + 2h hike" }, lunch: "Post-trek brunch at villa", afternoon: "Rest and spa recovery", evening: "Bebek Betutu at local warung", night: "Early sleep", shopping: "None", spend: 5800, map: "Mount Batur, Kintamani" },
  { day: 4, title: "Coastal Transfer", morning: { breakfast: "Villa breakfast", activity: "Campuhan Ridge Walk, transfer to Seminyak", travel: "1h 15m" }, lunch: "Motel Mexicola", afternoon: "Check-in at The Kayana, beach club", evening: "Sunset drinks at La Plancha", night: "Dinner + live music, Potato Head", shopping: "Seminyak Village boutiques", spend: 11000, map: "The Kayana Seminyak" },
  { day: 5, title: "Uluwatu Cliffs", morning: { breakfast: "Hotel breakfast", activity: "Check-in at Alila Uluwatu", travel: "45 min" }, lunch: "Single Fin, surf café", afternoon: "Uluwatu Temple, Kecak fire dance", evening: "Sunset dinner, Jimbaran Bay sands", night: "Stargazing, clifftop lounge", shopping: "None", spend: 14500, map: "Uluwatu Temple" },
  { day: 6, title: "The Splurge", morning: { breakfast: "Private pavilion breakfast", activity: "Check-in, Four Seasons Jimbaran", travel: "30 min" }, lunch: "Poolside at the resort", afternoon: "Couples spa ritual, private beach", evening: "Anniversary dinner, beachfront pavilion", night: "Champagne under the stars", shopping: "None", spend: 24000, map: "Four Seasons Jimbaran Bay" },
  { day: 7, title: "Departure", morning: { breakfast: "Resort breakfast", activity: "Last swim, final souvenir run", travel: "20 min" }, lunch: "Airport lounge", afternoon: "Check-out, transfer to DPS", evening: "Departure flight", night: "In-flight", shopping: "Last-minute duty-free", spend: 4000, map: "Denpasar Int'l Airport" },
];

/* ============================================================
   INTAKE FORM
   ============================================================ */
const TRIP_TYPES = ["Solo", "Couple", "Family", "Friends", "Business"];
const TRAVEL_STYLES = ["Luxury", "Premium", "Budget", "Backpacking"];
const INTERESTS = ["Adventure","Beaches","Nature","Mountains","Food","Nightlife","Shopping","Culture","Photography","Wildlife","Spiritual","Road Trips","Snow"];
const CURATED_DESTINATIONS = ["Delhi","Mumbai","Goa","Jaipur","Udaipur","Manali","Shimla","Leh-Ladakh","Rishikesh","Munnar, Kerala","Agra","Bali, Indonesia"];

function shakeKeyframe() {
  return "@keyframes shakeX { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }";
}

function IntakeForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    age: 28,
    tripDate: "",
    departureCity: "Delhi",
    destination: "",
    travelers: 2,
    tripType: "Couple",
    travelStyle: "Luxury",
    budget: 250000,
    days: 7,
    interests: ["Beaches", "Food", "Culture", "Photography"],
  });

  const [destError, setDestError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [shake, setShake] = useState(false);

  const toggleInterest = (i) =>
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));

  function handleSubmitClick() {
    const missingDest = !form.destination || !form.destination.trim();
    const missingDate = !form.tripDate || !form.tripDate.trim();
    if (missingDest || missingDate) {
      setDestError(missingDest);
      setDateError(missingDate);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setDestError(false);
    setDateError(false);
    onSubmit(form);
  }

  return (
    <Reveal>
      <GlassCard style={{ maxWidth: 900, margin: "0 auto", boxShadow: "0 25px 70px rgba(0,0,0,.4)" }}>
        <SectionHeader icon="🧭" title="Plan Your Escape" subtitle="Tell us about the traveler — we'll design everything around them." />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Age">
            <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} type="number" min={1} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </Field>
          <div style={{ animation: shake && dateError ? "shakeX .5s" : "none" }}>
            <DatePicker
              value={form.tripDate}
              onChange={(v) => { setDateError(false); setForm({ ...form, tripDate: v }); }}
              label="Trip Start Date — required"
              minYearsAhead
            />
            {dateError && (
              <span style={{ color: C.danger, fontSize: 11, marginTop: 2, display: "block" }}>Please pick a trip start date.</span>
            )}
          </div>
          <Field label="Departure City">
            <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={form.departureCity} onChange={(e) => setForm({ ...form, departureCity: e.target.value })} />
          </Field>
          <Field label="Destination — required">
            <div style={{ animation: shake ? "shakeX .5s" : "none" }}>
              <input
                style={{ ...inputStyle, borderColor: destError ? C.danger : "rgba(255,255,255,.1)" }}
                onFocus={(e) => { setDestError(false); focusRing(e); }}
                onBlur={blurRing}
                list="curated-destinations"
                value={form.destination}
                placeholder="e.g. Delhi, Mumbai, Manali…"
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
              <datalist id="curated-destinations">
                {CURATED_DESTINATIONS.map((d) => <option key={d} value={d} />)}
              </datalist>
            </div>
            {destError && (
              <span style={{ color: C.danger, fontSize: 11, marginTop: 2 }}>Please tell us where you're headed.</span>
            )}
            <span style={{ fontSize: 10.5, color: "rgba(248,246,242,.35)", marginTop: 2 }}>
              Real, verified data available for: {CURATED_DESTINATIONS.join(" · ")}
            </span>
          </Field>
          <Field label="Number of Travelers">
            <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} type="number" min={1} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} />
          </Field>
          <Field label="Trip Type">
            <select style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })}>
              {TRIP_TYPES.map((t) => <option key={t} style={{ background: "#131A28" }}>{t}</option>)}
            </select>
          </Field>
          <Field label="Travel Style">
            <select style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}>
              {TRAVEL_STYLES.map((t) => <option key={t} style={{ background: "#131A28" }}>{t}</option>)}
            </select>
          </Field>
          <Field label="Total Budget (₹)">
            <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </Field>
          <Field label="Number of Days">
            <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} type="number" min={1} value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
          </Field>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 10.5, color: "rgba(248,246,242,.55)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Interests</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INTERESTS.map((i) => {
              const active = form.interests.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: 999,
                    fontSize: 12.5,
                    cursor: "pointer",
                    border: `1px solid ${active ? C.gold : "rgba(255,255,255,.12)"}`,
                    background: active ? "rgba(212,175,55,.16)" : "rgba(255,255,255,.02)",
                    color: active ? C.gold : "rgba(248,246,242,.65)",
                    transform: active ? "scale(1.04)" : "scale(1)",
                    transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
                  }}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmitClick}
          disabled={loading}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "15px",
            borderRadius: 12,
            border: "none",
            cursor: loading ? "default" : "pointer",
            fontSize: 14.5,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: C.primary,
            background: `linear-gradient(90deg, ${C.rose}, ${C.gold})`,
            boxShadow: "0 8px 26px rgba(212,175,55,.28)",
            transition: "transform .2s, box-shadow .2s",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(212,175,55,.4)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(212,175,55,.28)"; }}
        >
          {loading ? (
            <>
              <span style={{ width: 14, height: 14, border: "2px solid rgba(11,15,25,.35)", borderTopColor: C.primary, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
              Curating your journey…
            </>
          ) : (
            "Curate My Journey →"
          )}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(248,246,242,.35)", marginTop: 10 }}>
          Connected to the concierge API — falls back to a sample itinerary if the backend is offline.
        </p>
      </GlassCard>
    </Reveal>
  );
}

/* ============================================================
   RESULTS PAGE
   ============================================================ */
function BudgetRow({ label, amount, total, delay }) {
  const [ref, visible] = useReveal();
  const pct = Math.min(Math.round((amount / total) * 100), 100);
  return (
    <div ref={ref} style={{ marginBottom: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: C.ivory, marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace" }}>₹{amount.toLocaleString("en-IN")}</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,.06)" }}>
        <div style={{ width: visible ? `${pct}%` : "0%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.rose}, ${C.gold})`, transition: `width 1s cubic-bezier(.16,1,.3,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

function ResultsPage({ form, onBack, plan }) {
  const [activeDay, setActiveDay] = useState(1);
  const d = plan?.trip || SAMPLE;
  const days = plan?.itinerary || ITINERARY_DAYS;
  const spentKeys = ["flights","hotels","food","localTransport","activities","shopping","buffer"];
  const spent = spentKeys.reduce((a, k) => a + d.budget[k], 0);
  const utilization = Math.min(Math.round((spent / d.budget.total) * 100), 100);
  const remaining = Math.max(d.budget.total - spent, 0);
  const currentDay = days.find((x) => x.day === activeDay);
  const overBudget = !!d.budget.overBudget;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 14 }}>
          <div>
            <Eyebrow>Curated for {form?.tripType || "Couple"} · {form?.travelers || 2} Traveler(s)</Eyebrow>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 450, fontSize: 46, color: C.ivory, margin: 0, letterSpacing: -0.5 }}>
              {d.tripName}
            </h1>
            <p style={{ color: "rgba(248,246,242,.55)", marginTop: 10, fontSize: 15, maxWidth: 560, fontStyle: "italic", fontFamily: "'Fraunces', serif" }}>{d.theme}</p>
          </div>
          <button
            onClick={onBack}
            style={{ background: "rgba(255,255,255,.04)", border: `1px solid rgba(255,255,255,.14)`, color: C.ivory, borderRadius: 10, padding: "11px 20px", fontSize: 13, cursor: "pointer", transition: "border-color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,.14)")}
          >
            ← Edit Trip Details
          </button>
        </div>
      </Reveal>

      {/* Overview */}
      <Reveal delay={60}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="✨" title="Trip Overview" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            {[["Mood", d.mood.split(",")[0]], ["Best Season", d.bestSeason], ["Weather", "28–32°C"], ["Duration", `${form?.days || 7} Days`]].map(([l, v], i) => (
              <div key={l} style={{ padding: "16px 4px", borderTop: `2px solid ${i % 2 ? C.jade : C.gold}55` }}>
                <div style={{ fontSize: 10, color: "rgba(248,246,242,.45)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                <div style={{ fontSize: 17, color: C.ivory, marginTop: 6, fontFamily: "'Fraunces', serif" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(248,246,242,.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Trip Highlights</div>
          {d.highlights.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 9, fontSize: 14, color: C.ivory, alignItems: "baseline" }}>
              <span style={{ color: i % 2 ? C.jade : C.gold, fontSize: 10 }}>◆</span>{h}
            </div>
          ))}
        </GlassCard>
      </Reveal>

      {/* Budget */}
      <Reveal delay={80}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="💰" title="Budget Breakdown" />
          {overBudget && (
            <div style={{ background: "rgba(214,80,80,.1)", border: `1px solid ${C.danger}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: C.ivory }}>
              <div>⚠ The recommended hotel alone (₹{d.budget.hotels.toLocaleString("en-IN")}) exceeds your total budget by ₹{d.budget.shortfall.toLocaleString("en-IN")}. Raise your budget, pick a more affordable travel style, or check budget-friendly stays below.</div>
              {d.hotelBookingLinks && (
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <a href={d.hotelBookingLinks.oyo} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11.5, color: C.gold, border: `1px solid ${C.gold}55`, borderRadius: 7, padding: "6px 12px", textDecoration: "none", fontWeight: 600 }}>
                    Find budget rooms on OYO →
                  </a>
                  <a href={d.hotelBookingLinks.mmt} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11.5, color: C.jade, border: `1px solid ${C.jade}55`, borderRadius: 7, padding: "6px 12px", textDecoration: "none", fontWeight: 600 }}>
                    Compare stays on MakeMyTrip →
                  </a>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 30 }}>
            <div>
              <BudgetRow label="Flights" amount={d.budget.flights} total={d.budget.total} delay={0} />
              <BudgetRow label="Hotels" amount={d.budget.hotels} total={d.budget.total} delay={60} />
              <BudgetRow label="Food" amount={d.budget.food} total={d.budget.total} delay={120} />
              <BudgetRow label="Travel Inside the City" amount={d.budget.localTransport} total={d.budget.total} delay={180} />
              <BudgetRow label="Activities" amount={d.budget.activities} total={d.budget.total} delay={240} />
              <BudgetRow label="Shopping" amount={d.budget.shopping} total={d.budget.total} delay={300} />
              <BudgetRow label="Emergency Buffer" amount={d.budget.buffer} total={d.budget.total} delay={360} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(248,246,242,.45)", textTransform: "uppercase", letterSpacing: 1 }}>Total Cost</div>
                <div style={{ fontSize: 34, color: C.gold, fontFamily: "'Fraunces', serif", marginTop: 4 }}><CountUp to={d.budget.total} prefix="₹" /></div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(248,246,242,.45)", textTransform: "uppercase", letterSpacing: 1 }}>Remaining</div>
                <div style={{ fontSize: 22, color: C.jade, fontFamily: "'Fraunces', serif", marginTop: 4 }}><CountUp to={remaining} prefix="₹" /></div>
              </div>
              <AnimatedBar pct={utilization} label="Utilization" />
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* Flights — boarding pass, or a "no flight needed" note for same-city trips */}
      <Reveal delay={100}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="✈" title="Flight Recommendation" />
          {d.flight === null ? (
            <div style={{ fontSize: 13.5, color: "rgba(248,246,242,.65)", padding: "6px 2px" }}>
              🚗 Your departure city and destination are the same — no flight needed. That budget share has been put toward the rest of your trip instead.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <BoardingPass
                  badge="Departure"
                  from={d.flight?.fromCity || form?.departureCity || "Delhi"}
                  to={d.flight?.toCity || d.tripName.split(" ")[0]}
                  fromCode={d.flight?.fromCode || "DEL"}
                  toCode={d.flight?.toCode || "—"}
                  airline={d.flight?.country && d.flight.country !== "India" ? "International carrier · connection likely" : "Domestic carrier · direct or 1-stop"}
                  duration={d.flight?.country && d.flight.country !== "India" ? "6–9h (with connection)" : "1h 30m – 3h"}
                  cls="Premium Economy"
                />
                <BoardingPass
                  badge="Return"
                  from={d.flight?.toCity || d.tripName.split(" ")[0]}
                  to={d.flight?.fromCity || form?.departureCity || "Delhi"}
                  fromCode={d.flight?.toCode || "—"}
                  toCode={d.flight?.fromCode || "DEL"}
                  airline={d.flight?.country && d.flight.country !== "India" ? "International carrier · connection likely" : "Domestic carrier · direct or 1-stop"}
                  duration={d.flight?.country && d.flight.country !== "India" ? "6–9h (with connection)" : "1h 30m – 3h"}
                  cls="Premium Economy"
                />
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 30, flexWrap: "wrap", fontSize: 12.5, color: "rgba(248,246,242,.6)" }}>
                <div><b style={{ color: C.ivory }}>Best time to book:</b> 6–8 weeks before departure</div>
                <div><b style={{ color: C.ivory }}>Transfer tip:</b> Pre-book a private villa transfer from DPS</div>
              </div>
            </>
          )}
        </GlassCard>
      </Reveal>

      {/* Hotels */}
      <Reveal delay={120}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="🏨" title="Hotel Recommendations" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {d.hotels.map((h, i) => (
              <div
                key={h.name}
                style={{
                  border: `1px solid ${h.allocated ? C.gold : "rgba(255,255,255,.1)"}`,
                  borderRadius: 14,
                  padding: 17,
                  background: h.allocated ? "rgba(212,175,55,.06)" : "rgba(255,255,255,.02)",
                  transition: "all .3s cubic-bezier(.16,1,.3,1)",
                  position: "relative",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = i % 2 ? C.jade : C.gold; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = h.allocated ? C.gold : "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {h.allocated && (
                  <div style={{ position: "absolute", top: -10, left: 14, fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", background: C.gold, color: "#1a1710", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                    {h.source === "oyo-mmt-estimate" ? "Budget pick — via OYO / MMT" : "Allocated for your budget"}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: h.allocated ? 6 : 0 }}>
                  <div style={{ color: C.ivory, fontWeight: 500, fontSize: 15.5, fontFamily: "'Fraunces', serif" }}>{h.name}</div>
                  <div style={{ color: C.gold, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{h.price}</div>
                </div>
                <Tag tone={i % 2 ? "jade" : "gold"}>{h.rating}</Tag>
                <div style={{ fontSize: 12.5, color: "rgba(248,246,242,.6)", marginTop: 7 }}>{h.why}</div>
                <div style={{ fontSize: 11.5, color: "rgba(248,246,242,.4)", marginTop: 7 }}>Near: {h.nearby}</div>
                {h.stayCost != null && (
                  <div style={{ fontSize: 11.5, color: "rgba(248,246,242,.4)", marginTop: 3 }}>Full stay: ₹{h.stayCost.toLocaleString("en-IN")}</div>
                )}
                <div style={{ fontSize: 11.5, color: h.allocated ? C.jade : C.rose, marginTop: 5 }}>{h.allocated ? h.priority : `Alternate — ${h.priority}`}</div>
                {h.bookingLinks && (
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <a href={h.bookingLinks.oyo} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, color: C.gold, border: `1px solid ${C.gold}55`, borderRadius: 7, padding: "5px 10px", textDecoration: "none" }}>
                      View live prices on OYO →
                    </a>
                    <a href={h.bookingLinks.mmt} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, color: C.jade, border: `1px solid ${C.jade}55`, borderRadius: 7, padding: "5px 10px", textDecoration: "none" }}>
                      View live prices on MakeMyTrip →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      {/* Itinerary — ticket stub selector */}
      <Reveal delay={140}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="📅" title="Day-by-Day Itinerary" />
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 24, paddingBottom: 10, paddingTop: 4 }}>
            {days.map((dy) => (
              <DayStub key={dy.day} day={dy.day} title={dy.title} active={activeDay === dy.day} onClick={() => setActiveDay(dy.day)} />
            ))}
          </div>
          {currentDay && (
            <div key={activeDay} style={{ animation: "fadeSlide .4s cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ color: C.ivory, fontSize: 20, marginBottom: 16, fontFamily: "'Fraunces', serif" }}>
                Day {currentDay.day}: {currentDay.title}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, marginBottom: 9, textTransform: "uppercase", letterSpacing: 1.2 }}>Morning</div>
                  <div style={{ fontSize: 13, color: C.ivory }}>{currentDay.morning.breakfast}</div>
                  <div style={{ fontSize: 13, color: C.ivory, marginTop: 5 }}>{currentDay.morning.activity}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(248,246,242,.4)", marginTop: 5, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {currentDay.morning.travel}</div>
                  <div style={{ fontSize: 13, color: C.ivory, marginTop: 12 }}>Lunch — {currentDay.lunch}</div>
                </div>
                <div>
                  <div style={{ color: C.jade, fontSize: 11, marginBottom: 9, textTransform: "uppercase", letterSpacing: 1.2 }}>Afternoon / Evening</div>
                  <div style={{ fontSize: 13, color: C.ivory }}>{currentDay.afternoon}</div>
                  <div style={{ fontSize: 13, color: C.ivory, marginTop: 9 }}>Dinner — {currentDay.evening}</div>
                  <div style={{ fontSize: 13, color: C.ivory, marginTop: 9 }}>{currentDay.night}</div>
                </div>
                <div>
                  <div style={{ color: C.rose, fontSize: 11, marginBottom: 9, textTransform: "uppercase", letterSpacing: 1.2 }}>Details</div>
                  <div style={{ fontSize: 13, color: C.ivory }}>{currentDay.shopping}</div>
                  <div style={{ fontSize: 13, color: C.ivory, marginTop: 9 }}>Est. spend — <span style={{ color: C.gold, fontFamily: "'JetBrains Mono', monospace" }}>₹{currentDay.spend.toLocaleString("en-IN")}</span></div>
                  {currentDay.localTravel != null && (
                    <div style={{ fontSize: 13, color: C.ivory, marginTop: 5 }}>🛺 Getting around today — <span style={{ color: C.jade, fontFamily: "'JetBrains Mono', monospace" }}>₹{currentDay.localTravel.toLocaleString("en-IN")}</span></div>
                  )}
                  <div style={{ fontSize: 11.5, color: "rgba(248,246,242,.4)", marginTop: 9 }}>📍 {currentDay.map}</div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </Reveal>

      {/* Food */}
      <Reveal delay={100}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="🍽" title="Food Guide" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, fontSize: 13 }}>
            {Object.entries(d.food).map(([k, v]) => (
              <div key={k}>
                <div style={{ color: C.gold, fontSize: 11, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{k}</div>
                <div style={{ color: C.ivory }}>{v}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      {/* Attractions */}
      <Reveal delay={100}>
        <GlassCard style={{ marginBottom: 26 }}>
          <SectionHeader icon="🎯" title="Attractions" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {Object.entries(d.attractions).map(([k, v], i) => (
              <div key={k}>
                <div style={{ color: i % 2 ? C.jade : C.gold, fontSize: 11.5, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>{k}</div>
                <div>{v.map((x) => <Tag key={x} tone={i % 2 ? "jade" : "gold"}>{x}</Tag>)}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      {/* Happening Nearby — optional, not baked into the day-by-day plan */}
      {d.happeningEvents && (
        <Reveal delay={100}>
          <GlassCard style={{ marginBottom: 26 }}>
            <SectionHeader icon="🎪" title="Happening Nearby (Optional)" />
            <div style={{ fontSize: 12, color: "rgba(248,246,242,.5)", marginBottom: 16 }}>
              Not part of your day-by-day plan — just worth checking before you go.
            </div>

            {d.happeningEvents.live?.length > 0 && (
              <div style={{ marginBottom: d.happeningEvents.seasonal?.length ? 20 : 0 }}>
                <div style={{ color: C.gold, fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.2 }}>
                  Live results for your dates
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {d.happeningEvents.live.map((ev, i) => (
                    <a
                      key={i}
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 14, display: "block" }}
                    >
                      <div style={{ color: C.ivory, fontSize: 14, fontFamily: "'Fraunces', serif" }}>{ev.title}</div>
                      <div style={{ color: C.gold, fontSize: 12, marginTop: 5 }}>{ev.when}</div>
                      <div style={{ color: "rgba(248,246,242,.5)", fontSize: 11.5, marginTop: 3 }}>📍 {ev.venue}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {d.happeningEvents.seasonal?.length > 0 && (
              <div>
                <div style={{ color: C.jade, fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.2 }}>
                  Recurring around this time of year
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {d.happeningEvents.seasonal.map((ev, i) => (
                    <div key={i} style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 14 }}>
                      <div style={{ color: C.ivory, fontSize: 14, fontFamily: "'Fraunces', serif" }}>{ev.title}</div>
                      <div style={{ color: C.jade, fontSize: 12, marginTop: 5 }}>{ev.when}</div>
                      {ev.note && <div style={{ color: "rgba(248,246,242,.5)", fontSize: 11.5, marginTop: 3 }}>{ev.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!d.happeningEvents.live || d.happeningEvents.live.length === 0) &&
              (!d.happeningEvents.seasonal || d.happeningEvents.seasonal.length === 0) && (
                <div style={{ fontSize: 13, color: "rgba(248,246,242,.6)" }}>
                  {d.happeningEvents.source === "unavailable"
                    ? "Live event search isn't configured on this backend yet (add a SERPAPI_KEY to enable it — see backend/liveEvents.js)."
                    : "No specific listings found for your dates."}{" "}
                  <a href={d.happeningEvents.googleSearchUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.gold }}>
                    Search what's on →
                  </a>
                </div>
              )}
          </GlassCard>
        </Reveal>
      )}

      {/* Final Score */}
      <Reveal delay={100}>
        <GlassCard style={{ marginBottom: 40 }}>
          <SectionHeader icon="🌟" title="Final Travel Score" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "center" }}>
            <div>
              {Object.entries(d.scores).map(([k, v], i) => (
                <AnimatedBar key={k} pct={v} label={k} color={i % 3 === 1 ? C.jade : C.gold} delay={i * 70} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "rgba(248,246,242,.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Overall Experience</div>
              <div style={{ fontSize: 76, color: C.gold, fontFamily: "'Fraunces', serif", lineHeight: 1.1 }}>
                <CountUp to={d.overall} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(248,246,242,.4)" }}>out of 100</div>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
const API_URL = "http://localhost:4000/api/plan-trip";

export default function LuxuryTravelConcierge() {
  const [stage, setStage] = useState("form");
  const [form, setForm] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiNote, setApiNote] = useState("");

  async function handleSubmit(f) {
    setLoading(true);
    setApiNote("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error("Backend responded with an error");
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setPlan(null); // ResultsPage falls back to SAMPLE
      setApiNote("Showing a sample itinerary — the concierge backend isn't running (start it with `npm run dev` in /backend).");
    } finally {
      setForm(f);
      setLoading(false);
      setStage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div style={{ ...pageBg, minHeight: "100vh", padding: "56px 20px 80px", fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes floatUp { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: .35; } 90% { opacity: .35; } 100% { transform: translateY(-620px) translateX(var(--drift)); opacity: 0; } }
        ${shakeKeyframe()}
        @keyframes stagePop { from { opacity: 0; transform: translateY(14px) scale(.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; } }
        select option { color: #F8F6F2; }
        input:focus, select:focus, button:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 2px; }
      `}</style>

      <AmbientField />

      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 46, position: "relative", zIndex: 1 }}>
          <Eyebrow>AI Travel Concierge</Eyebrow>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 450, fontSize: 34, color: C.ivory, letterSpacing: -0.3 }}>
            Bespoke Journeys, Beautifully Planned
          </div>
        </div>
      </Reveal>

      <div style={{ position: "relative", zIndex: 1 }}>
        {loading ? (
          <div style={{ animation: "stagePop .5s cubic-bezier(.16,1,.3,1)" }}>
            <PlanningLoader destination={form?.destination} />
          </div>
        ) : stage === "form" ? (
          <div key="form" style={{ animation: "stagePop .5s cubic-bezier(.16,1,.3,1)" }}>
            <IntakeForm onSubmit={handleSubmit} loading={loading} />
          </div>
        ) : (
          <div key="results" style={{ animation: "stagePop .5s cubic-bezier(.16,1,.3,1)" }}>
            {plan?.meta && (
              <Reveal>
                <div
                  style={{
                    maxWidth: 1080,
                    margin: "0 auto 20px",
                    padding: "12px 18px",
                    borderRadius: 10,
                    background: plan.meta.matched ? "rgba(62,124,107,.1)" : "rgba(212,175,55,.08)",
                    border: `1px solid ${plan.meta.matched ? C.jade + "55" : C.border}`,
                    color: "rgba(248,246,242,.7)",
                    fontSize: 12.5,
                  }}
                >
                  {plan.meta.matched
                    ? `✓ Real, curated data for ${plan.meta.matchedDestination} — hotels, attractions, and food are verified places.`
                    : `⚠ "${form?.destination}" isn't in our curated real-data list yet. Try: ${plan.meta.curatedDestinations.join(", ")}.`}
                </div>
              </Reveal>
            )}
            {apiNote && (
              <Reveal>
                <div style={{ maxWidth: 1080, margin: "0 auto 20px", padding: "12px 18px", borderRadius: 10, background: "rgba(212,175,55,.08)", border: `1px solid ${C.border}`, color: "rgba(248,246,242,.7)", fontSize: 12.5 }}>
                  ⚠ {apiNote}
                </div>
              </Reveal>
            )}
            <ResultsPage form={form} plan={plan} onBack={() => { setStage("form"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </div>
        )}
      </div>
    </div>
  );
}
