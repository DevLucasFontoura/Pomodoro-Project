"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/PopOver/popover";

import styles from "./topBar.module.css";

type Phase = {
  id: string;
  label: string;
  isActive?: boolean;
};

interface TopBarProps {
  phases: Phase[];
  onSelectPhase?: (phaseId: string) => void;
  settingsContent?: ReactNode;
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
}

export function TopBar({
  phases,
  onSelectPhase,
  settingsContent,
  settingsOpen,
  onSettingsOpenChange,
}: TopBarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.phases}>
        {phases.map((phase) => {
          const className = phase.isActive
            ? `${styles.phase} ${styles.phaseActive}`
            : styles.phase;
          const handleClick = () => onSelectPhase?.(phase.id);

          if (phase.id === "settings" && settingsContent && isMounted) {
            return (
              <Popover
                key={phase.id}
                open={settingsOpen}
                onOpenChange={onSettingsOpenChange}
              >
                <PopoverTrigger asChild>
                  <button type="button" className={className} onClick={handleClick}>
                    {phase.label}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="center"
                  sideOffset={18}
                  className={styles.settingsContent}
                >
                  {settingsContent}
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <button key={phase.id} type="button" className={className} onClick={handleClick}>
              {phase.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

