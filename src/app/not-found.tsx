import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">🪔</div>
      <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist. It may have been moved or the URL may be incorrect.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <Home size={16} />
          Back to Home
        </Link>
        <Link
          href="/programs"
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <Search size={16} />
          View Pujo Schedule
        </Link>
      </div>
    </div>
  );
}
