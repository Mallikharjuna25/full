import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format, parse, startOfWeek, getDay,
  isSameDay, isAfter, startOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import {
  ChevronLeft, ChevronRight, Calendar as CalIcon,
  X, MapPin, Tag, Info, ExternalLink, Sparkles,
  Filter, Clock, Building2, LayoutGrid,
} from "lucide-react";
import Stars from "./components/Stars";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ─────────────────────────────────────────────────────────────────────────────
   DATE-FNS LOCALIZER
───────────────────────────────────────────────────────────────────────────── */
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY COLOUR MAP  (matches EventCard.js category scheme)
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_META = {
  Technology:  { color: "#7C3AED", bg: "rgba(124,58,237,0.18)",  emoji: "⚡", label: "Tech"       },
  Hackathon:   { color: "#3B82F6", bg: "rgba(59,130,246,0.18)",  emoji: "🧩", label: "Hackathon"  },
  Cultural:    { color: "#EC4899", bg: "rgba(236,72,153,0.18)",  emoji: "🎭", label: "Cultural"   },
  Sports:      { color: "#22C55E", bg: "rgba(34,197,94,0.18)",   emoji: "🏆", label: "Sports"     },
  Business:    { color: "#F59E0B", bg: "rgba(245,158,11,0.18)",  emoji: "💼", label: "Business"   },
  Science:     { color: "#22D3EE", bg: "rgba(34,211,238,0.18)",  emoji: "🤖", label: "Science"    },
  Workshop:    { color: "#A78BFA", bg: "rgba(167,139,250,0.18)", emoji: "🛠️", label: "Workshop"   },
  Other:       { color: "#94A3B8", bg: "rgba(148,163,184,0.18)", emoji: "🎪", label: "Other"      },
};

const catColor  = (cat) => CATEGORY_META[cat]?.color  || "#7C3AED";
const catBg     = (cat) => CATEGORY_META[cat]?.bg     || "rgba(124,58,237,0.18)";
const catEmoji  = (cat) => CATEGORY_META[cat]?.emoji  || "🎪";

/* ─────────────────────────────────────────────────────────────────────────────
   SAMPLE EVENT DATA  (replace with API call later)
───────────────────────────────────────────────────────────────────────────── */
const SAMPLE_EVENTS = [
  { id:  1, title: "HackFusion 2026",       college: "IIT Delhi",     start: new Date(2026,2,5),  end: new Date(2026,2,5),  description: "National-level hackathon with ₹5L prize pool. Build products that redefine industries.", category: "Hackathon",  venue: "Main Auditorium"     },
  { id:  2, title: "TechFest Symposium",    college: "IIT Bombay",    start: new Date(2026,2,12), end: new Date(2026,2,14), description: "Asia's largest science and technology festival — workshops, robotics, and exhibitions.", category: "Technology", venue: "IIT Campus Grounds"  },
  { id:  3, title: "CultFest Spring '26",   college: "BITS Pilani",   start: new Date(2026,2,19), end: new Date(2026,2,21), description: "Three-day cultural extravaganza featuring dance, drama, music, and stand-up comedy.", category: "Cultural",   venue: "Open Air Theatre"    },
  { id:  4, title: "Entrepreneurship Conclave",college:"SRCC Delhi",  start: new Date(2026,2,8),  end: new Date(2026,2,8),  description: "Panel discussions with unicorn founders. Case competitions and seed-funding pitches.", category: "Business",  venue: "Seminar Hall A"      },
  { id:  5, title: "Robotics Summit",       college: "VIT Vellore",   start: new Date(2026,2,26), end: new Date(2026,2,27), description: "Autonomous bot battles, drone racing, and AI-powered automation showcases.", category: "Science",    venue: "Technology Block"    },
  { id:  6, title: "Sports Olympiad '26",   college: "Amity Noida",   start: new Date(2026,2,22), end: new Date(2026,2,22), description: "Inter-college championship spanning 12 sporting disciplines including esports.", category: "Sports",    venue: "University Stadium"  },
  { id:  7, title: "DevConnect Workshop",   college: "NIT Trichy",    start: new Date(2026,3,3),  end: new Date(2026,3,3),  description: "Full-day hands-on workshop on full-stack development, DevOps, and cloud architectures.", category: "Workshop",   venue: "CS Department Labs"  },
  { id:  8, title: "E-Cell Bootcamp",       college: "IIM Ahmedabad", start: new Date(2026,3,10), end: new Date(2026,3,11), description: "Intensive startup bootcamp with mentors from top VC firms and product companies.", category: "Business",  venue: "Innovation Hub"      },
  { id:  9, title: "AI Research Colloquium",college: "IISc Bangalore",start: new Date(2026,3,17), end: new Date(2026,3,17), description: "Cutting-edge AI/ML research presentations by graduate students and guest researchers.", category: "Technology", venue: "Faculty Hall"        },
  { id: 10, title: "Street Beats Festival", college: "Jadavpur Univ", start: new Date(2026,3,24), end: new Date(2026,3,25), description: "Urban arts carnival: street dance, graffiti art, spoken word poetry, and live beatboxing.", category: "Cultural",   venue: "College Square"      },
  { id: 11, title: "Hack-a-Health",         college: "AIIMS Delhi",   start: new Date(2026,2,15), end: new Date(2026,2,16), description: "Healthcare innovation hackathon solving India's biggest health challenges with technology.", category: "Hackathon",  venue: "Research Centre"     },
  { id: 12, title: "Inter-College Cricket", college: "Delhi University",start:new Date(2026,2,29),end:new Date(2026,2,29),  description: "Annual inter-college T20 cricket tournament — 32 college teams competing for the trophy.", category: "Sports",    venue: "DU Cricket Ground"   },
];

/* ─────────────────────────────────────────────────────────────────────────────
   INJECTED CALENDAR CSS  (dark-theme overrides for react-big-calendar)
───────────────────────────────────────────────────────────────────────────── */
const CalendarStyles = () => (
  <style>{`
    /* ── Toolbar & wrapper ── */
    .rbc-calendar                  { background: transparent; border: none; font-family: 'DM Sans', sans-serif; }
    .rbc-toolbar                   { display: none; } /* we render our own */

    /* ── Month grid ── */
    .rbc-month-view                { border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; background: rgba(255,255,255,0.02); }
    .rbc-month-row                 { border-top: 1px solid rgba(255,255,255,0.05); }
    .rbc-day-bg                    { border-right: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
    .rbc-day-bg:last-child         { border-right: none; }
    .rbc-day-bg:hover              { background: rgba(124,58,237,0.06); }
    .rbc-off-range-bg              { background: rgba(0,0,0,0.15); }
    .rbc-today                     { background: rgba(124,58,237,0.1) !important; box-shadow: inset 0 0 0 1.5px rgba(124,58,237,0.45); }

    /* ── Date header cells ── */
    .rbc-header                    { background: rgba(15,23,42,0.6); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 8px; font-size: 11.5px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.05); }
    .rbc-header:last-child         { border-right: none; }
    .rbc-date-cell                 { padding: 6px 8px 2px; text-align: right; }
    .rbc-date-cell > a             { color: #94A3B8; font-size: 13px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
    .rbc-date-cell > a:hover       { color: #fff; }
    .rbc-now > a                   { color: #fff !important; font-weight: 800; background: linear-gradient(135deg,#7C3AED,#3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* ── Event bubbles ── */
    .rbc-event                     { border: none !important; border-radius: 6px !important; padding: 2px 6px !important; font-size: 11.5px !important; font-weight: 600 !important; font-family: 'DM Sans', sans-serif !important; cursor: pointer; transition: all 0.2s ease !important; }
    .rbc-event:hover               { filter: brightness(1.2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important; }
    .rbc-event:focus               { outline: none !important; }
    .rbc-event-label               { display: none; }
    .rbc-event-content             { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rbc-show-more                 { color: #7C3AED; font-size: 11px; font-weight: 700; background: none; margin-top: 2px; padding: 1px 6px; }
    .rbc-show-more:hover           { color: #22D3EE; }

    /* ── Row / cell sizing ── */
    .rbc-row-segment               { padding: 1px 3px; }
    .rbc-row-content               { z-index: 1; }

    /* ── Week & Day view ── */
    .rbc-time-view                 { border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; background: rgba(255,255,255,0.02); }
    .rbc-time-header               { background: rgba(15,23,42,0.6); border-bottom: 1px solid rgba(255,255,255,0.06); }
    .rbc-time-header-content       { border-left: 1px solid rgba(255,255,255,0.05); }
    .rbc-time-header-cell          { min-height: 40px; }
    .rbc-time-content              { border-top: 1px solid rgba(255,255,255,0.05); }
    .rbc-time-gutter               { background: rgba(15,23,42,0.4); }
    .rbc-timeslot-group            { border-bottom: 1px solid rgba(255,255,255,0.04); min-height: 48px; }
    .rbc-time-slot                 { border-top: 1px solid rgba(255,255,255,0.03); }
    .rbc-label                     { color: #475569; font-size: 11px; font-weight: 500; padding: 0 8px; }
    .rbc-day-slot .rbc-time-slot   { border-top: 1px solid rgba(255,255,255,0.03); }
    .rbc-day-slot .rbc-event       { border-radius: 8px !important; padding: 4px 8px !important; }
    .rbc-current-time-indicator    { background: #7C3AED; height: 2px; box-shadow: 0 0 8px rgba(124,58,237,0.8); }
    .rbc-allday-cell               { background: rgba(124,58,237,0.04); }

    /* ── Agenda view ── */
    .rbc-agenda-view               { border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
    .rbc-agenda-table              { border-collapse: collapse; }
    .rbc-agenda-table td, .rbc-agenda-table th { border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 14px; color: #E2E8F0; font-size: 13px; }
    .rbc-agenda-table th           { color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; }
    .rbc-agenda-date-cell          { color: #94A3B8 !important; white-space: nowrap; }
    .rbc-agenda-time-cell          { color: #64748B !important; white-space: nowrap; }
    .rbc-agenda-event-cell         { cursor: pointer; }

    /* ── Week header day numbers ── */
    .rbc-header + .rbc-header      { border-left: 1px solid rgba(255,255,255,0.05); }

    /* ── Selected / active cell ── */
    .rbc-selected                  { background: rgba(124,58,237,0.3) !important; }

    /* ── Scrollbar inside calendar ── */
    .rbc-time-content::-webkit-scrollbar { width: 4px; }
    .rbc-time-content::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 2px; }

    /* ── Modal animation ── */
    @keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
    .modal-animate { animation: modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .backdrop-animate { animation: backdropIn 0.2s ease forwards; }

    /* ── Sidebar upcoming events ── */
    @keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
    .upcoming-item { animation: slideInRight 0.4s ease both; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOM TOOLBAR  (replaces default react-big-calendar toolbar entirely)
───────────────────────────────────────────────────────────────────────────── */
const CustomToolbar = ({ date, view, onNavigate, onView, views }) => {
  const title = format(date, view === "day" ? "EEEE, MMMM d yyyy" : view === "week" ? "MMMM yyyy" : "MMMM yyyy");
  const VIEW_LABELS = { month: "Month", week: "Week", day: "Day" };

  const navBtnStyle = (hovered) => ({
    background:    "rgba(255,255,255,0.05)",
    border:        "1px solid rgba(255,255,255,0.08)",
    borderRadius:  10,
    color:         "#E2E8F0",
    width:         36,
    height:        36,
    display:       "flex",
    alignItems:    "center",
    justifyContent:"center",
    cursor:        "pointer",
    transition:    "all 0.2s",
  });

  const [hov, setHov] = useState({});

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
      {/* Left — navigation */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Today */}
        <button
          onClick={() => onNavigate("TODAY")}
          className="btn-outline"
          style={{ padding:"7px 16px", borderRadius:10, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans", letterSpacing:"0.2px" }}
        >
          <span>Today</span>
        </button>

        {/* Back */}
        <button
          style={{
            ...navBtnStyle(),
            background: hov.back ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
            borderColor: hov.back ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)",
          }}
          onMouseEnter={() => setHov(h => ({ ...h, back:true  }))}
          onMouseLeave={() => setHov(h => ({ ...h, back:false }))}
          onClick={() => onNavigate("PREV")}
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Forward */}
        <button
          style={{
            ...navBtnStyle(),
            background: hov.next ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
            borderColor: hov.next ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)",
          }}
          onMouseEnter={() => setHov(h => ({ ...h, next:true  }))}
          onMouseLeave={() => setHov(h => ({ ...h, next:false }))}
          onClick={() => onNavigate("NEXT")}
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>

        {/* Date title */}
        <span style={{ fontFamily:"Syne", fontWeight:700, fontSize:"clamp(16px,2vw,22px)", color:"#F1F5F9", letterSpacing:"-0.3px", marginLeft:6 }}>
          {title}
        </span>
      </div>

      {/* Right — view switcher */}
      <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:3, gap:2 }}>
        {(views || ["month","week","day"]).map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            style={{
              padding:     "6px 16px",
              borderRadius: 9,
              border:       "none",
              background:   view === v
                ? "linear-gradient(135deg,#7C3AED,#3B82F6)"
                : "transparent",
              color:        view === v ? "#fff" : "#64748B",
              fontSize:     13,
              fontWeight:   600,
              cursor:       "pointer",
              fontFamily:   "DM Sans",
              transition:   "all 0.25s",
              boxShadow:    view === v ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
            }}
          >
            {VIEW_LABELS[v] || v}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT MODAL
───────────────────────────────────────────────────────────────────────────── */
const EventModal = ({ event, onClose }) => {
  const c  = catColor(event.category);
  const bg = catBg(event.category);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isMultiDay = !isSameDay(event.start, event.end);
  const dateStr = isMultiDay
    ? `${format(event.start, "MMM d")} – ${format(event.end, "MMM d, yyyy")}`
    : format(event.start, "EEEE, MMMM d, yyyy");

  return (
    /* Backdrop */
    <div
      className="backdrop-animate"
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         2000,
        background:     "rgba(0,0,0,0.65)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        24,
      }}
    >
      {/* Modal card — stop propagation so click inside doesn't close */}
      <div
        className="modal-animate"
        onClick={(e) => e.stopPropagation()}
        style={{
          width:        "100%",
          maxWidth:     480,
          background:   "rgba(15,23,42,0.92)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border:       `1px solid ${c}44`,
          borderRadius: 24,
          overflow:     "hidden",
          boxShadow:    `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${c}22`,
          position:     "relative",
        }}
      >
        {/* Colour header strip */}
        <div style={{
          height:     6,
          background: `linear-gradient(90deg, ${c}, ${c}88)`,
          borderRadius:"24px 24px 0 0",
        }} />

        {/* Header */}
        <div style={{ padding:"24px 24px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            {/* Category pill */}
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          6,
              background:   bg,
              border:       `1px solid ${c}44`,
              borderRadius: 100,
              padding:      "3px 12px",
              marginBottom: 10,
            }}>
              <span style={{ fontSize:13 }}>{catEmoji(event.category)}</span>
              <span style={{ fontSize:11.5, fontWeight:700, color:c, letterSpacing:"0.6px", textTransform:"uppercase" }}>
                {event.category}
              </span>
            </div>
            {/* Title */}
            <h2 style={{ fontFamily:"Syne", fontWeight:800, fontSize:"clamp(18px,3vw,24px)", color:"#F1F5F9", lineHeight:1.15, marginBottom:4, letterSpacing:"-0.4px" }}>
              {event.title}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background:   "rgba(255,255,255,0.06)",
              border:       "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color:        "#94A3B8",
              width:        36,
              height:       36,
              display:      "flex",
              alignItems:   "center",
              justifyContent:"center",
              cursor:       "pointer",
              marginLeft:   12,
              flexShrink:   0,
              transition:   "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color="#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color="#94A3B8"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:"16px 24px 24px" }}>
          {/* Meta rows */}
          {[
            { icon:<Building2 size={14}/>, value: event.college  },
            { icon:<Clock    size={14}/>, value: dateStr          },
            { icon:<MapPin   size={14}/>, value: event.venue || "Venue TBA" },
            { icon:<Tag      size={14}/>, value: event.category   },
          ].map(({ icon, value }, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ color: c, flexShrink:0 }}>{icon}</div>
              <span style={{ fontSize:14, color:"#94A3B8", fontWeight:400 }}>{value}</span>
            </div>
          ))}

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"14px 0" }} />

          {/* Description */}
          {event.description && (
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <Info size={13} color="#64748B" />
                <span style={{ fontSize:11.5, fontWeight:700, color:"#64748B", letterSpacing:"0.8px", textTransform:"uppercase" }}>About</span>
              </div>
              <p style={{ fontSize:14.5, color:"#94A3B8", lineHeight:1.75, fontWeight:300 }}>
                {event.description}
              </p>
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display:"flex", gap:12 }}>
            <button
              className="btn-primary"
              style={{ flex:1, padding:"12px", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"Syne", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            >
              <Sparkles size={15} /> Register
            </button>
            <button
              className="btn-outline"
              style={{ flex:1, padding:"12px", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Syne", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            >
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                <ExternalLink size={14} /> View Details
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   UPCOMING EVENTS SIDEBAR CARD
───────────────────────────────────────────────────────────────────────────── */
const UpcomingEventCard = ({ event, index, onClick }) => {
  const c  = catColor(event.category);
  const bg = catBg(event.category);
  const [hov, setHov] = useState(false);

  return (
    <div
      className="upcoming-item"
      onClick={() => onClick(event)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay:  `${index * 0.08}s`,
        padding:         "14px 16px",
        borderRadius:    14,
        background:      hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border:          `1px solid ${hov ? c + "55" : "rgba(255,255,255,0.06)"}`,
        cursor:          "pointer",
        transition:      "all 0.3s ease",
        transform:       hov ? "translateX(4px)" : "none",
        boxShadow:       hov ? `0 8px 24px rgba(0,0,0,0.3), 0 0 20px ${c}18` : "none",
      }}
    >
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        {/* Emoji bubble */}
        <div style={{
          width:        42,
          height:       42,
          borderRadius: 10,
          background:   bg,
          border:       `1px solid ${c}44`,
          display:      "flex",
          alignItems:   "center",
          justifyContent:"center",
          fontSize:     19,
          flexShrink:   0,
        }}>
          {catEmoji(event.category)}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:13.5, color:"#F1F5F9", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {event.title}
          </div>
          <div style={{ fontSize:11.5, color:"#64748B", marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {event.college}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:c, flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:600, color:c }}>{format(event.start, "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER BAR
───────────────────────────────────────────────────────────────────────────── */
const FilterBar = ({ collegeFilter, setCollegeFilter, catFilter, setCatFilter, colleges }) => {
  const selectStyle = {
    background:   "rgba(255,255,255,0.04)",
    border:       "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color:        "#E2E8F0",
    fontSize:     13,
    fontFamily:   "DM Sans",
    padding:      "8px 12px",
    cursor:       "pointer",
    outline:      "none",
    minWidth:     160,
    transition:   "border-color 0.2s",
  };

  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, color:"#64748B" }}>
        <Filter size={14} />
        <span style={{ fontSize:13, fontWeight:600, letterSpacing:"0.3px" }}>Filter:</span>
      </div>

      {/* College */}
      <select
        value={collegeFilter}
        onChange={(e) => setCollegeFilter(e.target.value)}
        style={selectStyle}
        onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
        onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      >
        <option value="">All Colleges</option>
        {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Category */}
      <select
        value={catFilter}
        onChange={(e) => setCatFilter(e.target.value)}
        style={selectStyle}
        onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
        onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      >
        <option value="">All Categories</option>
        {Object.keys(CATEGORY_META).map((c) => (
          <option key={c} value={c}>{CATEGORY_META[c].emoji} {c}</option>
        ))}
      </select>

      {/* Clear */}
      {(collegeFilter || catFilter) && (
        <button
          onClick={() => { setCollegeFilter(""); setCatFilter(""); }}
          style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:9, color:"#f87171", fontSize:12.5, fontWeight:600, cursor:"pointer", padding:"7px 14px", transition:"all 0.2s", fontFamily:"DM Sans" }}
          onMouseEnter={(e) => { e.currentTarget.style.background="rgba(239,68,68,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; }}
        >
          × Clear
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY LEGEND
───────────────────────────────────────────────────────────────────────────── */
const CategoryLegend = () => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
    {Object.entries(CATEGORY_META).map(([cat, meta]) => (
      <div key={cat} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:100, background:meta.bg, border:`1px solid ${meta.color}33` }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:meta.color }} />
        <span style={{ fontSize:11.5, fontWeight:600, color:meta.color, letterSpacing:"0.3px" }}>{cat}</span>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate,   setCurrentDate]   = useState(new Date(2026, 2, 1)); // Mar 2026
  const [currentView,   setCurrentView]   = useState("month");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [catFilter,     setCatFilter]     = useState("");

  /* Prevent body scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = selectedEvent ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedEvent]);

  /* Unique college list */
  const colleges = useMemo(
    () => [...new Set(SAMPLE_EVENTS.map((e) => e.college))].sort(),
    []
  );

  /* Filtered events */
  const filteredEvents = useMemo(() => SAMPLE_EVENTS.filter((ev) => {
    if (collegeFilter && ev.college !== collegeFilter) return false;
    if (catFilter     && ev.category !== catFilter)    return false;
    return true;
  }), [collegeFilter, catFilter]);

  /* Upcoming events: next 3 future events sorted by date */
  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return [...SAMPLE_EVENTS]
      .filter((ev) => isAfter(ev.start, today) || isSameDay(ev.start, today))
      .sort((a, b) => a.start - b.start)
      .slice(0, 4);
  }, []);

  /* react-big-calendar callbacks */
  const handleSelectEvent = useCallback((event) => setSelectedEvent(event), []);
  const handleNavigate    = useCallback((date)  => setCurrentDate(date),    []);
  const handleView        = useCallback((view)  => setCurrentView(view),    []);

  /* Custom event style per category */
  const eventStyleGetter = useCallback((event) => ({
    style: {
      backgroundColor: catBg(event.category),
      color:           catColor(event.category),
      border:          `1px solid ${catColor(event.category)}55`,
      borderLeft:      `3px solid ${catColor(event.category)}`,
    },
  }), []);

  /* Custom event render */
  const EventComponent = useCallback(({ event }) => (
    <div style={{ display:"flex", alignItems:"center", gap:4, overflow:"hidden" }}>
      <span style={{ fontSize:10 }}>{catEmoji(event.category)}</span>
      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:11.5, fontWeight:600 }}>
        {event.title}
      </span>
    </div>
  ), []);

  /* Components map for react-big-calendar */
  const components = useMemo(() => ({
    toolbar:   CustomToolbar,
    event:     EventComponent,
  }), [EventComponent]);

  return (
    <div style={{ position:"relative", minHeight:"100vh", background:"#0F172A", fontFamily:"DM Sans, sans-serif" }}>

      {/* ── Injected calendar dark-theme CSS ── */}
      <CalendarStyles />

      {/* ── Ambient noise grain ── */}
      <div className="noise" />

      {/* ── Twinkling stars ── */}
      <Stars />

      {/* ── Ambient orbs ── */}
      <div className="orb1" style={{ position:"fixed", top:"5%", left:"-8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 70%)", filter:"blur(50px)", pointerEvents:"none", zIndex:0 }} />
      <div className="orb2" style={{ position:"fixed", bottom:"10%", right:"5%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(34,211,238,0.10) 0%,transparent 70%)", filter:"blur(50px)", pointerEvents:"none", zIndex:0 }} />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main content ── */}
      <main style={{ position:"relative", zIndex:1, paddingTop:88 }}>
        <div style={{ maxWidth:1380, margin:"0 auto", padding:"40px 24px 80px" }}>

          {/* ── Page Header ── */}
          <div className="animate-fade-up" style={{ marginBottom:36 }}>
            {/* Eyebrow */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:100, padding:"6px 16px", marginBottom:18 }}>
              <CalIcon size={13} color="#7C3AED" />
              <span style={{ fontSize:12, fontWeight:700, color:"#7C3AED", letterSpacing:"0.8px", textTransform:"uppercase" }}>Event Calendar</span>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:20 }}>
              <div>
                <h1 style={{ fontFamily:"Syne", fontWeight:800, fontSize:"clamp(28px,4vw,48px)", color:"#F8FAFC", letterSpacing:"-1px", lineHeight:1.1, marginBottom:10 }}>
                  Discover &amp; Plan{" "}
                  <span className="grad-text">Events</span>
                </h1>
                <p style={{ fontSize:16, color:"#64748B", fontWeight:300, maxWidth:480, lineHeight:1.65 }}>
                  Browse all inter-college events in one view. Click any event to register instantly.
                </p>
              </div>

              {/* Stats pills */}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[
                  { label: "Total Events",     value: SAMPLE_EVENTS.length },
                  { label: "Upcoming",         value: upcomingEvents.length },
                  { label: "Categories",       value: Object.keys(CATEGORY_META).length },
                ].map(({ label, value }) => (
                  <div key={label} className="glass" style={{ borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
                    <div style={{ fontFamily:"Syne", fontWeight:800, fontSize:22, lineHeight:1 }} className="grad-text">{value}</div>
                    <div style={{ fontSize:11.5, color:"#64748B", marginTop:3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter bar */}
            <FilterBar
              collegeFilter={collegeFilter} setCollegeFilter={setCollegeFilter}
              catFilter={catFilter}         setCatFilter={setCatFilter}
              colleges={colleges}
            />
          </div>

          {/* ── Two-column layout: Calendar + Sidebar ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }}>

            {/* ── LEFT: Calendar ── */}
            <div>
              <div className="glass" style={{ borderRadius:22, padding:20, border:"1px solid rgba(255,255,255,0.07)" }}>
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: currentView === "month" ? 640 : 700 }}
                  date={currentDate}
                  view={currentView}
                  onNavigate={handleNavigate}
                  onView={handleView}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  components={components}
                  views={["month", "week", "day"]}
                  popup
                  showMultiDayTimes
                  tooltipAccessor={null}
                />
              </div>

              {/* Legend */}
              <div style={{ marginTop:16, padding:"14px 20px", borderRadius:14, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <LayoutGrid size={13} color="#64748B" />
                  <span style={{ fontSize:11.5, fontWeight:700, color:"#64748B", letterSpacing:"0.8px", textTransform:"uppercase" }}>Category Legend</span>
                </div>
                <CategoryLegend />
              </div>
            </div>

            {/* ── RIGHT: Upcoming Events Sidebar ── */}
            <div style={{ position:"sticky", top:100 }}>
              {/* Upcoming header */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#22D3EE", boxShadow:"0 0 8px rgba(34,211,238,0.7)" }} />
                  <span style={{ fontFamily:"Syne", fontWeight:700, fontSize:15, color:"#F1F5F9" }}>Upcoming Events</span>
                </div>
                <p style={{ fontSize:12.5, color:"#475569", paddingLeft:16 }}>Next events happening soon</p>
              </div>

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {upcomingEvents.map((ev, i) => (
                  <UpcomingEventCard
                    key={ev.id}
                    event={ev}
                    index={i}
                    onClick={setSelectedEvent}
                  />
                ))}
              </div>

              {/* Filtered count */}
              <div style={{ marginTop:20, padding:"12px 16px", borderRadius:12, background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.18)", textAlign:"center" }}>
                <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:20, color:"#7C3AED" }}>
                  {filteredEvents.length}
                </div>
                <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>
                  {collegeFilter || catFilter ? "matching events" : "total events"}
                </div>
              </div>

              {/* Mini CTA */}
              <div style={{ marginTop:16, padding:"16px", borderRadius:16, background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(34,211,238,0.06))", border:"1px solid rgba(124,58,237,0.2)", textAlign:"center" }}>
                <div style={{ fontSize:22, marginBottom:8 }}>🚀</div>
                <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:14, color:"#F1F5F9", marginBottom:6 }}>Host an Event</div>
                <p style={{ fontSize:12, color:"#64748B", lineHeight:1.5, marginBottom:12 }}>Create and manage your own inter-college event</p>
                <button className="btn-primary" style={{ width:"100%", padding:"9px", borderRadius:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"Syne" }}>
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Event Modal ── */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default CalendarPage;