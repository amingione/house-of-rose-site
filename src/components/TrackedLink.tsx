"use client";

import { ReactNode } from "react";

import { trackEvent } from "@/lib/tracking";

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  eventName: string;
  eventDetails?: Record<string, string | number | boolean>;
  target?: "_blank" | "_self";
  rel?: string;
};

export function TrackedLink({
  href,
  className,
  children,
  eventName,
  eventDetails,
  target,
  rel,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => trackEvent({ event: eventName, details: eventDetails })}
    >
      {children}
    </a>
  );
}
