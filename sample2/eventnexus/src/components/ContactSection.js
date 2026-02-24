import React, { useState } from "react";
import { Mail, User, MessageSquare, Send } from "lucide-react";

/**
 * ContactSection
 * ─────────────────────────────────────────────
 * Contact form inside a glass card with:
 *  • Controlled inputs for Name, Email, Message
 *  • Inline validation (on submit)
 *  • Success state with rocket animation
 *  • Glowing submit button
 */

/* ── Initial form state ── */
const INITIAL = { name:"", email:"", message:"" };

/* ── Validate the form, return an errors object ── */
const validate = ({ name, email, message }) => {
  const e = {};
  if (!name.trim())
    e.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "A valid email address is required.";
  if (message.trim().length < 10)
    e.message = "Message must be at least 10 characters.";
  return e;
};

/* ── Shared label style ── */
const labelStyle = {
  display:      "block",
  fontSize:     13,
  fontWeight:   600,
  color:        "#94A3B8",
  marginBottom: 8,
  letterSpacing:"0.3px",
};

/* ── Shared base input/textarea style ── */
const baseInputStyle = {
  width:        "100%",
  padding:      "14px 16px",
  borderRadius: 12,
  fontSize:     14.5,
  fontFamily:   "DM Sans",
};

const ContactSection = () => {
  const [form,   setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sent,   setSent]   = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }

    setSent(true);
    setTimeout(() => { setSent(false); setForm(INITIAL); }, 3000);
  };

  return (
    <section
      id="contact"
      style={{ padding:"100px 24px", position:"relative" }}
    >
      <div style={{ maxWidth:680, margin:"0 auto" }}>

        {/* ── Section header ── */}
        <div className="reveal" style={{ textAlign:"center", marginBottom:52 }}>
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
            <Mail size={13} color="#7C3AED" />
            <span style={{ fontSize:12, fontWeight:600, color:"#7C3AED", letterSpacing:"0.8px", textTransform:"uppercase" }}>
              Get In Touch
            </span>
          </div>

          <h2
            style={{
              fontFamily:   "Syne",
              fontWeight:   800,
              fontSize:     "clamp(28px,4vw,48px)",
              color:        "#F8FAFC",
              letterSpacing:"-1px",
              lineHeight:   1.1,
              marginBottom: 14,
            }}
          >
            Let's <span className="grad-text">connect</span>
          </h2>

          <p style={{ fontSize:16, color:"#64748B", fontWeight:300, lineHeight:1.7 }}>
            Have questions, feedback, or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* ── Glass card ── */}
        <div
          className="glass reveal"
          style={{
            borderRadius: 24,
            padding:      "clamp(24px,4vw,48px)",
            border:       "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* ── Success state ── */}
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:56, marginBottom:20 }}>🚀</div>
              <h3 style={{ fontFamily:"Syne", fontWeight:800, fontSize:24, color:"#22D3EE", marginBottom:10 }}>
                Message Sent!
              </h3>
              <p style={{ color:"#64748B" }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            /* ── Form ── */
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position:"relative" }}>
                  <User
                    size={15}
                    style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#475569" }}
                  />
                  <input
                    className="contact-input"
                    style={{ ...baseInputStyle, paddingLeft:40 }}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange("name")}
                  />
                </div>
                {errors.name && (
                  <div style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position:"relative" }}>
                  <Mail
                    size={15}
                    style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#475569" }}
                  />
                  <input
                    className="contact-input"
                    style={{ ...baseInputStyle, paddingLeft:40 }}
                    placeholder="you@college.edu"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </div>
                {errors.email && (
                  <div style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.email}</div>
                )}
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message</label>
                <div style={{ position:"relative" }}>
                  <MessageSquare
                    size={15}
                    style={{ position:"absolute", left:14, top:14, color:"#475569" }}
                  />
                  <textarea
                    className="contact-input"
                    style={{ ...baseInputStyle, paddingLeft:40, minHeight:130, resize:"vertical" }}
                    placeholder="Tell us what's on your mind..."
                    value={form.message}
                    onChange={handleChange("message")}
                  />
                </div>
                {errors.message && (
                  <div style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.message}</div>
                )}
              </div>

              {/* Submit */}
              <button
                className="btn-primary"
                onClick={handleSubmit}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            10,
                  padding:        "15px 24px",
                  borderRadius:   12,
                  color:          "#fff",
                  fontSize:       15,
                  fontWeight:     700,
                  cursor:         "pointer",
                  border:         "none",
                  fontFamily:     "Syne",
                  width:          "100%",
                  marginTop:      4,
                }}
              >
                <Send size={16} /> Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;