"use client";

import type { ChangeEvent, FormEvent } from "react";

import styles from "./durationControls.module.css";

interface DurationControlsProps {
  presets: number[];
  selectedDuration: number;
  customDuration: string;
  onSelectDuration: (minutes: number) => void;
  onCustomDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCustomDurationSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function DurationControls({
  presets,
  selectedDuration,
  customDuration,
  onSelectDuration,
  onCustomDurationChange,
  onCustomDurationSubmit,
}: DurationControlsProps) {
  return (
    <aside className={styles.durationControls}>
      <div className={styles.durationSelector}>
        {presets.map((minutes) => {
          const isActive = minutes === selectedDuration;
          const className = isActive
            ? `${styles.durationOption} ${styles.durationActive}`
            : styles.durationOption;

          return (
            <button
              key={minutes}
              type="button"
              className={className}
              onClick={() => onSelectDuration(minutes)}
            >
              {minutes}m
            </button>
          );
        })}
      </div>

      <form className={styles.customDuration} onSubmit={onCustomDurationSubmit}>
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
          onChange={onCustomDurationChange}
        />
        <span>min</span>
        <button type="submit">Definir</button>
      </form>
    </aside>
  );
}

