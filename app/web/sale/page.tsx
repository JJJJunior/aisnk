import React from "react";
import { prisma } from "@/prisma/db";
import ProductCard from "@/app/components/store/ProductCard";

const SalePage = async () => {
  const products = await prisma.product.findMany({
    where: {
      discount: {
        lt: 1,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      status: true,
      discount: true,
      tags: true,
      category: true,
      size_image: true,
      sizes: true,
      colors: true,
      created_at: true,
      updated_at: true,
      images: {
        orderBy: {
          order_index: "asc",
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const res = await prisma.settings.findUnique({
    where: {
      key: "websettings",
    },
  });
  if (res?.is_fake) return;

  return (
    <div className="mx-2 md:mx-12 flex flex-col items-center mt-6">
      <div className="flex flex-col justify-between items-center text-2xl font-semibold text-gray-600 mb-6">SALE</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default SalePage;
