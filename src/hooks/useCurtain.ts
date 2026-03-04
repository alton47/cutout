"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useCurtain(initialPct = 50) {
  const [pct, setPct] = useState(initialPct);
  const dragging = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const getRelativeX = useCallback((clientX: number): number => {
    if (!stageRef.current) return 50;
    const rect = stageRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(5, Math.min(95, (x / rect.width) * 100));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  const onTouchStart = useCallback(() => {
    dragging.current = true;
  }, []);

  // Stage click — jump to click position
  const onStageClick = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) {
        setPct(getRelativeX(e.clientX));
      }
    },
    [getRelativeX],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPct(getRelativeX(e.clientX));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      setPct(getRelativeX(e.touches[0].clientX));
    };
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [getRelativeX]);

  return {
    pct,
    setPct,
    stageRef,
    onMouseDown,
    onTouchStart,
    onStageClick,
  };
}
