"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import styles from "./clock.module.css";

interface ClockProps {
  value: string;
  progress: number;
  finished?: boolean;
}

function RadialProgress({ progress }: { progress: number }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const gradientBaseId = useId().replace(/:/g, "");
  const gradientId = `clock-progress-${gradientBaseId}`;

  const chartData = useMemo(() => [{ name: "arc", value: 100 }], []);
  const [animatedProgress, setAnimatedProgress] = useState(clampedProgress);
  const animationRef = useRef<number | null>(null);
  const animatedValueRef = useRef(clampedProgress);

  useEffect(() => {
    const startValue = animatedValueRef.current;
    const target = clampedProgress;
    if (Math.abs(target - startValue) < 0.0005) {
      setAnimatedProgress(target);
      animatedValueRef.current = target;
      return;
    }

    const duration = 520;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const startTime = performance.now();

    const step = (time: number) => {
      const elapsed = time - startTime;
      const ratio = Math.min(1, elapsed / duration);
      const eased = easeOut(ratio);
      const value = startValue + (target - startValue) * eased;
      setAnimatedProgress(value);
      animatedValueRef.current = value;
      if (ratio < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setAnimatedProgress(target);
        animatedValueRef.current = target;
      }
    };

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [clampedProgress]);

  const sweep = animatedProgress * 360;
  const endAngle = animatedProgress <= 0 ? 89.999 : 90 - sweep;
  const arcOpacity = 0.25 + animatedProgress * 0.75;

  return (
    <div
      className={styles.radialProgress}
      style={{ transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms" }}
    >
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
          {animatedProgress > 0 ? (
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

