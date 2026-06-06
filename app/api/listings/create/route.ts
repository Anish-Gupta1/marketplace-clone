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

    const {
      title,
      description,
      price,
      country,
      state,
      city,
      area,
      imageUrl,
      categoryId,
      subCategoryId,
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { message: "Title must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { message: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!price || typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { message: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (!country || !state || !city || !area) {
      return NextResponse.json(
        { message: "All location fields are required" },
        { status: 400 }
      );
    }

    if (!categoryId || !subCategoryId) {
      return NextResponse.json(
        { message: "Category and subcategory are required" },
        { status: 400 }
      );
    }

    // Verify category and subcategory exist
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!subCategory || subCategory.categoryId !== categoryId) {
      return NextResponse.json(
        { message: "Invalid subcategory" },
        { status: 404 }
      );
    }

    // Create listing
    await prisma.listing.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price,
        country: country.trim().toLowerCase(),
        state: state.trim().toLowerCase(),
        city: city.trim().toLowerCase(),
        area: area.trim().toLowerCase(),
        imageUrl: imageUrl || null,
        categoryId,
        subCategoryId,
        userId: session.user.id,
      },
    });

    // Revalidate relevant paths
    try {
      revalidatePath("/dashboard");
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Create listing error:", e);
    return NextResponse.json(
      { message: e?.message || "Failed to create listing" },
      { status: 500 }
    );
  }
}
