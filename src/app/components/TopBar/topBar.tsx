"use client";

import styles from "./topBar.module.css";

type Phase = {
  id: string;
  label: string;
  isActive?: boolean;
};

interface TopBarProps {
  phases: Phase[];
  onSelectPhase?: (phaseId: string) => void;
}

export function TopBar({ phases, onSelectPhase }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.phases}>
        {phases.map((phase) => {
          const className = phase.isActive
            ? `${styles.phase} ${styles.phaseActive}`
            : styles.phase;

          return (
            <button
              key={phase.id}
              type="button"
              className={className}
              onClick={() => onSelectPhase?.(phase.id)}
            >
              {phase.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

