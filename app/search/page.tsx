"use client";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "../components/LoadingSpinner";

// Dynamic import the SearchContent component with SSR disabled
const SearchContent = dynamic(() => import("./SearchContent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  ),
});

export default function SearchPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render content on the client side
  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
