import Image from "next/image";
import React from "react";
import { prisma } from "@/prisma/db";

const Carousel = () => {
  return (
    <div className="relative overflow-hidden w-screen h-[250px]">
      <div className="flex animate-marquee">
        {/* {images.map((src, index) => (
          <div key={index} className="flex-none w-[200px] h-[200px] opacity-0 animate-fadeInOut">
            <Image src={src} alt={`Image ${index + 1}`} width={200} height={200} />
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Carousel;
