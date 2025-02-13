"use client";
import { useState, Suspense, lazy } from "react";
const HomeBanner = lazy(() => import("@/components/HomeBanner"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <HomeBanner />
      </Suspense>
    </>
  );
}
