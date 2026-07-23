import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Compass className="mb-4 h-14 w-14 text-neon-purple" />
      <h1 className="font-display text-3xl font-bold">Lost in an unmapped world</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        We couldn't find that page. Maybe it got isekai'd somewhere else.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-6 py-3 text-sm font-semibold shadow-glow"
      >
        Back to Home
      </Link>
    </div>
  );
}
