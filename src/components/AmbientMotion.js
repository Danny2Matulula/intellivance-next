"use client";

import { useEffect, useRef } from "react";

import styles from "./AmbientMotion.module.css";

export default function AmbientMotion() {
  const fieldRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    const progress = progressRef.current;

    if (!field || !progress) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerListening = false;
    let pointerX = window.innerWidth * 0.72;
    let pointerY = window.innerHeight * 0.28;

    const renderProgress = () => {
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const value = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);

      progress.style.transform = `scaleX(${value})`;
      scrollFrame = 0;
    };

    const scheduleProgress = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(renderProgress);
    };

    const renderPointer = () => {
      field.style.setProperty("--ambient-x", `${pointerX}px`);
      field.style.setProperty("--ambient-y", `${pointerY}px`);
      pointerFrame = 0;
    };

    const schedulePointer = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointer);
    };

    const syncPointerMode = () => {
      const shouldTrack = finePointer.matches && !reducedMotion.matches;

      if (shouldTrack && !pointerListening) {
        window.addEventListener("pointermove", schedulePointer, { passive: true });
        pointerListening = true;
      } else if (!shouldTrack && pointerListening) {
        window.removeEventListener("pointermove", schedulePointer);
        pointerListening = false;
      }

      field.dataset.pointerActive = shouldTrack ? "true" : "false";
    };

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    reducedMotion.addEventListener("change", syncPointerMode);
    finePointer.addEventListener("change", syncPointerMode);

    renderProgress();
    renderPointer();
    syncPointerMode();

    return () => {
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      reducedMotion.removeEventListener("change", syncPointerMode);
      finePointer.removeEventListener("change", syncPointerMode);

      if (pointerListening) {
        window.removeEventListener("pointermove", schedulePointer);
      }

      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    };
  }, []);

  return (
    <div className={styles.ambientMotion} aria-hidden="true">
      <div className={styles.progressTrack}>
        <span ref={progressRef} className={styles.progressBar} />
      </div>

      <div ref={fieldRef} className={styles.field}>
        <span className={styles.spotlight} />
        <span className={`${styles.orb} ${styles.orbBlue}`} />
        <span className={`${styles.orb} ${styles.orbSignal}`} />
        <span className={styles.scanner} />
      </div>
    </div>
  );
}
