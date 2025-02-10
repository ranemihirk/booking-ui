"use client";
import { useState, Suspense, lazy } from "react";
const HomeMain = lazy(() => import("@/components/HomeMain"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <HomeMain />
      </Suspense>
    </>
  );
}
