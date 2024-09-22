"use client";
import React, { useState, useEffect } from "react";
import { ProductType } from "@/app/lib/types";
import useCart from "@/app/lib/hooks/useCart";
import { ExchangeAndShipping } from "@prisma/client";
import axios from "axios";
import Loader from "../Loader";

interface ProductInfoProps {
  productInfo: ProductType | undefined;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ productInfo }) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    productInfo?.colors ? productInfo.colors.split(",")[0] : ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(productInfo?.sizes ? productInfo.sizes.split(",")[0] : "");
  const [quantity, setQuantity] = useState<number>(1);
  const cart = useCart();
  const [current, setCurrent] = useState<ExchangeAndShipping | null>(null);
  const [isFake, setIsFake] = useState(0);
  const [loading, setLoading] = useState(true);

  const getWebSettings = async () => {
    try {
      const res = await axios.get("/api/web/settings/websettings");
      setIsFake(res.data.data.is_fake);
      setLoading(false);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    const savedExchange = localStorage.getItem("selectedExchange");
    if (savedExchange) {
      try {
        setCurrent(JSON.parse(savedExchange)); // 解析 JSON 字符串为对象
      } catch (error) {
        console.error("Failed to parse saved exchange", error);
        setCurrent(null); // 解析失败时，设置为 null
      }
    } else {
      setCurrent(null); // 如果 localStorage 中没有数据，设置为 null
    }
    getWebSettings();
  }, []);

  // 产品价格规则
  let price;
  let discount;
  // 根据汇率显示价格,基础价格参考人民币
  if (productInfo && productInfo.price) {
    price = Math.ceil(productInfo.price * (current?.exchangeRate ? current?.exchangeRate : 1)).toFixed(2);
    discount = Math.ceil(
      productInfo.price *
        (productInfo.discount ? productInfo.discount : 1) *
        (current?.exchangeRate ? current?.exchangeRate : 1)
    ).toFixed(2);
  }

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

  //显示伪造数据
  const ProductShowDisc = (product: ProductType) => {
    let showDisc;
    if (isFake === 1) {
      if (product.alias_description && product.alias_description.length > 0) {
        showDisc = product.alias_description;
      } else {
        showDisc =
          product.description &&
          product.description
            .split(" ")
            .slice(product.description.split(" ").length - 3, product.description.split(" ").length)
            .join(" ");
      }
    } else {
      showDisc = product.description;
    }
    return showDisc;
  };
  // console.log(productInfo);
  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-4 lg:flex-1">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">{productInfo && ProductShowTitle(productInfo)}</p>
      </div>
      <div className="flex gap-2 items-center">
        <p className="text-gray-600 font-semibold">Category：</p>
        <p className="text-sm text-gray-600">{productInfo?.category}</p>
      </div>
      <div className="text-xl font-semibold text-gray-800">
        {productInfo && price && productInfo.discount !== 1 ? (
          <div className="flex gap-2">
            <span className="line-through text-gray-400">$ {price}</span>
            <span className="text-red-600">{discount}</span>
          </div>
        ) : (
          <span>$ {discount}</span>
        )}
        <span className="mx-2">{current?.currencyCode}</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-600 font-semibold">Description:</p>
        <p className="text-sm text-gray-600">{productInfo && ProductShowDisc(productInfo)}</p>
      </div>
      {productInfo?.colors
        ? productInfo.colors.split(",").length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-gray-600 font-semibold">Colors:</div>
              <div className="flex gap-2 flex-wrap">
                {productInfo.colors.split(",").map((color, index) => (
                  <div
                    onClick={() => setSelectedColor(color)}
                    key={index}
                    className={`border border-gray-300 rounded-lg w-[100px] h-[40px] flex justify-center items-center cursor-pointer ${
                      selectedColor === color && "bg-blue-600 text-white"
                    }`}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )
        : null}
      {productInfo?.sizes
        ? productInfo.sizes.split(",").length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-gray-600 font-semibold">Sizes:</p>
              <div className="flex gap-2 flex-wrap">
                {productInfo.sizes.split(",").map((size, index) => (
                  <p
                    onClick={() => setSelectedSize(size)}
                    key={index}
                    className={`border border-gray-300 rounded-lg w-[80px] h-[40px] flex justify-center items-center cursor-pointer ${
                      selectedSize === size && "bg-blue-600 text-white"
                    }`}
                  >
                    {size}
                  </p>
                ))}
              </div>
            </div>
          )
        : null}
      <div className="flex gap-12 justify-between items-center">
        {/* <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Quantity:</p>
          <div className="flex gap-4 items-center">
            <MinusCircle
              className="hover:text-red-1 cursor-pointer"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            />
            <p className="hover:text-red-1 cursor-pointer">{quantity}</p>
            <PlusCircle className="hover:text-red-1 cursor-pointer" onClick={() => setQuantity(quantity + 1)} />
          </div>
        </div> */}
        <button
          onClick={() => {
            cart.addItem({
              item: productInfo as ProductType,
              quantity: quantity,
              color: selectedColor,
              size: selectedSize,
            });
          }}
          className="bg-blue-600 text-white py-3 w-full rounded-lg hover:bg-blue-400"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
