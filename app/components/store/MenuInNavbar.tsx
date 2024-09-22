"use client";
import { ParentType, CollectionType, ImageType } from "@/app/lib/types";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import Collections from "@/app/admin/collections/page";

interface MenuInNavbarProps {
  content: ParentType;
  isFake: number;
}

const MenuInNavbar: React.FC<MenuInNavbarProps> = ({ content, isFake }) => {
  const [showMenu, setShowMenu] = useState(false);
  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (isFake === 1) {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };
  //显示伪造数据
  const CollectionShowTitle = (collection: CollectionType) => {
    let showTitle;
    if (isFake === 1) {
      if (collection.alias_title && collection.alias_title.length > 0) {
        showTitle = collection.alias_title;
      } else {
        showTitle =
          collection.title &&
          collection.title
            .split(" ")
            .slice(collection.title.split(" ").length - 3, collection.title.split(" ").length)
            .join(" ");
      }
    } else {
      showTitle = collection.title;
    }
    return showTitle;
  };

  return (
    <div className="relative">
      <div className="flex gap-2 justify-center items-center hover:cursor-pointer hover:text-gray-400">
        <h1 onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
          {content?.name}
        </h1>
        {showMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Menu with transition */}
      <ul
        className={`absolute p-4 left-9 md:top-6 md:left-0 shadow-lg rounded-lg h-auto w-[330px] md:w-[800px] z-30 bg-white grid grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-300 ease-in-out transform ${
          showMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        {content?.collections &&
          content.collections.length > 0 &&
          content.collections.map((item: CollectionType) => (
            <div
              key={item.id}
              className="flex flex-col items-center transition duration-300 ease-in-out transform hover:shadow-lg rounded-lg"
            >
              <Link href={`/web/collections/${item.title?.toLowerCase()}/${item.id}`}>
                <p className="text-xs text-gray-400">{CollectionShowTitle(item)}</p>
                <Image
                  src={item.images && ImageUrl(item.images)}
                  className="hidden md:block md:rounded-md"
                  width={100}
                  height={50}
                  alt="images"
                />
              </Link>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default MenuInNavbar;
