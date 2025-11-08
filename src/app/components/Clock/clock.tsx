"use client";

import type { CSSProperties } from "react";

import styles from "./clock.module.css";

interface ClockProps {
  value: string;
  scale: number;
  radialProgressStyle: CSSProperties;
  finished?: boolean;
}

export function Clock({ value, scale, radialProgressStyle, finished = false }: ClockProps) {
  return (
    <div className={styles.clock}>
      <div
        className={styles.radialWrapper}
        style={{ transform: `scale(${scale})` }}
        data-finished={finished}
      >
        <span className={styles.radialGlow} />
        <span className={styles.radialBase} />
        <span className={styles.radialProgress} style={radialProgressStyle} />
        <span className={styles.radialTicks} />
        <span className={styles.timerValue}>{value}</span>
      </div>
    </div>
  );
}

