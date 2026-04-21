"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/tracking";

const DEPTH_MARKS = [25, 50, 75];

type EngagementTrackerProps = {
  page: string;
};

export function EngagementTracker({ page }: EngagementTrackerProps) {
  useEffect(() => {
    const recorded = new Set<number>();

    const onScroll = () => {
      const maxScrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScrollable <= 0) {
        return;
      }

      const depth = Math.round((window.scrollY / maxScrollable) * 100);

      for (const mark of DEPTH_MARKS) {
        if (depth >= mark && !recorded.has(mark)) {
          recorded.add(mark);
          trackEvent({
            event: "scroll_depth",
            details: {
              depth: mark,
            },
          });
        }
      }
    };

    trackEvent({ event: "page_view", details: { page } });

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [page]);

  return null;
}
