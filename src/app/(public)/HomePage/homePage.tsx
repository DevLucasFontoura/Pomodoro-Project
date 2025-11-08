import Link from "next/link";
import styles from "./homePage.module.css";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Seu novo Pomodoro começa aqui</h1>
        <p className={styles.subtitle}>
          Organize seus ciclos de foco e pausas com uma interface simples,
          rápida e feita sob medida para a sua rotina.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Começar agora
          </Link>
          <Link href="/sobre" className={styles.secondaryButton}>
            Saiba mais
          </Link>
        </div>
      </div>
    </section>
  );
}
