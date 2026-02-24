import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Footer
 * ─────────────────────────────────────────────
 * Minimal footer with:
 *  • Logo (left)
 *  • Copyright (center)
 *  • Privacy / Terms / Support links (right)
 */

const FOOTER_LINKS = ["Privacy", "Terms", "Support"];

const Footer = () => (
  <footer
    style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"40px 24px" }}
  >
    <div
      style={{
        maxWidth:       1280,
        margin:         "0 auto",
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        flexWrap:       "wrap",
        gap:            20,
      }}
    >
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div
          style={{
            width:        32,
            height:       32,
            borderRadius: 9,
            background:   "linear-gradient(135deg,#7C3AED 0%,#3B82F6 50%,#22D3EE 100%)",
            display:      "flex",
            alignItems:   "center",
            justifyContent:"center",
          }}
        >
          <Sparkles size={15} color="white" />
        </div>
        <span style={{ fontFamily:"Syne", fontWeight:800, fontSize:15, color:"#fff" }}>
          EventNexus
        </span>
      </div>

      {/* Copyright */}
      <div style={{ fontSize:13, color:"#334155", textAlign:"center" }}>
        © {new Date().getFullYear()} EventNexus. All rights reserved.
        Built with 💜 for the student community.
      </div>

      {/* Links */}
      <div style={{ display:"flex", gap:24 }}>
        {FOOTER_LINKS.map((link) => (
          <a
            key={link}
            href="/#"
            style={{ fontSize:13, color:"#475569", textDecoration:"none", transition:"color 0.2s" }}
            onMouseEnter={(e) => (e.target.style.color = "#7C3AED")}
            onMouseLeave={(e) => (e.target.style.color = "#475569")}
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;