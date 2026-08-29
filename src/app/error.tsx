"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-red-600" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-600 mb-8 max-w-md">
        We encountered an unexpected error. Please try refreshing the page or return to the homepage.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <Link
          href="/"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <Home size={16} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
