"use client";

import VerifyWarnModal from "@/components/tutorial/VerifyWarn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VerifyWarnModal />
      {children}
    </>
  );
}
