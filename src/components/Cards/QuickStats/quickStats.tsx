"use client";

import styles from "./quickStats.module.css";

type Stat = {
  label: string;
  value: string;
};

interface QuickStatsProps {
  stats: Stat[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className={styles.quickStats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={styles.statValue}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

