import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });

  const tenant = await prisma.tenant.findUnique({
    where: { id: auth.tenantId },
  });

  const notes = await prisma.note.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, createdAt: true },
  });
  return NextResponse.json({ notes, plan: tenant?.plan ?? "FREE" });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });

  const { title, content } = await req.json();
  if (!title) return new NextResponse("Title required", { status: 400 });

  const tenant = await prisma.tenant.findUnique({
    where: { id: auth.tenantId },
  });
  if (!tenant) return new NextResponse("Tenant not found", { status: 404 });

  if (tenant.plan === "FREE") {
    const count = await prisma.note.count({
      where: { tenantId: auth.tenantId },
    });
    if (count >= 3) {
      return NextResponse.json(
        {
          error: "Free plan limit reached. Upgrade to Pro for unlimited notes.",
        },
        { status: 403 }
      );
    }
  }

  const note = await prisma.note.create({
    data: {
      title,
      content: content ?? "",
      tenantId: auth.tenantId,
      authorId: auth.sub,
    },
    select: { id: true, title: true, content: true, createdAt: true },
  });
  return NextResponse.json(note, { status: 201 });
}
