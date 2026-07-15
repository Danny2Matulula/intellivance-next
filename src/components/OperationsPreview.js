import styles from "./OperationsPreview.module.css";

const systems = [
  { name: "CRM", status: "Connected", tone: "blue" },
  { name: "Finance", status: "Refreshed", tone: "acid" },
  { name: "Delivery", status: "Visible", tone: "orange" },
  { name: "Meetings", status: "Organized", tone: "paper" },
];

const workstreams = [
  { name: "Client onboarding", state: "Ready for review" },
  { name: "Delivery planning", state: "In progress" },
  { name: "Weekly reporting", state: "Synced" },
];

function ConnectionMap() {
  return (
    <div className={styles.map} aria-label="Connected business systems">
      <div className={styles.mapLines} aria-hidden="true">
        <span className={`${styles.line} ${styles.lineTop}`} />
        <span className={`${styles.line} ${styles.lineRight}`} />
        <span className={`${styles.line} ${styles.lineBottom}`} />
        <span className={`${styles.line} ${styles.lineLeft}`} />
      </div>

      <div className={styles.core}>
        <span className={styles.corePulse} aria-hidden="true" />
        <span className={styles.coreLabel}>Operations</span>
        <strong>One shared view</strong>
      </div>

      {systems.map((system, index) => (
        <div
          className={`${styles.systemNode} ${styles[`node${index + 1}`]} ${styles[system.tone]}`}
          key={system.name}
        >
          <span className={styles.nodeIndicator} aria-hidden="true" />
          <span>{system.name}</span>
          <strong>{system.status}</strong>
        </div>
      ))}
    </div>
  );
}

export default function OperationsPreview() {
  return (
    <section className={styles.section} aria-labelledby="operations-preview-title">
      <div className={styles.intro}>
        <div className={styles.kickers}>
          <span>Example system</span>
          <span className={styles.synthetic}>Synthetic interface</span>
        </div>
        <h2 id="operations-preview-title">
          Turn scattered business systems into one operating view.
        </h2>
        <p>
          A custom operations platform can bring customer context, delivery
          work, financial signals, and meeting decisions into a shared system
          built around how the team works.
        </p>
      </div>

      <div className={styles.frame}>
        <header className={styles.frameHeader}>
          <div className={styles.windowControls} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.frameTitle}>
            <span>Connected operations</span>
            <strong>Workspace overview</strong>
          </div>
          <div className={styles.liveStatus}>
            <span aria-hidden="true" />
            Example status
          </div>
        </header>

        <div className={styles.workspace}>
          <aside className={styles.rail} aria-label="Example workspace sections">
            <span className={styles.railLabel}>Workspace</span>
            <span className={styles.railActive}>Overview</span>
            <span>Customers</span>
            <span>Delivery</span>
            <span>Planning</span>
          </aside>

          <div className={styles.canvas}>
            <div className={styles.canvasHeading}>
              <div>
                <span>System map</span>
                <strong>Connected context</strong>
              </div>
              <span className={styles.refresh}>Structure view</span>
            </div>
            <ConnectionMap />
          </div>

          <aside className={styles.activity} aria-label="Example workstream status">
            <div className={styles.activityHeading}>
              <span>Workstreams</span>
              <strong>Now visible</strong>
            </div>
            <div className={styles.workstreamList}>
              {workstreams.map((workstream) => (
                <div className={styles.workstream} key={workstream.name}>
                  <span className={styles.workstreamMark} aria-hidden="true" />
                  <div>
                    <strong>{workstream.name}</strong>
                    <span>{workstream.state}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.note}>
              <span>Latest context</span>
              <p>Decisions stay attached to the work they affect.</p>
            </div>
          </aside>
        </div>

        <footer className={styles.frameFooter}>
          <span>Generic product concept / No live data</span>
          <span>Designed to show system thinking — not client data</span>
        </footer>
      </div>
    </section>
  );
}
