"use client";

import { Hexagon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background min-h-screen z-1000">
      <div className="flex items-center gap-2 mb-4">
        <Hexagon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">hive</h1>
      </div>
      <div className="flex items-center">
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
      </div>
    </div>
  );
}
