import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getTrainingProductBySlug } from "@/lib/training-products";
import { provisionAllocationReach } from "@/lib/training-provision";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { allocationId?: string };
  const allocationId = body.allocationId?.trim();
  if (!allocationId) {
    return NextResponse.json({ error: "allocationId is required." }, { status: 400 });
  }

  const allocation = await prisma.courseLicenceAllocation.findUnique({
    where: { id: allocationId },
    include: { customer: true },
  });
  if (!allocation) {
    return NextResponse.json({ error: "Allocation not found." }, { status: 404 });
  }

  const product = getTrainingProductBySlug(allocation.courseSlug);
  if (!product) {
    return NextResponse.json({ error: "Unknown course." }, { status: 400 });
  }

  await provisionAllocationReach(
    allocation.id,
    allocation.customerId,
    allocation.customer.companyName,
    product,
  );

  const updated = await prisma.courseLicenceAllocation.findUnique({
    where: { id: allocationId },
  });

  return NextResponse.json({
    ok: true,
    provisioningStatus: updated?.provisioningStatus,
    provisioningError: updated?.provisioningError,
  });
}
