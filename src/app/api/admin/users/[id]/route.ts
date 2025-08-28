import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = id;
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { clerkid: userId } });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.delete({ where: { clerkid: userId } });


  return NextResponse.json({ ok: true });
}
