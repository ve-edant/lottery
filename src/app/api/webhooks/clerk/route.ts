import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Verified Clerk event:", evt);

  const { type, data } = evt;

  // -------------------
  // User Created Event
  // -------------------
  if (type === "user.created") {
    try {
      console.log("📌 Creating user in DB:", {
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address,
        username: data.username,
      });

      await prisma.user.create({
        data: {
          clerkid: data.id,
          email: data.email_addresses?.[0]?.email_address || "example@gmail.com",
          username: data.first_name || "Anonymous",

          // Create wallet automatically
          wallet: {
            create: {
              balance: 0,
            },
          },

          // Create initial transaction
          transactions: {
            create: {
              type: "DEPOSIT",
              amount: 0,
              balanceafter: 0,
            },
          },
        },
      });

      console.log("🎉 User, wallet, and initial transaction inserted successfully");
    } catch (err) {
      console.error("❌ Prisma insert failed:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // -------------------
  // User Deleted Event
  // -------------------
  if (type === "user.deleted") {
    try {
      console.log("🗑️ Deleting user from DB:", data.id);

      // Delete the user, wallet and transactions are cascaded if you set Prisma cascade
      await prisma.user.delete({
        where: { clerkid: data.id },
      });

      console.log("✅ User deleted from DB successfully");
    } catch (err) {
      console.error("❌ Prisma delete failed:", err);
      return NextResponse.json({ error: "DB delete error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
