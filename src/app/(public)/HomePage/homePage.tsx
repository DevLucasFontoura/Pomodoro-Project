import styles from "./homePage.module.css";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <span className={styles.cornerBrand}>
        pomodoro<span>mono</span>
      </span>
      <div className={styles.topBar}>
        <div className={styles.phases}>
          <button type="button" className={`${styles.phase} ${styles.phaseActive}`}>
            Focus
          </button>
          <button type="button" className={styles.phase}>
            Short break
          </button>
          <button type="button" className={styles.phase}>
            Long break
          </button>
        </div>
      </div>
      <span className={styles.cornerVersion}>v1.0</span>

      <div className={styles.timerDisplay}>
        <div className={styles.timerRing}>
          <span className={styles.timerValue}>25:00</span>
          <span className={styles.timerGlow} />
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.primaryButton}>
          Iniciar foco
        </button>
        <button type="button" className={styles.secondaryButton}>
          Ajustes rápidos
        </button>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Sessões hoje</span>
          <span className={styles.statValue}>3</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total focado</span>
          <span className={styles.statValue}>1h 15m</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Próxima pausa longa</span>
          <span className={styles.statValue}>2 ciclos</span>
        </div>
      </div>
    </section>
  );
}
