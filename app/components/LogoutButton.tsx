"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
