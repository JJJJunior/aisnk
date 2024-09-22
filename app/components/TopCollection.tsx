import React from "react";
import CarouselRow from "./CarouselRow";
import { prisma } from "@/prisma/db";

const TopCollection = async () => {
  const res = await prisma.settings.findUnique({
    where: {
      key: "websettings",
    },
  });
  const isFake = res?.is_fake;
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      images: {
        take: isFake === 1 ? -1 : 1,
      },
      products: true,
    },
  });
  return (
    <div className="mx-12 mt-12">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-600 mb-6">Top Collection</div>
      </div>
      <CarouselRow collections={collections} />
    </div>
  );
};

export default TopCollection;
