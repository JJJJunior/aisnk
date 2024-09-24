"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CollectionType } from "../lib/types";
import Image from "next/image";
import Link from "next/link";

interface CarouselRowProps {
  collections: CollectionType[];
}

const CarouselRow: React.FC<CarouselRowProps> = ({ collections }) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <Carousel responsive={responsive} autoPlay autoPlaySpeed={3000} rewind rewindWithAnimation>
      {collections &&
        collections.length > 0 &&
        collections.map((item, index) => (
          <Link key={index} href={`/web/collections/top-collection/${item.id}`} className="relative hover:shadow-lg">
            <Image
              width={180}
              height={100}
              src={`/api/images?file=${item.images && item.images[0].url}`}
              alt={String(index)}
              className="rounded-lg shadow-lg"
            ></Image>
            <div className="absolute text-xs px-2 bg-yellow-400 text-white top-0 rounded-full flex gap-2 items-center">
              <div>{item.products?.length}+</div>
            </div>
          </Link>
        ))}
    </Carousel>
  );
};

export default CarouselRow;
