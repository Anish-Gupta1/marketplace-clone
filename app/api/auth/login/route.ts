import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).catch((e) => {
      console.error("SignIn error:", e);
      return null;
    });

    if (!result || result?.error) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: e?.message || "Login failed" },
      { status: 500 }
    );
  }
}
