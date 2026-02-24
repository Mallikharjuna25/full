import React from "react";
import { Search, Shield, QrCode, CheckCircle, Zap } from "lucide-react";

/**
 * HowItWorksSection
 * ─────────────────────────────────────────────
 * Horizontal 4-step flow showing the user journey:
 *   Browse → Register → QR Pass → Verify
 *
 * Features:
 *  • Animated numbered badge per step
 *  • Connecting gradient line (hidden on mobile)
 *  • Scroll-triggered reveal via .reveal CSS class
 *  • Hover scale on each step card
 */

const STEPS = [
  {
    icon:  <Search size={24} />,
    num:   "01",
    title: "Browse Events",
    desc:  "Explore hundreds of curated college events filtered by type, date, and location.",
    color: "#7C3AED",
  },
  {
    icon:  <Shield size={24} />,
    num:   "02",
    title: "Register Securely",
    desc:  "One-click registration with institutional email verification and data encryption.",
    color: "#3B82F6",
  },
  {
    icon:  <QrCode size={24} />,
    num:   "03",
    title: "Get QR Pass",
    desc:  "Receive a personalized, tamper-proof QR pass instantly on your device.",
    color: "#22D3EE",
  },
  {
    icon:  <CheckCircle size={24} />,
    num:   "04",
    title: "Verify at Entry",
    desc:  "Organizers scan your QR in milliseconds for frictionless, contactless entry.",
    color: "#22C55E",
  },
];

/* ── Single step tile ── */
const StepCard = ({ icon, num, title, desc, color }) => (
  <div
    className="step-card reveal"
    style={{ padding:"8px 20px", textAlign:"center" }}
  >
    {/* Icon + number badge */}
    <div style={{ position:"relative", display:"inline-flex", marginBottom:24 }}>
      <div
        style={{
          width:         80,
          height:        80,
          borderRadius:  20,
          background:    `${color}15`,
          border:        `2px solid ${color}35`,
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          color:         color,
        }}
      >
        {icon}
        {/* inner glow ring */}
        <div style={{ position:"absolute", inset:-1, borderRadius:20, border:`1px solid ${color}20` }} />
      </div>

      {/* Numbered badge */}
      <div
        style={{
          position:      "absolute",
          top:           -10,
          right:         -10,
          width:         26,
          height:        26,
          borderRadius:  8,
          background:    color,
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          fontFamily:    "Syne",
          fontWeight:    800,
          fontSize:      10,
          color:         "#fff",
        }}
      >
        {num}
      </div>
    </div>

    <h3 style={{ fontFamily:"Syne", fontWeight:700, fontSize:18, color:"#F1F5F9", marginBottom:10 }}>
      {title}
    </h3>
    <p style={{ fontSize:14, color:"#64748B", lineHeight:1.7, fontWeight:300 }}>
      {desc}
    </p>
  </div>
);

const HowItWorksSection = () => (
  <section
    id="how-it-works"
    style={{
      padding:    "100px 24px",
      background: "rgba(255,255,255,0.01)",
      position:   "relative",
    }}
  >
    {/* Subtle top/bottom fade */}
    <div
      style={{
        position:     "absolute",
        inset:        0,
        background:   "linear-gradient(180deg,transparent,rgba(15,23,42,0.8))",
        pointerEvents:"none",
      }}
    />

    <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>

      {/* Section header */}
      <div className="reveal" style={{ textAlign:"center", marginBottom:72 }}>
        <div
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          8,
            background:   "rgba(34,211,238,0.08)",
            border:       "1px solid rgba(34,211,238,0.2)",
            borderRadius: 100,
            padding:      "6px 16px",
            marginBottom: 20,
          }}
        >
          <Zap size={13} color="#22D3EE" />
          <span style={{ fontSize:12, fontWeight:600, color:"#22D3EE", letterSpacing:"0.8px", textTransform:"uppercase" }}>
            How It Works
          </span>
        </div>

        <h2
          style={{
            fontFamily:   "Syne",
            fontWeight:   800,
            fontSize:     "clamp(28px,4vw,50px)",
            color:        "#F8FAFC",
            letterSpacing:"-1px",
            lineHeight:   1.1,
          }}
        >
          From discovery to entry,<br />
          <span className="grad-text">in four steps</span>
        </h2>
      </div>

      {/* Steps grid */}
      <div style={{ position:"relative" }}>
        {/* Connecting gradient line — visible on wide screens only */}
        <div
          className="hidden-mobile"
          style={{
            position:   "absolute",
            top:        40,
            left:       "12%",
            right:      "12%",
            height:     1,
            background: "linear-gradient(90deg,#7C3AED,#3B82F6,#22D3EE,#22C55E)",
            opacity:    0.25,
            pointerEvents:"none",
          }}
        />

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap:                 0,
          }}
        >
          {STEPS.map((s) => (
            <StepCard key={s.num} {...s} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;