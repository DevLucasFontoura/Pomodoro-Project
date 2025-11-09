"use client";

import { useId, useMemo } from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import styles from "./clock.module.css";

interface ClockProps {
  value: string;
  progress: number;
  finished?: boolean;
}

function RadialProgress({ progress }: { progress: number }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const sweep = clampedProgress * 360;
  const endAngle = clampedProgress <= 0 ? 89.999 : 90 - sweep;
  const gradientBaseId = useId().replace(/:/g, "");
  const gradientId = `clock-progress-${gradientBaseId}`;

  const chartData = useMemo(() => [{ name: "arc", value: 100 }], []);
  const arcOpacity = 0.25 + clampedProgress * 0.75;

  return (
    <div className={styles.radialProgress}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={endAngle}
          innerRadius="78%"
          outerRadius="88%"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--glow-cyan)" stopOpacity={arcOpacity} />
              <stop offset="100%" stopColor="var(--glow-purple)" stopOpacity={arcOpacity} />
            </linearGradient>
          </defs>
          {clampedProgress > 0 ? (
            <RadialBar
              dataKey="value"
              cornerRadius={999}
              fill={`url(#${gradientId})`}
              fillOpacity={arcOpacity}
              isAnimationActive={false}
            />
          ) : null}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Clock({ value, progress, finished = false }: ClockProps) {
  return (
    <div className={styles.clock}>
      <div className={styles.radialWrapper} data-finished={finished}>
        <span className={styles.radialGlow} />
        <span className={styles.radialBase} />
        <RadialProgress progress={progress} />
        <span className={styles.radialTicks} />
        <span className={styles.timerValue}>{value}</span>
      </div>
    </div>
  );
}

