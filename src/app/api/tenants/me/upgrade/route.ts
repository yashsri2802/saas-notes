import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get("authorization"));
  if (!auth) return new NextResponse("Unauthorized", { status: 401 });
  if (auth.role !== "ADMIN")
    return new NextResponse("Forbidden", { status: 403 });
  const tenant = await prisma.tenant.update({
    where: { id: auth.tenantId },
    data: { plan: "PRO" },
  });
  return NextResponse.json({ plan: tenant.plan });
}
