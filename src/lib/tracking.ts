export type TrackingPayload = {
  event: string;
  details?: Record<string, string | number | boolean>;
};

export function trackEvent(payload: TrackingPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const eventData = {
    event: payload.event,
    timestamp: new Date().toISOString(),
    ...payload.details,
  };

  const globalWindow = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  if (!globalWindow.dataLayer) {
    globalWindow.dataLayer = [];
  }

  globalWindow.dataLayer.push(eventData);
  window.dispatchEvent(new CustomEvent("house-of-rose:event", { detail: eventData }));
}
