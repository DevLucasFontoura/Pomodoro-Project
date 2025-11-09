"use client";

import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { DurationControls } from "@/components/Cards/DurationControls/durationControls";
import { QuickStats } from "@/components/Cards/QuickStats/quickStats";
import { Clock } from "@/components/Clock/clock";
import { TopBar } from "@/components/TopBar/topBar";

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
  const quickStats = useMemo(
    () => [
      { label: "Sessões hoje", value: "3" },
      { label: "Total focado", value: "1h 15m" },
      { label: "Próxima pausa longa", value: "2 ciclos" },
    ],
    [],
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(() => durationPresets[1]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => durationPresets[1] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [customDuration, setCustomDuration] = useState<string>(() => `${durationPresets[1]}`);
  const [activePhase, setActivePhase] = useState("focus");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const phases = useMemo(
    () => [
      { id: "focus", label: "Focus", isActive: activePhase === "focus" },
      { id: "short-break", label: "Short break", isActive: activePhase === "short-break" },
      { id: "long-break", label: "Long break", isActive: activePhase === "long-break" },
      { id: "settings", label: "Settings", isActive: isSettingsOpen },
    ],
    [activePhase, isSettingsOpen],
  );

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

  const handleDurationSelect = useCallback(
    (minutes: number) => {
      if (minutes !== selectedDuration) {
        setSelectedDuration(minutes);
      }
      setIsSettingsOpen(false);
    },
    [selectedDuration, setIsSettingsOpen, setSelectedDuration],
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
      setIsSettingsOpen(false);
    },
    [customDuration, setSelectedDuration, setIsSettingsOpen],
  );

  const handleResumeFocus = useCallback(() => {
    if (isRunning) return;
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalDurationSeconds);
    }
    setHasFinished(false);
    setIsRunning(true);
  }, [isRunning, remainingSeconds, totalDurationSeconds]);

  const handleResetFocus = useCallback(() => {
    setIsRunning(false);
    setHasFinished(false);
    setRemainingSeconds(totalDurationSeconds);
  }, [totalDurationSeconds]);

  const hasStarted = remainingSeconds !== totalDurationSeconds;
  const canResume = hasStarted && !isRunning && remainingSeconds > 0;
  const canReset = hasStarted || isRunning || hasFinished;
  const handleSelectPhase = useCallback(
    (phaseId: string) => {
      if (phaseId === "settings") {
        setIsSettingsOpen((prev) => !prev);
        return;
      }
      setActivePhase(phaseId);
      setIsSettingsOpen(false);
    },
    [setActivePhase, setIsSettingsOpen],
  );

  return (
    <section className={styles.hero}>
      <span className={styles.cornerBrand}>
        pomodoro<span>mono</span>
      </span>
      <TopBar phases={phases} onSelectPhase={handleSelectPhase} />
      <span className={styles.cornerVersion}>v1.0</span>

      {isSettingsOpen ? (
        <div className={styles.settingsPopover}>
          <div className={styles.settingsCard}>
            <DurationControls
              presets={durationPresets}
              selectedDuration={selectedDuration}
              customDuration={customDuration}
              onSelectDuration={handleDurationSelect}
              onCustomDurationChange={handleCustomDurationChange}
              onCustomDurationSubmit={handleCustomDurationSubmit}
            />
          </div>
        </div>
      ) : null}

      <div className={styles.timerRegion}>
        <div className={styles.timerStats}>
          <QuickStats stats={quickStats} />
        </div>
        <div className={styles.timerClock}>
          <Clock value={timerValue} progress={progress} finished={hasFinished} />
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.primaryButton} onClick={handlePrimaryAction}>
          {primaryLabel}
        </button>
        {hasStarted ? (
          <>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleResumeFocus}
              disabled={!canResume}
            >
              Retomar foco
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleResetFocus}
              disabled={!canReset}
            >
              Reiniciar foco
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
