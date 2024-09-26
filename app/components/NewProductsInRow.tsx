import React from "react";
import { prisma } from "@/prisma/db";
import { ImageType, ProductType } from "../lib/types";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SettingsType } from "../lib/types";

interface NewProductsInRowProps {
  websetting: SettingsType | null;
}
const NewProductsInRow: React.FC<NewProductsInRowProps> = async ({ websetting }) => {
  const newProducts = await prisma.product.findMany({
    where: {
      tags: "new",
      status: "上架",
    },
    select: {
      images: {
        orderBy: {
          order_index: "asc",
        },
      },
      title: true,
      alias_title: true,
      price: true,
      discount: true,
      id: true,
      tags: true,
      category: true,
    },
    orderBy: { created_at: "desc" },
    take: 6,
  });
  //   console.log(newProducts);
  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (websetting?.is_fake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };
  //显示伪造数据
  const ProductShowTitle = (product: ProductType) => {
    let showTitle;
    if (websetting?.is_fake === 1) {
      if (product.alias_title && product.alias_title.length > 0) {
        showTitle = product.alias_title;
      } else {
        showTitle =
          product.title &&
          product.title
            .split(" ")
            .slice(product.title.split(" ").length - 3, product.title.split(" ").length)
            .join(" ");
      }
    } else {
      showTitle = product.title;
    }
    return showTitle;
  };

  const handleUrl = (product: ProductType) => {
    // 替换所有非字母、数字或空格的字符为空格
    const formattedTitle = (product?.title || "").toLowerCase().replace(/[^a-zA-Z0-9\s]/g, " ");
    const spaceCount = (formattedTitle.match(/\s+/g) || []).length;
    let result;
    if (spaceCount === 0) {
      result = formattedTitle;
    } else {
      result = formattedTitle.split(" ").join("-");
    }
    return result;
  };

  return (
    <div className="w-full mx-auto px-6 md:px-12 mt-12">
      <div className="flex justify-between items-center mb-2">
        <div className="md:text-2xl font-semibold text-gray-600">New Releases</div>
        <Link
          href="/web/collections/all"
          className="font-semibold flex gap-2 justify-center items-center hover:text-gray-400 hover:text-xl"
        >
          <div className="underline text-gray-600">See More</div>
          <ChevronRight size={20} />
        </Link>
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {newProducts &&
          newProducts.length > 0 &&
          newProducts.map((product) => (
            <div key={product.id} className="relative shadow-md rounded-lg mb-2 hover:shadow-lg bg-white">
              <Link href={`/web/products/${handleUrl(product as ProductType)}/${product?.id}`}>
                <div className="absolute bg-green-600 px-2 text-xs text-white rounded-md ml-2 mt-2">{product.tags}</div>
                <div className="flex justify-center items-center">
                  <Image src={ImageUrl(product.images)} alt={String(product.id)} width={300} height={400} />
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="text-xs text-gray-400 text-center px-2">
                    {ProductShowTitle(product as ProductType)}
                  </div>
                  <div className="text-xs md:text-sm px-2 text-center md:font-semibold text-gray-600 mb-6">
                    {product.category}
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NewProductsInRow;
