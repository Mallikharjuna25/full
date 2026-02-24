import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Navbar — with React Router integration
 * "Calendar" navigates to /calendar (full page).
 * Other links smooth-scroll to anchors on the landing page.
 */

const NAV_LINKS = ["Home", "Events", "Calendar", "About Us", "Contact"];
const ROUTE_LINKS = { "Home": "/", "Calendar": "/calendar" };
const ANCHOR_IDS  = { "Events": "events", "About Us": "about-us", "Contact": "contact" };

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname === "/calendar" ? "Calendar" : "Home";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (label) => {
    setMenuOpen(false);
    if (ROUTE_LINKS[label]) {
      navigate(ROUTE_LINKS[label]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = ANCHOR_IDS[label];
    if (!id) return;
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const linkStyle = (label) => ({
    background: "none", border: "none",
    color:      active === label ? "#fff" : "rgba(148,163,184,0.8)",
    fontSize:   14, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans", padding: 0,
  });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background:     scrolled ? "rgba(15,23,42,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
      WebkitBackdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
      boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => handleLink("Home")}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7C3AED 0%,#3B82F6 50%,#22D3EE 100%)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(124,58,237,0.6)" }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily:"Syne", fontWeight:800, fontSize:17, color:"#fff", letterSpacing:"-0.3px" }}>
            Event<span className="grad-text">Nexus</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden-mobile" style={{ display:"flex", alignItems:"center", gap:32 }}>
          {NAV_LINKS.map((link) => (
            <button key={link} className={`nav-link ${active === link ? "active" : ""}`} style={linkStyle(link)} onClick={() => handleLink(link)}>
              {link}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden-mobile" style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button className="btn-outline" style={{ padding:"9px 18px", borderRadius:10, color:"#fff", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}>
            <span>Create Event</span>
          </button>
          <button className="btn-primary" style={{ padding:"9px 20px", borderRadius:10, color:"#fff", fontSize:13.5, fontWeight:600, cursor:"pointer", border:"none", fontFamily:"DM Sans" }}>
            Login / Sign Up
          </button>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", color:"#fff", cursor:"pointer" }} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ overflow:"hidden", maxHeight:menuOpen ? 420 : 0, transition:"max-height 0.4s ease", background:"rgba(15,23,42,0.97)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderTop: menuOpen ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <div style={{ padding:"16px 24px 28px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV_LINKS.map((link) => (
            <button key={link} onClick={() => handleLink(link)} style={{ background:"none", border:"none", color: active === link ? "#fff" : "rgba(226,232,240,0.8)", padding:"12px 8px", textAlign:"left", fontSize:15, fontWeight:500, cursor:"pointer", borderRadius:8, fontFamily:"DM Sans", transition:"color 0.2s" }}>
              {link}
            </button>
          ))}
          <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
            <button className="btn-outline" style={{ padding:"11px 18px", borderRadius:10, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans" }}><span>Create Event</span></button>
            <button className="btn-primary" style={{ padding:"11px 18px", borderRadius:10, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", border:"none", fontFamily:"DM Sans" }}>Login / Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;