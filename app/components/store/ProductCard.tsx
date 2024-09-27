"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ImageType, ProductType } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { useSettings } from "@/app/lib/hooks/useSettings";
import { useExchangeAndShipping } from "@/app/lib/hooks/useExchangeRate";
import { useCustomer } from "@/app/lib/hooks/useCustomer";
import axios from "axios";
import { ExchangeAndShippingType } from "@/app/lib/types";

interface ProductCartProps {
  product: ProductType | undefined;
}

const ProductCard: React.FC<ProductCartProps> = ({ product }) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { setting } = useSettings();
  const { exchangeAndShipping } = useExchangeAndShipping();
  const { customer } = useCustomer();
  const [commission, setCommission] = useState(0);
  const [commissionLoading, setCommissionLoading] = useState(false);

  // 产品价格规则 一共三个组件使用价格:ProductCard  ProductInfo  Cart
  let price;
  let discount;
  // 根据汇率显示价格,基础价格参考人民币
  if (product && product.price) {
    price = Math.ceil(
      product.price * (exchangeAndShipping?.exchangeRate ? exchangeAndShipping?.exchangeRate : 1)
    ).toFixed(2);
    discount = Math.ceil(
      product.price *
        (product.discount ? product.discount : 1) *
        (exchangeAndShipping?.exchangeRate ? exchangeAndShipping?.exchangeRate : 1)
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
    if (setting.is_fake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };
  //显示伪造数据
  const ProductShowTitle = (product: ProductType) => {
    let showTitle;
    if (setting.is_fake === 1) {
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

  //供代理商查看佣金
  const CheckCommission = async (product: ProductType) => {
    setCommissionLoading(true);
    if (!product) return;
    try {
      const res = await axios.post(`/api/web/products/${product.id}/commission`, {
        customerId: customer.id,
      });
      if (res.status === 200) {
        setCommission(res.data.commission);
        setCommissionLoading(false);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const countCommission = (commission: number, product: ProductType, exchangeAndShipping: ExchangeAndShippingType) => {
    let result;
    if ((product.discount as number) < 1) {
      result = Math.ceil(
        commission *
          (product.discount ? product.discount : 1) *
          (exchangeAndShipping?.exchangeRate ? exchangeAndShipping?.exchangeRate : 1)
      ).toFixed(2);
    } else {
      result = Math.ceil(
        commission * (exchangeAndShipping?.exchangeRate ? exchangeAndShipping?.exchangeRate : 1)
      ).toFixed(2);
    }
    return result;
  };

  return (
    <div className="w-full p-2 flex flex-col justify-between">
      <div className="relative">
        <Link href={`/web/products/${handleUrl(product as ProductType)}/${product?.id}?from=${pathname}`}>
          {loading && <Skeleton className="h-[220px] rounded-lg bg-white" />}
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
        </Link>
        <div className="text-xs mt-1 mx-2 text-gray-700 mb-1 text-center">{product && ProductShowTitle(product)}</div>
        <div className="text-xs mt-1 mx-2 text-gray-400 mb-2 text-center">{product?.code}</div>
      </div>
      <div>
        <div className="mx-2 text-xs font-semibold text-gray-600 flex gap-2 justify-center items-center">
          {product?.discount && product.discount < 1 ? (
            <div className="flex gap-2">
              <span className="line-through text-gray-400">$ {price}</span>
              <span className="text-red-600">{discount}</span>
            </div>
          ) : (
            <span className="text-gray-600">$ {price}</span>
          )}
          <span className="text-gray-400 text-xs">{exchangeAndShipping?.currencyCode}</span>
        </div>
      </div>
      {customer &&
        customer.isRef === 1 &&
        (commission === 0 ? (
          <Button
            size="sm"
            className="bg-slate-100 shadow-none text-slate-100"
            onClick={() => CheckCommission(product as ProductType)}
            disabled={commissionLoading}
          >
            {commissionLoading ? <span className="text-black">Loading...</span> : "check"}
          </Button>
        ) : (
          <div className="text-xs text-red-500 font-semibold text-center">
            CB: {countCommission(commission, product as ProductType, exchangeAndShipping)}{" "}
            {exchangeAndShipping?.currencyCode}
          </div>
        ))}
    </div>
  );
};

export default ProductCard;
