"use client";
import React, { useEffect } from "react";
import useCart from "@/app/lib/hooks/useCart";
import Link from "next/link";

const page = () => {
  const cart = useCart();
  useEffect(() => {
    cart.clearCart();
  }, []);
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-12">
      <p className="text-4xl font-semibold text-red-400">Successful Payment</p>
      <p className="text-xl">Thank your for you puchase ❤️</p>
      <Link href="/" className="p-4 bg-black rounded-lg text-white">
        CONTINUE TO SHOPPING
      </Link>
    </div>
  );
};

export default page;
