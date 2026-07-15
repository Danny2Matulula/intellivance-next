import styles from "./VerificationRail.module.css";

const CHECKS = [
  {
    number: "01",
    title: "Responsive",
    description: "We check the core flows across desktop and smaller screens.",
  },
  {
    number: "02",
    title: "Accessible",
    description: "We test keyboard paths, focus states, structure, and contrast.",
  },
  {
    number: "03",
    title: "Integration-tested",
    description: "We test the handoffs between the product and the systems it depends on.",
  },
  {
    number: "04",
    title: "Failure-state tested",
    description: "We check bad inputs, missing data, and unavailable services.",
  },
  {
    number: "05",
    title: "Production readback",
    description: "We verify the live release after deployment, not just the local build.",
  },
];

export default function VerificationRail() {
  return (
    <section className={styles.section} aria-labelledby="verification-title">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>How we verify</span>
          <span className={styles.readout} aria-hidden="true">
            QA / 05 checkpoints
          </span>
        </div>

        <h2 id="verification-title">
          A launch isn&apos;t done when the screen looks right.
        </h2>

        <p>
          We check the parts people use, the connections behind them, and the
          release that reaches production.
        </p>
      </div>

      <ol className={styles.rail}>
        {CHECKS.map((check) => (
          <li className={styles.check} key={check.number}>
            <div className={styles.marker} aria-hidden="true">
              <span>{check.number}</span>
              <i />
            </div>
            <h3>{check.title}</h3>
            <p>{check.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
