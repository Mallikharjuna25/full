import React from "react";
import { Globe, QrCode, BarChart3, Zap, ChevronRight } from "lucide-react";

/**
 * FeaturesSection
 * ─────────────────────────────────────────────
 * Three premium glass-morphism feature cards with:
 *  • Animated border glow (via CSS keyframe)
 *  • Hover lift + scale
 *  • Color-coded icon tiles
 *  • Section header with eyebrow tag
 */

const FEATURES = [
  {
    icon:  <Globe size={28} />,
    color: "#7C3AED",
    tag:   "Discovery",
    title: "Centralized Event Discovery",
    desc:  "Browse and filter thousands of events across 200+ colleges in one seamless feed. Personalized recommendations based on your interests and location.",
  },
  {
    icon:  <QrCode size={28} />,
    color: "#0EA5E9",
    tag:   "Security",
    title: "Secure QR-Based Verification",
    desc:  "Every registrant receives a cryptographically-signed QR pass. Organizers scan at entry for instant, tamper-proof verification — no more manual lists.",
  },
  {
    icon:  <BarChart3 size={28} />,
    color: "#EC4899",
    tag:   "Analytics",
    title: "Real-Time Analytics",
    desc:  "Live dashboards showing registrations, check-in rates, demographics, and engagement. Make data-driven decisions before, during, and after every event.",
  },
];

/* ── Single feature card ── */
const FeatureCard = ({ icon, color, tag, title, desc, delay = 0 }) => (
  <div
    className="feature-card glass reveal"
    style={{
      borderRadius:    20,
      padding:         32,
      border:          "1px solid rgba(255,255,255,0.07)",
      animationDelay:  `${delay}s`,
    }}
  >
    {/* Icon tile */}
    <div
      style={{
        width:         58,
        height:        58,
        borderRadius:  14,
        background:    `${color}18`,
        border:        `1px solid ${color}33`,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        marginBottom:  20,
        color:         color,
      }}
    >
      {icon}
    </div>

    {/* Tag pill */}
    <div
      style={{
        display:       "inline-block",
        fontSize:      11,
        fontWeight:    700,
        color:         color,
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom:  12,
        background:    `${color}14`,
        padding:       "3px 10px",
        borderRadius:  100,
      }}
    >
      {tag}
    </div>

    {/* Title */}
    <h3
      style={{
        fontFamily:   "Syne",
        fontWeight:   700,
        fontSize:     20,
        color:        "#F1F5F9",
        marginBottom: 12,
        lineHeight:   1.25,
      }}
    >
      {title}
    </h3>

    {/* Description */}
    <p style={{ fontSize:14.5, color:"#64748B", lineHeight:1.75, fontWeight:300 }}>
      {desc}
    </p>

    {/* Learn more link */}
    <div
      style={{
        marginTop:   24,
        display:     "flex",
        alignItems:  "center",
        gap:         6,
        color:       color,
        fontSize:    13.5,
        fontWeight:  600,
        cursor:      "pointer",
        transition:  "gap 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
      onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
    >
      Learn more <ChevronRight size={15} />
    </div>
  </div>
);

const FeaturesSection = () => (
  <section
    id="features"
    style={{ padding:"100px 24px", position:"relative" }}
  >
    {/* Subtle gradient overlay */}
    <div
      style={{
        position:   "absolute",
        inset:      0,
        background: "linear-gradient(180deg,transparent,rgba(124,58,237,0.04) 50%,transparent)",
        pointerEvents:"none",
      }}
    />

    <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
      {/* Section header */}
      <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
        <div
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          8,
            background:   "rgba(124,58,237,0.1)",
            border:       "1px solid rgba(124,58,237,0.25)",
            borderRadius: 100,
            padding:      "6px 16px",
            marginBottom: 20,
          }}
        >
          <Zap size={13} color="#7C3AED" />
          <span style={{ fontSize:12, fontWeight:600, color:"#7C3AED", letterSpacing:"0.8px", textTransform:"uppercase" }}>
            Core Features
          </span>
        </div>

        <h2
          style={{
            fontFamily:   "Syne",
            fontWeight:   800,
            fontSize:     "clamp(30px,4vw,52px)",
            color:        "#F8FAFC",
            letterSpacing:"-1px",
            marginBottom: 16,
            lineHeight:   1.1,
          }}
        >
          Everything you need,<br />
          <span className="grad-text">nothing you don't</span>
        </h2>

        <p
          style={{
            fontSize:   17,
            color:      "#64748B",
            maxWidth:   520,
            margin:     "0 auto",
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          Purpose-built features that make event management effortless for
          students and organizers alike.
        </p>
      </div>

      {/* Feature cards grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap:                 24,
        }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} {...f} delay={i * 0.5} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;