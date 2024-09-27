"use client"; // 标记为客户端组件
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "@/app/components/store/ProductCard";
import { usePathname } from "next/navigation";
import { ProductCollectionType, ProductType } from "@/app/lib/types";
import Loader from "../Loader";

interface InfiniteScrollClientProps {
  iniCollectionProducts: ProductCollectionType[];
}

const InfiniteScrollClient: React.FC<InfiniteScrollClientProps> = ({ iniCollectionProducts }) => {
  const [collectionProducts, setCollectionProducts] = useState(iniCollectionProducts); // 初始化产品列表
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [skip, setSkip] = useState(Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT && "12")); // 跳过已经加载的产品数量
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); //

  useEffect(() => {
    if (iniCollectionProducts) {
      setLoading(false); // 初始数据加载完成，关闭 loading 状态
    }
  }, [iniCollectionProducts]);

  useEffect(() => {
    if (iniCollectionProducts.length < Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT && "12")) {
      setHasMore(false); // 如果初始数据量小于12，则不再加载
    }
  }, [iniCollectionProducts.length]);

  // 从服务器加载更多数据
  const fetchMoreProducts = async () => {
    const res = await fetch(
      `/api${pathname}?skip=${skip}&take=${Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT && "12")}`
    );
    const newCollectionProducts = await res.json();

    if (newCollectionProducts.products.length === 0) {
      setHasMore(false); // 没有更多数据时停止加载
    } else {
      setCollectionProducts((prevCollectionProducts) => [...prevCollectionProducts, ...newCollectionProducts.products]); // 添加新加载的数据
      setSkip(skip + Number(process.env.NEXT_PUBLIC_PAGE_SHOW_PRODUCTS_COUNT && "12")); // 更新 skip 值
    }
  };

  return (
    <InfiniteScroll
      dataLength={collectionProducts.length} // 当前已加载的数据长度
      next={fetchMoreProducts} // 加载更多数据的函数
      hasMore={hasMore} // 是否还有更多数据
      loader={<Loader />} // 加载中时显示的组件
      endMessage={<p className="my-20 text-center">"There's no more content here. 😉"</p>} // 数据加载完毕时显示的组件
    >
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`}>
        {collectionProducts.map((item, index) => (
          <ProductCard product={item.product && item.product} key={index} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default InfiniteScrollClient;
