// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallet: true, // include wallet for balance
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Fetch user from Prisma
    const prismaUser = await prisma.user.findUnique({
      where: { clerkid: userId },
    });

    if (!prismaUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Delete from Prisma
    await prisma.user.delete({ where: { clerkid: userId } });

    // Delete from Clerk via REST API
    const clerkRes = await fetch(
      `https://api.clerk.com/v1/users/${prismaUser.clerkid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!clerkRes.ok) {
      console.error("❌ Clerk delete failed:", await clerkRes.text());
      return NextResponse.json(
        { error: "Failed to delete user from Clerk" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

