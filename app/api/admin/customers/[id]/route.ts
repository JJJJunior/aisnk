import { NextRequest } from "next/server";
import { prisma } from "@/prisma/db";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return new Response("id is required", { status: 400 });
  }
  const customer = await req.json();
  if (!customer) {
    return new Response("customer is required", { status: 400 });
  }
  try {
    const res = await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: {
        ...customer,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error updating customer", { status: 500 });
  }
  return new Response("Customer updated", { status: 200 });
};
