import Link from "next/link";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b p-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link href="/">Marketplace</Link>

        <div className="flex gap-4">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>

              <Link href="/add-listing">Add Listing</Link>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>

              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
