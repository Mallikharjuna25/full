import React from "react";
import { MapPin, Clock, Users } from "lucide-react";

/**
 * EventCard
 * ─────────────────────────────────────────────
 * Reusable card component for displaying a single event.
 *
 * Props:
 *  @param {string}  name       – Event name
 *  @param {string}  college    – Hosting college
 *  @param {string}  date       – Event date string (e.g. "Mar 14, 2025")
 *  @param {string}  type       – Category label (e.g. "Tech", "Cultural")
 *  @param {string}  color      – Hex accent colour for the card theme
 *  @param {string}  attendees  – Formatted attendee count (e.g. "420" or "1.2K")
 *  @param {string}  [emoji]    – Optional emoji illustration for the image area
 *  @param {function}[onRegister] – Callback fired when "Register Now" is clicked
 */

/* Map category labels → emoji illustrations */
const TYPE_EMOJI = {
  Tech:      "⚡",
  Hackathon: "🧩",
  Cultural:  "🎭",
  Science:   "🤖",
  Business:  "💼",
  Sports:    "🏆",
};

const EventCard = ({
  name      = "Event Name",
  college   = "College Name",
  date      = "TBA",
  type      = "Tech",
  color     = "#7C3AED",
  attendees = "0",
  emoji,
  onRegister,
}) => {
  const icon = emoji || TYPE_EMOJI[type] || "🎪";

  /* ── dynamic hover handler for the register button ── */
  const handleBtnEnter = (e) => {
    e.currentTarget.style.background   = color;
    e.currentTarget.style.color        = "#fff";
    e.currentTarget.style.borderColor  = color;
  };
  const handleBtnLeave = (e) => {
    e.currentTarget.style.background   = `${color}12`;
    e.currentTarget.style.color        = color;
    e.currentTarget.style.borderColor  = `${color}44`;
  };

  return (
    <div
      className="event-card glass reveal"
      style={{
        borderRadius: 18,
        overflow:     "hidden",
        border:       "1px solid rgba(255,255,255,0.07)",
        display:      "flex",
        flexDirection:"column",
      }}
    >
      {/* ── Illustration area ── */}
      <div
        style={{
          height:         160,
          background:     `linear-gradient(135deg, ${color}20, ${color}05, #0d1425)`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          position:       "relative",
          overflow:       "hidden",
          flexShrink:     0,
        }}
      >
        {/* Emoji icon */}
        <span
          className="card-img"
          style={{ fontSize:52, filter:"drop-shadow(0 0 20px currentColor)", userSelect:"none" }}
        >
          {icon}
        </span>

        {/* Type badge */}
        <div
          style={{
            position:     "absolute",
            top:          12,
            left:         12,
            background:   `${color}22`,
            border:       `1px solid ${color}44`,
            borderRadius: 8,
            padding:      "4px 10px",
            fontSize:     11.5,
            fontWeight:   700,
            color:        color,
            letterSpacing:"0.5px",
          }}
        >
          {type}
        </div>

        {/* Radial glow */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: `radial-gradient(circle at 70% 30%, ${color}15 0%, transparent 60%)`,
            pointerEvents:"none",
          }}
        />
      </div>

      {/* ── Content area ── */}
      <div style={{ padding:"18px 20px 20px", flex:1, display:"flex", flexDirection:"column" }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: "Syne",
            fontWeight: 800,
            fontSize:   17.5,
            color:      "#F1F5F9",
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          {name}
        </h3>

        {/* College */}
        <div
          style={{ display:"flex", alignItems:"center", gap:6, color:"#64748B", fontSize:13, marginBottom:4 }}
        >
          <MapPin size={12} color="#475569" />
          {college}
        </div>

        {/* Date + attendees row */}
        <div
          style={{ display:"flex", alignItems:"center", gap:6, color:"#64748B", fontSize:13, marginBottom:16 }}
        >
          <Clock size={12} color="#475569" />
          {date}
          <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, color:"#94A3B8" }}>
            <Users size={12} /> {attendees}
          </span>
        </div>

        {/* Register button */}
        <button
          onClick={onRegister}
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
          style={{
            marginTop:    "auto",
            width:        "100%",
            padding:      "10px",
            borderRadius: 10,
            fontFamily:   "Syne",
            fontWeight:   700,
            fontSize:     13.5,
            cursor:       "pointer",
            border:       `1.5px solid ${color}44`,
            background:   `${color}12`,
            color:        color,
            transition:   "all 0.3s",
          }}
        >
          Register Now →
        </button>
      </div>
    </div>
  );
};

export default EventCard;