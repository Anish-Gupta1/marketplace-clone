import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/app/components/LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Top row - Logo and actions */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600">
            Marketplace
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 transition hover:text-blue-600"
                >
                  My Listings
                </Link>
                <Link
                  href="/add-listing"
                  className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  Sell
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 transition hover:text-blue-600">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom row - Navigation links */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link href="/" className="transition hover:text-blue-600">
            Home
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/?sort=newest" className="transition hover:text-blue-600">
            New Listings
          </Link>
          <span className="text-gray-300">•</span>
          <a href="#categories" className="transition hover:text-blue-600">
            Categories
          </a>
        </div>
      </div>
    </nav>
  );
}
