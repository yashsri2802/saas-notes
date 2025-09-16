import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromHeader } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });
  const note = await prisma.note.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
    select: { id: true, title: true, content: true, createdAt: true },
  });
  if (!note) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });
  const { title, content } = await req.json();
  const exists = await prisma.note.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
  });
  if (!exists) return new NextResponse("Not found", { status: 404 });
  const updated = await prisma.note.update({
    where: { id: params.id },
    data: { title, content },
    select: { id: true, title: true, content: true, createdAt: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });
  const exists = await prisma.note.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
  });
  if (!exists) return new NextResponse("Not found", { status: 404 });
  await prisma.note.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
