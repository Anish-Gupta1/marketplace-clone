"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/app/components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!name || !email || !password) {
        setError("All fields are required");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            name="name"
            placeholder="John Doe"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded font-medium transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-medium hover:underline">
          Login here
        </Link>
      </p>

      {error && (
        <Toast
          type="error"
          message={error}
          duration={5000}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  );
}