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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center text-white">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="mt-2 text-blue-100">Create your account</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>

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