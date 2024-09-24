import { prisma } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.exchangeAndShipping.deleteMany({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "success!" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
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
    toUSDRate,
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
    !englishCoutryName ||
    !toUSDRate
  ) {
    return NextResponse.json({ message: "fileds are required" }, { status: 400 });
  }
  try {
    await prisma.exchangeAndShipping.update({
      where: {
        id: Number(params.id),
      },
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
        toUSDRate,
      },
    });
    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Internal errors" }, { status: 500 });
  }
};
