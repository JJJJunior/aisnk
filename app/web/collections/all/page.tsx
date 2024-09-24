"use client"; // 标记为客户端组件
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProductType } from "@/app/lib/types";
import Loader from "@/app/components/Loader";
import ProductCard from "@/app/components/store/ProductCard";
import axios from "axios";

const ShowAllProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFake, setIsFake] = useState(0);

  const getWebSettings = async () => {
    const res = await axios.get("/api/web/settings/websettings");
    if (res.status === 200) {
      setIsFake(res.data.data.is_fake);
      setLoading(false);
    }
  };

  const getAllProducts = async (skip: number, take: number) => {
    try {
      const res = await axios.get(`/api/web/products?skip=${skip}&take=${take}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const initialProducts = await getAllProducts(0, Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT) || 12);
      if (initialProducts.length > 0) {
        setProducts(initialProducts);
        setSkip(Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT) || 12); // 更新 skip 值
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMoreProducts = async () => {
    try {
      const newProducts = await getAllProducts(skip, Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT) || 12);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setSkip((prevSkip) => prevSkip + Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT || 12)); // 更新 skip 值
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    getWebSettings();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="mx-2 md:mx-12 flex flex-col items-center mt-6">
      <div className="flex flex-col justify-between items-center text-2xl font-semibold text-gray-600 mb-6">
        All Products
      </div>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchMoreProducts}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={
          <p className="my-6 flex justify-center items-center text-sm font-semibold text-gray-400">
            There's no more content here. Maybe it's time to turn back and take another look 😉
          </p>
        }
      >
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {products.map((product, index) => (
              <ProductCard product={product} key={index} isFake={isFake} />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ShowAllProductsPage;
