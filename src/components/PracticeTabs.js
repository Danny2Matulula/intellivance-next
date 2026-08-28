"use client";

import { useState } from "react";

const practices = [
  {
    id: "growth",
    index: "01",
    label: "Revenue & Growth",
    headline: "Build the commercial system around the sale.",
    intro: "For businesses with real opportunity but uneven positioning, pipeline truth, ownership, or follow-through.",
    problems: ["Unclear go-to-market motion", "Pipeline activity without decision quality", "Offers and pricing that are difficult to buy", "Account growth without a repeatable system"],
    work: ["Commercial diagnosis and market focus", "Offer, pricing, and proposal architecture", "CRM, pipeline, and operating cadence", "Deal strategy and buyer-ready execution", "Account expansion and retention systems"],
    outputs: "GTM plan / offer system / pipeline architecture / decision-ready proposals / commercial scorecard",
  },
  {
    id: "operations",
    index: "02",
    label: "Operations & Transformation",
    headline: "Turn fragmented work into one accountable way of operating.",
    intro: "For leaders navigating growth, transitions, delivery risk, or a business that can no longer be managed through memory and heroics.",
    problems: ["Ownership gaps and invisible commitments", "Client or delivery risk during change", "Processes held together by spreadsheets", "Leaders operating from different versions of truth"],
    work: ["Current-state operating diagnosis", "Ownership, decision, and escalation design", "Process and service-delivery redesign", "Management views, scorecards, and controls", "Implementation, adoption, and handoff"],
    outputs: "Operating map / accountability model / transition plan / management scorecard / repeatable playbook",
  },
  {
    id: "technology",
    index: "03",
    label: "AI & Technology",
    headline: "Use technology where it changes the economics of the work.",
    intro: "For businesses with repetitive decisions, disconnected systems, manual handoffs, or an opportunity to operate with far more leverage.",
    problems: ["Critical work split across disconnected tools", "Manual follow-up and exception handling", "Data that exists but cannot drive decisions", "Automation experiments without operating ownership"],
    work: ["Workflow and technology architecture", "CRM, data, and system integration", "AI agents and decision support", "Internal tools and targeted software", "Testing, controls, enablement, and production readback"],
    outputs: "Technology roadmap / connected workflow / automation layer / internal operating tool / enablement plan",
  },
];

export default function PracticeTabs() {
  const [active, setActive] = useState(practices[0].id);
  const practice = practices.find((item) => item.id === active);

  function onKeyDown(event, index) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + practices.length) % practices.length;
    setActive(practices[next].id);
    document.getElementById(`tab-${practices[next].id}`)?.focus();
  }

  return (
    <div className="practice-tabs-shell">
      <div className="practice-tabs" role="tablist" aria-label="Intellivance practices">
        {practices.map((item, index) => (
          <button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={active === item.id} aria-controls={`panel-${item.id}`} tabIndex={active === item.id ? 0 : -1} onClick={() => setActive(item.id)} onKeyDown={(event) => onKeyDown(event, index)}>
            <span>{item.index}</span>{item.label}
          </button>
        ))}
      </div>
      <section className="practice-panel" id={`panel-${practice.id}`} role="tabpanel" aria-labelledby={`tab-${practice.id}`}>
        <div className="practice-panel-heading"><span>{practice.label}</span><h2>{practice.headline}</h2><p>{practice.intro}</p></div>
        <div className="practice-columns">
          <div><span className="micro-label">When it fits</span><ul>{practice.problems.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><span className="micro-label">What we can own</span><ul>{practice.work.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="practice-output"><span>Typical outputs</span><p>{practice.outputs}</p></div>
      </section>
    </div>
  );
}
