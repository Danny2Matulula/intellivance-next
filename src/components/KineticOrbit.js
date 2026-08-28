"use client";

import { useEffect, useState } from "react";

const motions = [
  { id: "revenue", number: "01", label: "Revenue", detail: "Turn market opportunity into a commercial motion." },
  { id: "operations", number: "02", label: "Operations", detail: "Create ownership, rhythm, and management visibility." },
  { id: "technology", number: "03", label: "Technology", detail: "Apply systems where they create operating leverage." },
  { id: "execution", number: "04", label: "Execution", detail: "Carry the decision into working behavior." },
];

export default function KineticOrbit() {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (userPaused || hovered || reduced) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % motions.length), 3200);
    return () => window.clearInterval(timer);
  }, [hovered, userPaused]);

  return (
    <section className="kinetic-orbit" aria-label="Operating motion" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="orbit-topline"><span>Operating field / live</span><button type="button" onClick={() => setUserPaused((value) => !value)} aria-pressed={userPaused}>{userPaused ? "Play" : "Pause"}</button></div>
      <div className="orbit-stage">
        <div className="orbit-radar" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="orbit-core" aria-live="polite"><span>In motion</span><strong>{motions[active].label}</strong></div>
        <div className="orbit-cards">
          {motions.map((motion, index) => (
            <button type="button" key={motion.id} className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-pressed={index === active}>
              <span>{motion.number}</span><strong>{motion.label}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="orbit-readout"><span>{motions[active].number} / 04</span><p>{motions[active].detail}</p></div>
    </section>
  );
}
