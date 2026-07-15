"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./MotionProcess.module.css";

const EMPTY_PROCESS = [];

export default function MotionProcess({ process = EMPTY_PROCESS }) {
  const [activeStep, setActiveStep] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (process.length < 2 || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const focusedEntry = entries.find((entry) => entry.isIntersecting);
        if (!focusedEntry) return;

        const focusedIndex = Number(focusedEntry.target.dataset.stepIndex);
        setActiveStep((current) => (current === focusedIndex ? current : focusedIndex));
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0.01,
      },
    );

    const items = itemRefs.current.slice(0, process.length);
    items.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [process.length]);

  if (process.length === 0) return null;

  const progress = ((activeStep + 1) / process.length) * 100;

  return (
    <div className={styles.sequence}>
      <div className={styles.rail} aria-hidden="true">
        <span
          className={styles.railProgress}
          style={{ "--process-progress": `${progress}%` }}
        />
      </div>

      <ol className={styles.list}>
        {process.map((step, index) => {
          const isActive = index === activeStep;
          const isComplete = index < activeStep;

          return (
            <li
              key={step.number}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className={styles.step}
              data-active={isActive ? "true" : "false"}
              data-complete={isComplete ? "true" : "false"}
              data-step-index={index}
              aria-current={isActive ? "step" : undefined}
            >
              <div className={styles.marker} aria-hidden="true">
                <span>{step.number}</span>
              </div>

              <div className={styles.copy}>
                <span className={styles.stage}>Stage {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>

              <span className={styles.output}>
                <span aria-hidden="true">→</span>
                {step.output}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
