// app/components/SentryInit.tsx
"use client";

import * as Sentry from "@sentry/react";
import { useEffect } from "react";

export default function SentryInit() {
  useEffect(() => {
    Sentry.init({
      dsn: "https://c46e6a3cb107cbabe8f81b520dc3c0d6@o4509631847792640.ingest.us.sentry.io/4509632495550464",
      // Setting this option to true will send default PII data to Sentry.
      // For example, automatic IP address collection on events
      sendDefaultPii: true,
      debug: true,
    });
  }, []);

  return null;
}
