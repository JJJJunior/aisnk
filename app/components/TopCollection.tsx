import React from "react";
import CarouselRow from "./CarouselRow";
import { prisma } from "@/prisma/db";
import Image from "next/image";
import Link from "next/link";
import { SettingsType } from "../lib/types";

interface HotProductsInRowProps {
  websetting: SettingsType;
}
const TopCollection: React.FC<HotProductsInRowProps> = async ({ websetting }) => {
  const isFake = websetting?.value;
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      images: {
        take: isFake === "1" ? -1 : 1,
      },
      products: true,
    },
  });
  return (
    <div className="w-full mx-auto px-6 md:px-12 mt-12">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-600 mb-6">Top Collection</div>
      </div>
      <div className="hidden lg:block">
        <CarouselRow collections={collections} />
      </div>
      <div className="grid grid-cols-4 gap-6 lg:hidden">
        {collections.slice(0, 8).map((collection) => (
          <Link key={collection.id} href={`/web/collections/top-collection/${collection.id}`}>
            <Image
              src={`/api/images?file=${collection.images[0].url}`}
              alt="pic"
              width={80}
              height={80}
              className="rounded-full shadow-lg w-[150px] md:w-[180px]"
            ></Image>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCollection;
