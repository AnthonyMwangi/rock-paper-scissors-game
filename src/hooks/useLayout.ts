import { useCallback, useRef } from "react";

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type UseLayoutCallback = (e: { layout: Layout }) => void;

export function useLayout(onLayoutCallback: UseLayoutCallback) {
  const observerRef = useRef<ResizeObserver>(null);

  // Callback ref manages the element lifestyle cleanly
  return useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current?.disconnect();
      }

      if (node) {
        observerRef.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height, left, top } =
              entry.target.getBoundingClientRect();
            // Mimic the React Native layout event payload structure
            onLayoutCallback({
              layout: { x: left, y: top, width, height },
            });
          }
        });
        observerRef.current.observe(node);
      }
    },
    [onLayoutCallback],
  );
}
