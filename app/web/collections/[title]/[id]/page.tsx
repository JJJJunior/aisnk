import React from "react";
import Image from "next/image";
import InfiniteScrollClient from "@/app/components/store/InfiniteScrollClient"; // 引入客户端组件
import { ImageType } from "@/app/lib/types";
import { prisma } from "@/prisma/db";
import axios from "axios";

interface CollectionsProps {
  params: {
    title: string;
    id: number;
  };
}

//显示伪数据
const ImageUrl = async (images: ImageType[]) => {
  const res = await prisma.settings.findUnique({
    where: {
      key: "show",
    },
  });

  let url;
  if (res?.value === "1") {
    url = `/api/images?file=${images[images.length - 1].url}`;
  } else {
    url = `/api/images?file=${images[0].url}`;
  }
  return url;
};

const Collections: React.FC<CollectionsProps> = async ({ params }) => {
  const getCollectionById = async (title: string, id: number, skip: number, take: number) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await axios.get(`${baseURL}/api/web/collections/${title}/${id}?skip=${skip}&take=${take}`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log("getCollectionById_GET", err);
    }
  };

  const collection = await getCollectionById(params.title, Number(params.id), 0, 12); // 加载前12个产品

  if (!collection) {
    return <div className="flex justify-center items-center font-semibold text-gray-400">Collection not found</div>;
  }

  return (
    <div className="w-full mx-auto px-2 md:px-12 flex flex-col items-center gap-4">
      <div className="flex flex-col justify-between items-center">
        <Image
          src={await ImageUrl(collection.images)}
          width={100}
          height={50}
          className="border rounded-lg shadow-md mt-6"
          alt="collection"
        />
      </div>

      {/* 引入客户端的 Infinite Scroll 组件 */}
      <InfiniteScrollClient iniCollectionProducts={collection.products} />
    </div>
  );
};

export default Collections;
