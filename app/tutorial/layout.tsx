"use client";

import {
  VerifyWarnModal,
  IsQQBrowserWarnModal,
} from "@/components/tutorial/TutorialWarn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IsQQBrowserWarnModal />
      <VerifyWarnModal />

      {children}
    </>
  );
}
