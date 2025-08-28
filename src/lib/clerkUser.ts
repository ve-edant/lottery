import { NextResponse } from "next/server";
import {prisma} from "./prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const evtType = body.type;
    const data = body.data;

    if (evtType === "user.created") {
      await prisma.user.create({
        data: {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          username: data.username ?? null,
        },
      });
    }

    if (evtType === "user.updated") {
      await prisma.user.update({
        where: { clerkId: data.id },
        data: {
          email: data.email_addresses[0].email_address,
          username: data.username ?? null,
        },
      });
    }

    if (evtType === "user.deleted") {
      await prisma.user.delete({
        where: { clerkId: data.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
