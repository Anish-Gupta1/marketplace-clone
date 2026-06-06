import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const listingId = body.listingId as string;

    if (!listingId) {
      return NextResponse.json({ message: "listingId is required" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing || listing.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: listingId } });

    // revalidate dashboard and home
    try {
      revalidatePath("/dashboard");
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message || "Internal error" }, { status: 500 });
  }
}
