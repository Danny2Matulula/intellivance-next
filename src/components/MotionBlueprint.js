"use client";

import { useRef } from "react";
import styles from "./MotionBlueprint.module.css";

const inputs = ["Business rules", "Team workflow", "Existing data"];
const stages = ["Strategy", "Design", "Engineering", "Launch"];

export default function MotionBlueprint() {
  const panelRef = useRef(null);

  function handlePointerMove(event) {
    if (event.pointerType === "touch") return;

    const panel = panelRef.current;
    if (!panel) return;

    const bounds = panel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    panel.style.setProperty("--tilt-x", `${(-y * 3.2).toFixed(2)}deg`);
    panel.style.setProperty("--tilt-y", `${(x * 4.2).toFixed(2)}deg`);
    panel.style.setProperty("--pointer-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    panel.style.setProperty("--pointer-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function resetPointer() {
    const panel = panelRef.current;
    if (!panel) return;

    panel.style.setProperty("--tilt-x", "0deg");
    panel.style.setProperty("--tilt-y", "0deg");
    panel.style.setProperty("--pointer-x", "50%");
    panel.style.setProperty("--pointer-y", "50%");
  }

  return (
    <div
      ref={panelRef}
      className={styles.blueprint}
      role="img"
      aria-label="A typical custom software build map"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className={styles.topline}>
        <span>Build map</span>
        <span className={styles.liveStatus}>
          <i aria-hidden="true" /> System active
        </span>
        <span>INT / 001</span>
      </div>

      <div className={styles.scene} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.scanline} />

        <div className={styles.canvas}>
          <div className={styles.inputs}>
            {inputs.map((input, index) => (
              <div className={styles.inputNode} key={input}>
                <span className={styles.nodeIndex}>0{index + 1}</span>
                <span>{input}</span>
                <i className={styles.nodeLight} />
              </div>
            ))}
          </div>

          <div className={styles.connections}>
            {inputs.map((input, index) => (
              <span className={styles.connection} key={input}>
                <i style={{ "--pulse-delay": `${index * 0.55}s` }} />
              </span>
            ))}
          </div>

          <div className={styles.coreWrap}>
            <span className={`${styles.orbit} ${styles.orbitOne}`} />
            <span className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={styles.core}>
              <span className={styles.coreKicker}>Purpose-built system</span>
              <strong>Custom software</strong>
              <span className={styles.coreNote}>shaped to the work</span>
              <div className={styles.coreMeter}>
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>

          <div className={styles.outputConnection}>
            <span />
            <i />
          </div>

          <div className={styles.output}>
            <span>One working system</span>
            <strong>Built to fit.</strong>
            <i className={styles.outputPing} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {stages.map((stage, index) => (
          <span key={stage}>
            <i style={{ "--stage-delay": `${index * 0.7}s` }} />
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}
