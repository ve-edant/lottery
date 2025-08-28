"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { checkRole } from "@/utils/roles";

export async function setRole(formData: FormData) {
  if (!checkRole("ADMIN")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.updateUserMetadata(
      formData.get("id") as string,
      { publicMetadata: { role: formData.get("role") } }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  try {
    const res = await clerkClient.users.updateUserMetadata(
      formData.get("id") as string,
      { publicMetadata: { role: null } }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

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
