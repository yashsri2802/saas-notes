import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password)
    return new NextResponse("Invalid Body", { status: 400 });
  const user = await prisma.user.findFirst({
    where: { email },
    include: { tenant: true },
  });
  if (!user) return new NextResponse("Invalid Credentials", { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return new NextResponse("Invalid Credentials", { status: 401 });

  const token = signToken({
    sub: user.id,
    tenantId: user.tenantId,
    tenantSlug: user.tenant.slug,
    role: user.role,
    email: user.email,
  });
  return NextResponse.json({ token });
}
