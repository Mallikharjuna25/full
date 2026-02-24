import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import EventCard from "./EventCard";

/**
 * EventsSection
 * ─────────────────────────────────────────────
 * Responsive grid of sample EventCards pulled from EVENTS data.
 * Each card uses the shared <EventCard /> component.
 */

const EVENTS = [
  { name:"TechFest 2025",       college:"IIT Bombay",   date:"Mar 14, 2025", type:"Tech",      color:"#7C3AED", attendees:"420"  },
  { name:"Hackathon X",         college:"NIT Trichy",   date:"Mar 20, 2025", type:"Hackathon", color:"#0EA5E9", attendees:"285"  },
  { name:"CultFest '25",        college:"BITS Pilani",  date:"Apr 2, 2025",  type:"Cultural",  color:"#EC4899", attendees:"1.2K" },
  { name:"Robotics Summit",     college:"VIT Vellore",  date:"Apr 10, 2025", type:"Science",   color:"#22D3EE", attendees:"350"  },
  { name:"E-Cell Conclave",     college:"SRCC Delhi",   date:"Apr 15, 2025", type:"Business",  color:"#F59E0B", attendees:"510"  },
  { name:"Sports Day '25",      college:"Amity Noida",  date:"Apr 22, 2025", type:"Sports",    color:"#22C55E", attendees:"890"  },
];

const EventsSection = () => (
  <section
    id="events"
    style={{ padding:"100px 24px", position:"relative" }}
  >
    <div style={{ maxWidth:1280, margin:"0 auto" }}>

      {/* ── Section header ── */}
      <div
        className="reveal"
        style={{
          display:       "flex",
          justifyContent:"space-between",
          alignItems:    "flex-end",
          marginBottom:  48,
          flexWrap:      "wrap",
          gap:           20,
        }}
      >
        <div>
          {/* Eyebrow tag */}
          <div
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          8,
              background:   "rgba(34,211,238,0.1)",
              border:       "1px solid rgba(34,211,238,0.2)",
              borderRadius: 100,
              padding:      "6px 16px",
              marginBottom: 16,
            }}
          >
            <Calendar size={13} color="#22D3EE" />
            <span style={{ fontSize:12, fontWeight:600, color:"#22D3EE", letterSpacing:"0.8px", textTransform:"uppercase" }}>
              Upcoming Events
            </span>
          </div>

          <h2
            style={{
              fontFamily:   "Syne",
              fontWeight:   800,
              fontSize:     "clamp(28px,3.5vw,48px)",
              color:        "#F8FAFC",
              letterSpacing:"-1px",
              lineHeight:   1.1,
            }}
          >
            Events happening<br />
            <span className="grad-text">right now</span>
          </h2>
        </div>

        {/* View all CTA */}
        <button
          className="btn-outline"
          style={{
            padding:     "12px 24px",
            borderRadius: 12,
            color:        "#fff",
            fontSize:     14,
            fontWeight:   600,
            cursor:       "pointer",
            fontFamily:   "DM Sans",
            whiteSpace:   "nowrap",
          }}
        >
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            View All Events <ArrowRight size={15} />
          </span>
        </button>
      </div>

      {/* ── Event cards grid ── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap:                 22,
        }}
      >
        {EVENTS.map((ev) => (
          <EventCard
            key={ev.name}
            {...ev}
            onRegister={() => alert(`Registered for ${ev.name}!`)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;