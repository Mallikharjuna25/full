import React, { useMemo } from "react";

/**
 * Stars
 * ─────────────────────────────────────────────
 * Renders 80 tiny twinkling dots as a fixed,
 * full-screen background layer (z-index: 0).
 * Stars are memoised so they don't re-generate on re-render.
 */

const Stars = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id:    i,
        top:   `${Math.random() * 100}%`,
        left:  `${Math.random() * 100}%`,
        size:  Math.random() * 2.5 + 0.5,
        delay: Math.random() * 5,
        dur:   Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div
      style={{
        position:     "fixed",
        inset:        0,
        pointerEvents:"none",
        zIndex:       0,
        overflow:     "hidden",
      }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position:  "absolute",
            top:       s.top,
            left:      s.left,
            width:     s.size,
            height:    s.size,
            borderRadius:"50%",
            background:"white",
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            opacity:   0.3,
          }}
        />
      ))}
    </div>
  );
};

export default Stars;