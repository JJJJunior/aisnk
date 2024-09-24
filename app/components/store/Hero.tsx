import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/prisma/db";
import { ImageType } from "@/app/lib/types";
import { randomInt } from "crypto";
export async function Hero() {
  const productDetail = await prisma.product.findMany({
    where: {
      is_recommended: 1,
    },
    include: {
      images: {
        orderBy: {
          order_index: "asc",
        },
      },
    },
  });

  const res = await prisma.settings.findUnique({
    where: {
      key: "websettings",
    },
  });

  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (res?.is_fake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };

  //在推荐的产品中随机显示在首页推荐位
  const showProductIndex = randomInt(0, productDetail.length);
  return (
    <div
      className="h-[280px] md:h-[420px] mx-2 md:mx-12 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-[length:100%_200%] bg-[from-10%,via-30%,to-90%] rounded-2xl
     relative"
    >
      <div className="absolute bottom-3 right-8 lg:bottom-12 lg:right-[180px] w-[160px] h-[160px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] dark:bg-gray-800">
        <Image
          src={ImageUrl(productDetail[showProductIndex].images)}
          alt={productDetail[showProductIndex]?.title ? productDetail[showProductIndex]?.title : "Product"}
          fill
          className="rounded-full bg-white shadow-lg"
        />
      </div>
      {res?.is_fake !== 1 && (
        <div className="absolute w-[400px] top-16 left-6 lg:left-[100px] lg:top-[120px] text-white md:text-3xl font-semibold">
          <span className="text-orange-400">{productDetail[0]?.title.split(" ").slice(0, 1).join(" ") + " "}</span>
          {productDetail[showProductIndex]?.title.split(" ").slice(1).join(" ")}
        </div>
      )}
      <Link
        className="absolute bottom-12 left-6 lg:bottom-[100px] lg:left-[100px] bg-white text-blue-600 font-semibold px-2 py-2 md:px-4 md:py-4 shadow-sm rounded-lg hover:bg-blue-100"
        href={`/web/products/${productDetail[showProductIndex]?.title.toLowerCase().split(" ").slice(0, 3).join("-")}/${
          productDetail[showProductIndex]?.id
        }`}
      >
        View Product Details
      </Link>
    </div>
  );
}
