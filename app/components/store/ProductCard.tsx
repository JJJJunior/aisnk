"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageType, ProductType } from "@/app/lib/types";
import Link from "next/link";
import { ExchangeAndShippingType } from "@/app/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";

interface ProductCartProps {
  product: ProductType | undefined;
  isFake?: number | null;
}

const ProductCard: React.FC<ProductCartProps> = ({ product, isFake }) => {
  const [exchangeRateAndShipping, setExchangeRateAndShipping] = useState<ExchangeAndShippingType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  //获取当前汇率
  useEffect(() => {
    const savedExchange = localStorage.getItem("selectedExchange");
    if (savedExchange) {
      try {
        setExchangeRateAndShipping(JSON.parse(savedExchange)); // 解析 JSON 字符串为对象
      } catch (error) {
        console.error("Failed to parse saved exchange", error);
        setExchangeRateAndShipping(null); // 解析失败时，设置为 null
      }
    } else {
      setExchangeRateAndShipping(null); // 如果 localStorage 中没有数据，设置为 null
    }
  }, []);
  // 产品价格规则 一共三个组件使用价格:ProductCard  ProductInfo  Cart
  let price;
  let discount;
  // 根据汇率显示价格,基础价格参考人民币
  if (product && product.price) {
    price = Math.ceil(
      product.price * (exchangeRateAndShipping?.exchangeRate ? exchangeRateAndShipping?.exchangeRate : 1)
    ).toFixed(2);
    discount = Math.ceil(
      product.price *
        (product.discount ? product.discount : 1) *
        (exchangeRateAndShipping?.exchangeRate ? exchangeRateAndShipping?.exchangeRate : 1)
    ).toFixed(2);
  }

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

  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (isFake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };
  //显示伪造数据
  const ProductShowTitle = (product: ProductType) => {
    let showTitle;
    if (isFake === 1) {
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

  // console.log(product);
  return (
    <Link href={`/web/products/${handleUrl(product as ProductType)}/${product?.id}?from=${pathname}`}>
      <div className="w-full p-2 flex flex-col justify-between">
        <div className="relative">
          {loading && <Skeleton className="h-[200px] rounded-lg bg-white" />}
          <Image
            src={ImageUrl(product?.images as [])}
            width={0}
            height={0}
            sizes="100vw" // Make the image display full width
            alt="SA"
            priority
            onLoadingComplete={() => {
              setLoading(false);
            }} // 图片加载完成后隐藏骨架屏
            className="w-full rounded-lg shadow-md h-auto transform hover:scale-100 md:hover:scale-105 hover:rotate-3 transition-transform duration-300 ease-in-out hover:shadow-xl"
          />
          {/* {product.discount && product.discount < 1 && (
            <div className="absolute top-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SALE</div>
          )} */}
          {product?.tags &&
            product.tags.split(",").length > 0 &&
            product.tags.split(",").map((tag, index) => {
              if (tag.toLowerCase() === "hot") {
                return (
                  <span className="absolute top-4 left-2 bg-red-500 text-white px-2 rounded-md text-xs" key={index}>
                    {tag}
                  </span>
                );
              }
              if (tag.toLowerCase() === "new") {
                return (
                  <span className="absolute top-4 right-2 bg-green-500 text-white px-2 rounded-md text-xs" key={index}>
                    {tag}
                  </span>
                );
              }
            })}
          <div className="text-xs mt-1 mx-2 text-gray-700 mb-2">{product && ProductShowTitle(product)}</div>
        </div>
        <div>
          <div className="mx-2 text-sm font-semibold text-gray-600 flex gap-2 items-center">
            {product?.discount && product.discount < 1 ? (
              <div className="flex gap-2">
                <span className="line-through text-gray-400">$ {price}</span>
                <span className="text-red-600">{discount}</span>
              </div>
            ) : (
              <span className="text-gray-600">$ {price}</span>
            )}
            <span className="text-gray-400 text-xs">{exchangeRateAndShipping?.currencyCode}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
