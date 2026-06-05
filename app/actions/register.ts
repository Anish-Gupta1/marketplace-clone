"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function registerUser(
  formData: FormData
) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0].message
    );
  }

  const { name, email, password } = parsed.data;

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  redirect("/login");
}