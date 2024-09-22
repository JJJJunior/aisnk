import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const {
    code,
    courtyName,
    currencyCode,
    exchangeRate,
    shippingCodeInStripe,
    englishCoutryName,
    shippingCodeDesInStripe,
    paymentTypeInStripe,
    allowedCountries,
  } = await req.json();
  if (
    !code ||
    !courtyName ||
    !currencyCode ||
    !exchangeRate ||
    !shippingCodeInStripe ||
    !shippingCodeDesInStripe ||
    !paymentTypeInStripe ||
    !allowedCountries ||
    !englishCoutryName
  ) {
    return NextResponse.json({ message: "fileds are required" }, { status: 400 });
  }
  try {
    await prisma.exchangeAndShipping.create({
      data: {
        code,
        courtyName,
        currencyCode,
        exchangeRate,
        shippingCodeInStripe,
        shippingCodeDesInStripe,
        paymentTypeInStripe,
        allowedCountries,
        englishCoutryName,
      },
    });
    return NextResponse.json({ message: "Created successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal errors" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const exchangesAndShipping = await prisma.exchangeAndShipping.findMany();
    return NextResponse.json({ data: exchangesAndShipping }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Internal errors" }, { status: 500 });
  }
};
