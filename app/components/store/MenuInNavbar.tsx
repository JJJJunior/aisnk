"use client";
import { ParentType, CollectionType, ImageType } from "@/app/lib/types";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSettings } from "@/app/lib/hooks/useSettings";

interface MenuInNavbarProps {
  content: ParentType | null;
  isOpen: boolean; // 从父组件传递的菜单显示状态
  onToggle: () => void; // 切换菜单的函数
}

const MenuInNavbar: React.FC<MenuInNavbarProps> = ({ content, isOpen, onToggle }) => {
  const { setting } = useSettings();
  //显示伪造数据
  const ImageUrl = (images: ImageType[]) => {
    let url;
    if (setting.value === "1") {
      url = `/api/images?file=${images[images.length - 1].url}`;
    } else {
      url = `/api/images?file=${images[0].url}`;
    }
    return url;
  };

  //显示伪造数据
  const CollectionShowTitle = (collection: CollectionType) => {
    let showTitle;
    if (setting.value === "1") {
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
    <>
      <div className="flex gap-2 justify-center items-center hover:cursor-pointer hover:text-gray-400">
        {/* 点击时触发 onToggle */}
        <h1 onMouseOver={onToggle}>{content?.name}</h1>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Menu with transition */}
      <ul
        onMouseLeave={onToggle}
        className={`w-auto mx-auto absolute z-30 bg-white shadow-lg rounded-lg flex flex-col gap-2 px-12 py-12 top-0 left-[120px] items-start md:grid md:grid-cols-6 md:gap-12 md:p-12 md:top-24 transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {content?.collections &&
          content.collections.length > 0 &&
          content.collections.map((item: CollectionType) => (
            <div key={item.id} className="flex flex-col items-center">
              <Link href={`/web/collections/${item.title?.toLowerCase()}/${item.id}`}>
                <p className="text-sm md:text-xs text-gray-400">{CollectionShowTitle(item)}</p>
                <div className="hidden md:block md:w-[120px] md:h-[80px] relative rounded-2xl transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-110">
                  <Image src={ImageUrl(item.images ? item.images : [])} fill alt="images" sizes="100vw" />
                </div>
              </Link>
            </div>
          ))}
      </ul>
    </>
  );
};

export default MenuInNavbar;
