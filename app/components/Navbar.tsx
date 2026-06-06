import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/app/components/LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-7xl">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          Marketplace
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="transition hover:text-black">
                Dashboard
              </Link>
              <Link href="/add-listing" className="transition hover:text-black">
                Add Listing
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-black">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-black">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
