import React from "react";
import { prisma } from "@/prisma/db";
import ProductCard from "@/app/components/store/ProductCard";

const SearchPage = async ({ searchParams }: { searchParams: { q: string } }) => {
  const search_key = searchParams.q || ""; // 从 URL 中获取查询参数 q
  if (search_key === "") {
    return (
      <div className="w-full mx-auto px-2 md:px-12 flex flex-col items-center mt-6">
        <div className="flex flex-col justify-between items-center text-2xl font-semibold text-gray-600 mb-6">
          Please input the keyworks...
        </div>
      </div>
    );
  }
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: search_key } },
        { description: { contains: search_key } },
        { code: { contains: search_key } },
        { colors: { contains: search_key } },
      ],
      status: "上架",
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
      code: true,
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
    orderBy: { created_at: "desc" },
    // take: 12, // 一次返回 12 件商品
    // skip: 0, // 初始从第 0 件开始返回
  });

  // console.log(products);

  return (
    <div className="w-full mx-auto px-2 md:px-12 flex flex-col items-center mt-6">
      <div className="flex flex-col justify-between items-center text-2xl font-semibold text-gray-600 mb-6">
        Search Results for "{search_key}"
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.length > 0 && products?.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </div>
  );
};

export default SearchPage;
