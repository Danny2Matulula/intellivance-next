import styles from "./SystemFlowMap.module.css";

const sourceSystems = ["CRM", "Finance", "Delivery", "Meetings", "Reporting"];

export default function SystemFlowMap() {
  return (
    <figure
      className={styles.map}
      aria-labelledby="system-flow-title"
      aria-describedby="system-flow-description"
    >
      <figcaption className={styles.caption}>
        <span className={styles.eyebrow}>Example architecture</span>
        <div className={styles.captionCopy}>
          <h3 id="system-flow-title">Connected systems. One operating view.</h3>
          <p id="system-flow-description">
            A generic example of separate business systems feeding a shared operations
            layer, then turning activity into clearer decisions.
          </p>
        </div>
        <span className={styles.mapId}>FLOW / 001</span>
      </figcaption>

      <p className={styles.accessibleFlow}>
        CRM, Finance, Delivery, Meetings, and Reporting feed into an Operations Core.
        The Operations Core produces clear decisions.
      </p>

      <div className={styles.topology} aria-hidden="true">
        <div className={styles.sources}>
          <span className={styles.columnLabel}>Existing systems</span>
          <div className={styles.sourceList}>
            {sourceSystems.map((system, index) => (
              <div className={styles.source} key={system}>
                <span className={styles.sourceIndex}>0{index + 1}</span>
                <strong>{system}</strong>
                <i />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inbound}>
          {sourceSystems.map((system) => (
            <span className={styles.track} key={system}>
              <i />
            </span>
          ))}
        </div>

        <div className={styles.coreArea}>
          <span className={styles.columnLabel}>Shared layer</span>
          <div className={styles.coreWrap}>
            <span className={`${styles.orbit} ${styles.orbitOne}`} />
            <span className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={styles.core}>
              <span>Coordinate</span>
              <strong>Operations<br />Core</strong>
              <div className={styles.coreActivity}>
                <i />
                <i />
                <i />
                <i />
              </div>
              <small>Connected context</small>
            </div>
          </div>
        </div>

        <div className={styles.outbound}>
          <span className={styles.track}>
            <i />
          </span>
          <span className={styles.direction}>Flows to</span>
        </div>

        <div className={styles.resultArea}>
          <span className={styles.columnLabel}>Useful output</span>
          <div className={styles.result}>
            <span className={styles.resultSignal}><i /> Ready</span>
            <strong>Clear<br />decisions.</strong>
            <span>One operating view</span>
          </div>
        </div>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span><i className={styles.legendSource} /> Source system</span>
        <span><i className={styles.legendPulse} /> Information flow</span>
        <span><i className={styles.legendCore} /> Shared context</span>
      </div>
    </figure>
  );
}
