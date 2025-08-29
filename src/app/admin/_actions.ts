"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function deleteUser(userId: string) {
  try {
    // Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    // Delete from your DB
    await prisma.user.delete({ where: { clerkid: userId } });

    return { ok: true };
  } catch (err) {
    console.error("Failed to delete user:", err);
    return { error: "Delete failed" };
  }
}
