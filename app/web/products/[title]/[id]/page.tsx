import React from "react";
import Promise from "@/app/components/store/Promise";
import Gallery from "@/app/components/store/Gallery";
import ProductInfo from "@/app/components/store/ProductInfo";
import { prisma } from "@/prisma/db";
import Link from "next/link";
import { Undo2Icon } from "lucide-react";

interface ProductDetailsProps {
  params: {
    id: number;
  };
  searchParams: {
    [key: string]: string | undefined; // 对应查询参数的键值对
  };
}
const ProductDetails: React.FC<ProductDetailsProps> = async ({ params, searchParams }) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(params.id),
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
      code: true,
      category: true,
      size_image: true,
      alias_description: true,
      alias_title: true,
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
  });

  // console.log(product);
  // console.log(searchParams.from);
  return (
    <div className="w-full mx-auto flex flex-col">
      <Promise />
      <div className="px-2 md:px-12">
        <Link
          href={searchParams.from !== undefined ? searchParams.from : "/web"}
          className="rounded-lg md:ml-24 text-xl px-2 my-6 text-gray-700 flex gap-2 w-[120px] items-center underline hover:text-gray-400"
        >
          <p>Back to</p>
          <Undo2Icon size={20} />
        </Link>
        <div className="flex flex-col md:flex-row justify-around gap-6 items-center">
          <Gallery images={product?.images ? product?.images : []} />
          <ProductInfo productInfo={product ? product : undefined} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
