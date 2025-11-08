"use client";

import {
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./homePage.module.css";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function HomePage() {
  const durationPresets = useMemo(() => [15, 25, 45], []);
  const [selectedDuration, setSelectedDuration] = useState<number>(() => durationPresets[1]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => durationPresets[1] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [customDuration, setCustomDuration] = useState<string>(() => `${durationPresets[1]}`);

  const totalDurationSeconds = useMemo(() => selectedDuration * 60, [selectedDuration]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(tick);
          setIsRunning(false);
          setHasFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [isRunning]);

  useEffect(() => {
    setIsRunning(false);
    setHasFinished(false);
    setRemainingSeconds(selectedDuration * 60);
    setCustomDuration(String(selectedDuration));
  }, [selectedDuration]);

  const progress = useMemo(() => {
    if (totalDurationSeconds === 0) return 0;
    return remainingSeconds / totalDurationSeconds;
  }, [remainingSeconds, totalDurationSeconds]);

  const radialScale = useMemo(() => {
    if (hasFinished) return 0.15;
    const scaled = 0.45 + progress * 0.55;
    return Math.min(1, parseFloat(scaled.toFixed(3)));
  }, [hasFinished, progress]);

  const radialProgressStyle = useMemo(() => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const sweepDegrees =
      clampedProgress >= 0.999 ? 359.999 : clampedProgress <= 0.001 ? 0 : clampedProgress * 360;
    return {
      background: `
        radial-gradient(circle at 50% 50%, transparent 68%, rgba(12, 16, 18, 1) 69%),
        conic-gradient(
          from -90deg,
          var(--glow-cyan) 0deg,
          var(--glow-purple) ${sweepDegrees.toFixed(2)}deg,
          rgba(58, 232, 255, 0.12) ${sweepDegrees.toFixed(2)}deg,
          transparent ${sweepDegrees.toFixed(2)}deg
        )
      `,
    } as CSSProperties;
  }, [progress]);

  const timerValue = useMemo(() => formatTime(remainingSeconds), [remainingSeconds]);

  const primaryLabel = useMemo(() => {
    if (isRunning) return "Pausar";
    if (remainingSeconds === 0) return "Reiniciar foco";
    if (remainingSeconds === totalDurationSeconds) return "Iniciar foco";
    return "Retomar foco";
  }, [isRunning, remainingSeconds, totalDurationSeconds]);

  const handlePrimaryAction = useCallback(() => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalDurationSeconds);
      setHasFinished(false);
      setIsRunning(true);
      return;
    }

    if (isRunning) {
      setIsRunning(false);
      return;
    }

    setHasFinished(false);
    setIsRunning(true);
  }, [isRunning, remainingSeconds, totalDurationSeconds]);

  const handleQuickAdjust = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalDurationSeconds);
    setHasFinished(false);
  }, [totalDurationSeconds]);

  const handleDurationSelect = useCallback(
    (minutes: number) => {
      if (minutes === selectedDuration) return;
      setSelectedDuration(minutes);
    },
    [selectedDuration],
  );

  const handleCustomDurationChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length > 3) return;
    setCustomDuration(value);
  }, []);

  const handleCustomDurationSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!customDuration) return;

      const parsedMinutes = Math.max(1, Math.min(240, Number(customDuration)));
      if (!Number.isFinite(parsedMinutes)) return;

      setSelectedDuration(parsedMinutes);
    },
    [customDuration, setSelectedDuration],
  );

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

      <div className={styles.timerRegion}>
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

        <div className={styles.timerDisplay}>
          <div
            className={styles.radialWrapper}
            style={{ transform: `scale(${radialScale})` }}
            data-finished={hasFinished}
          >
            <span className={styles.radialGlow} />
            <span className={styles.radialBase} />
            <span className={styles.radialProgress} style={radialProgressStyle} />
            <span className={styles.radialTicks} />
            <span className={styles.timerValue}>{timerValue}</span>
          </div>
        </div>

        <aside className={styles.durationControls}>
          <div className={styles.durationSelector}>
            {durationPresets.map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={`${styles.durationOption} ${
                  minutes === selectedDuration ? styles.durationActive : ""
                }`}
                onClick={() => handleDurationSelect(minutes)}
              >
                {minutes}m
              </button>
            ))}
          </div>

          <form className={styles.customDuration} onSubmit={handleCustomDurationSubmit}>
            <label htmlFor="custom-duration" className={styles.srOnly}>
              Duração personalizada em minutos
            </label>
            <input
              id="custom-duration"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              placeholder="Custom"
              value={customDuration}
              onChange={handleCustomDurationChange}
            />
            <span>min</span>
            <button type="submit">Definir</button>
          </form>
        </aside>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.primaryButton} onClick={handlePrimaryAction}>
          {primaryLabel}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={handleQuickAdjust}>
          Ajustes rápidos
        </button>
      </div>
    </section>
  );
}
