import React from "react";
import { Search, Calendar, ArrowRight, Bell, QrCode } from "lucide-react";

/**
 * HeroSection
 * ─────────────────────────────────────────────
 * Full-viewport hero with:
 *  • Animated headline (shimmer gradient)
 *  • Dual CTA buttons (primary + outline)
 *  • Floating 3-D dashboard mockup (right side, hidden on mobile)
 *  • Ambient orb blobs + grid background
 *  • Stats bar at the bottom
 */

/* ── Floating dashboard used on the right ── */
const DashboardMockup = () => (
  <div style={{ position:"relative", perspective:"1000px" }}>
    <div
      className="animate-float"
      style={{ position:"relative", transformStyle:"preserve-3d", transition:"transform 0.6s ease" }}
    >
      {/* Main glass panel */}
      <div
        className="glass-dark animate-pulse-glow"
        style={{ borderRadius:24, padding:24, position:"relative", overflow:"hidden" }}
      >
        {/* Window chrome */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:15, color:"#F8FAFC" }}>Event Dashboard</div>
            <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>Live · 3 upcoming</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {["#EF4444","#F59E0B","#22C55E"].map((c) => (
              <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
            ))}
          </div>
        </div>

        {/* Event rows */}
        {[
          { name:"TechFest 2025",  college:"IIT Bombay", date:"Mar 14", color:"#7C3AED", attendees:420  },
          { name:"Hackathon X",   college:"NIT Trichy",  date:"Mar 20", color:"#0EA5E9", attendees:285  },
        ].map((ev) => (
          <div
            key={ev.name}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           14,
              padding:       "12px 14px",
              borderRadius:  12,
              marginBottom:  10,
              background:    "rgba(255,255,255,0.04)",
              border:        "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width:        44,
                height:       44,
                borderRadius: 10,
                background:   `${ev.color}22`,
                border:       `1px solid ${ev.color}44`,
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                flexShrink:   0,
              }}
            >
              <Calendar size={18} color={ev.color} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:13, color:"#F1F5F9" }}>{ev.name}</div>
              <div style={{ fontSize:11, color:"#64748B" }}>{ev.college} · {ev.date}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:700, color:ev.color }}>{ev.attendees}</div>
              <div style={{ fontSize:10, color:"#475569" }}>registered</div>
            </div>
          </div>
        ))}

        {/* Mini bar chart */}
        <div
          style={{
            padding:      14,
            borderRadius: 12,
            background:   "rgba(255,255,255,0.03)",
            border:       "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#94A3B8" }}>Registrations</span>
            <span style={{ fontSize:12, color:"#22D3EE" }}>+24%</span>
          </div>
          <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:40 }}>
            {[60,80,55,90,70,95,75,100,85,110,88,120].map((h, i) => (
              <div
                key={i}
                style={{
                  flex:        1,
                  borderRadius:"3px 3px 0 0",
                  height:      `${h}%`,
                  background:  i === 11
                    ? "linear-gradient(180deg,#7C3AED,#22D3EE)"
                    : "rgba(124,58,237,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating QR badge */}
      <div
        className="animate-float-alt glass"
        style={{
          position:      "absolute",
          bottom:        -24,
          right:         -20,
          borderRadius:  16,
          padding:       "14px 16px",
          display:       "flex",
          alignItems:    "center",
          gap:           12,
        }}
      >
        <div
          style={{
            width:         44,
            height:        44,
            borderRadius:  10,
            background:    "linear-gradient(135deg,#7C3AED,#3B82F6)",
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
          }}
        >
          <QrCode size={22} color="white" />
        </div>
        <div>
          <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:12.5, color:"#F1F5F9" }}>QR Pass Ready</div>
          <div style={{ fontSize:11, color:"#22D3EE" }}>Verified ✓</div>
        </div>
      </div>

      {/* Floating notification badge */}
      <div
        className="glass"
        style={{
          position:      "absolute",
          top:           -16,
          left:          -20,
          borderRadius:  14,
          padding:       "10px 14px",
          display:       "flex",
          alignItems:    "center",
          gap:           10,
          animation:     "float 8s 1s ease-in-out infinite",
        }}
      >
        <Bell size={15} color="#F59E0B" />
        <div style={{ fontSize:12, fontWeight:600, color:"#F1F5F9" }}>3 events this week</div>
      </div>
    </div>
  </div>
);

/* ── Stat pill ── */
const Stat = ({ number, label }) => (
  <div>
    <div style={{ fontFamily:"Syne", fontWeight:800, fontSize:28, lineHeight:1 }} className="grad-text">
      {number}
    </div>
    <div style={{ fontSize:13, color:"#64748B", marginTop:4 }}>{label}</div>
  </div>
);

const HeroSection = () => (
  <section
    id="home"
    className="grid-bg"
    style={{
      minHeight:  "100vh",
      display:    "flex",
      alignItems: "center",
      padding:    "120px 24px 80px",
      position:   "relative",
      overflow:   "hidden",
    }}
  >
    {/* Ambient orbs */}
    <div
      className="orb1"
      style={{
        position:  "absolute", top:"10%", left:"-5%",
        width:500,  height:500, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)",
        filter:    "blur(40px)", pointerEvents:"none",
      }}
    />
    <div
      className="orb2"
      style={{
        position:  "absolute", bottom:"5%", right:"5%",
        width:400,  height:400, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(34,211,238,0.12) 0%,transparent 70%)",
        filter:    "blur(40px)", pointerEvents:"none",
      }}
    />

    <div
      style={{
        maxWidth:      1280,
        margin:        "0 auto",
        width:         "100%",
        display:       "grid",
        gridTemplateColumns:"1fr 1fr",
        gap:           80,
        alignItems:    "center",
      }}
    >
      {/* ── Left copy ── */}
      <div className="animate-fade-up">
        {/* Eyebrow tag */}
        <div
          className="tag"
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          8,
            background:   "rgba(124,58,237,0.12)",
            border:       "1px solid rgba(124,58,237,0.35)",
            borderRadius: 100,
            padding:      "6px 16px",
            marginBottom: 28,
          }}
        >
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22D3EE" }} />
          <span style={{ fontSize:12.5, fontWeight:600, color:"#94A3B8", letterSpacing:"0.8px", textTransform:"uppercase" }}>
            The Future of College Events
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily:   "Syne",
            fontWeight:   800,
            fontSize:     "clamp(38px,5vw,68px)",
            lineHeight:   1.07,
            marginBottom: 24,
            color:        "#F8FAFC",
            letterSpacing:"-1.5px",
          }}
        >
          Discover.
          <span className="shimmer-text"> Register.</span>
          <br />Verify.{" "}
          <span style={{ color:"rgba(226,232,240,0.5)" }}>Manage.</span>
        </h1>

        {/* Sub-copy */}
        <p
          style={{
            fontSize:     "clamp(15px,1.5vw,18px)",
            color:        "rgba(148,163,184,0.85)",
            lineHeight:   1.75,
            maxWidth:     500,
            marginBottom: 40,
            fontWeight:   300,
          }}
        >
          A centralized hub where students discover events across colleges, register
          securely, receive QR-verified passes, and organizers manage attendance in
          real-time — all in one elegant platform.
        </p>

        {/* CTA row */}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <button
            className="btn-primary"
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          10,
              padding:      "14px 28px",
              borderRadius: 12,
              color:        "#fff",
              fontSize:     15,
              fontWeight:   700,
              cursor:       "pointer",
              border:       "none",
              fontFamily:   "Syne",
            }}
          >
            <Search size={17} /> Explore Events <ArrowRight size={16} />
          </button>

          <button
            className="btn-outline"
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          10,
              padding:      "14px 28px",
              borderRadius: 12,
              color:        "#fff",
              fontSize:     15,
              fontWeight:   700,
              cursor:       "pointer",
              fontFamily:   "Syne",
            }}
          >
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Calendar size={17} /> Create Event
            </span>
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display:    "flex",
            gap:        40,
            marginTop:  56,
            paddingTop: 32,
            borderTop:  "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Stat number="200+" label="Colleges"  />
          <Stat number="12K+" label="Events"    />
          <Stat number="50K+" label="Students"  />
        </div>
      </div>

      {/* ── Right dashboard mockup (hidden on mobile via CSS) ── */}
      <div
        className="hero-visual"
        style={{ animation:"fadeUp 0.9s 0.3s ease both" }}
      >
        <DashboardMockup />
      </div>
    </div>
  </section>
);

export default HeroSection;