"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Image as AntImage } from "antd";
import { ImageType } from "@/app/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/app/lib/hooks/useSettings";

interface GalleryProps {
  images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [testImages, setTestImages] = useState<ImageType[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const { setting } = useSettings();

  useEffect(() => {
    if (images) {
      setLoading(false);
    }
  }, [images]);

  useEffect(() => {
    if (setting.is_fake === 1) {
      setTestImages(images.slice(9, images?.length));
      setMainImage(images[images.length - 1].url);
    } else {
      setTestImages(images.slice(0, 9));
      setMainImage(images[0].url);
    }
  }, [setting.is_fake]);

  return (
    <div className="flex flex-col gap-3 lg:flex-1 h-auto">
      {loading ? (
        <Skeleton className="h-[500px] w-full rounded-xl" />
      ) : (
        <div className="md:w-[500px]">
          <AntImage src={`/api/images?file=${mainImage}`} placeholder={true} />
        </div>
      )}
      {loading ? (
        <Skeleton className="h-[120px] w-full rounded-xl" />
      ) : (
        <div className="flex gap-2 md:w-[500px] overflow-auto scrollbar scrollbar-thumb-blue-600 scrollbar-track-gray-100">
          {testImages.length > 0 &&
            testImages.map((item, index) => (
              <Image
                key={index}
                src={`/api/images?file=${item.url}`}
                alt="product"
                width={100}
                height={100}
                className={`w-20 h-20 object-cover cursor-pointer ${
                  mainImage === item.url ? "border-2 border-black" : ""
                }`}
                onClick={() => setMainImage(item.url)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
