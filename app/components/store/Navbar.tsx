"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserProfile from "@/app/components/store/UserProfile";
import { SelectArea } from "./SelectArea";
import MenuInNavbar from "./MenuInNavbar";
import { ParentType } from "@/app/lib/types";
import axios from "axios";
import { usePathname } from "next/navigation";

interface NavbarProps {
  sneakers: ParentType | null;
  accessoires: ParentType | null;
}

export const Navbar: React.FC<NavbarProps> = ({ sneakers, accessoires }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // 用于追踪哪个菜单是打开的
  const [open, setOpen] = useState(false);
  const [isFake, setIsFake] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== currentUrl) {
      setActiveMenu(null); // 关闭所有菜单
      setOpen(false); // 关闭hamburger menu
    }
  }, [pathname]);

  const getWebSettings = async () => {
    const res = await axios.get("/api/web/settings/websettings");
    if (res.status === 200) {
      setIsFake(res.data.data.is_fake);
    }
  };

  useEffect(() => {
    getWebSettings();
    setCurrentUrl(pathname);
  }, []);

  // 切换菜单状态，互斥效果
  const toggleMenu = (menuName: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-4 h-20 lg:mx-16 lg:h-28 flex justify-between items-center lg:relative">
        {/* Logo */}
        <div className="text-xl hidden md:block left-20 md:text-xl lg:text-3xl font-semibold">
          <Link href="/web">{process.env.NEXT_PUBLIC_SITE_NAME}</Link>
        </div>

        {/* Hamburger menu icon (visible on small screens) */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>

        {/* Full Navbar (visible on medium and large screens) */}
        <nav className="hidden list-none gap-8 lg:text-md xl:text-xl xl:gap-12 text-base font-semibold text-gray-600 md:flex md:gap-6 md:text-sm">
          {/* 增加互斥功能 */}
          <MenuInNavbar
            isFake={isFake}
            content={sneakers}
            isOpen={activeMenu === "sneakers"} // 控制菜单显示
            onToggle={() => toggleMenu("sneakers")} // 切换菜单状态
          />
          <MenuInNavbar
            isFake={isFake}
            content={accessoires}
            isOpen={activeMenu === "accessoires"} // 控制菜单显示
            onToggle={() => toggleMenu("accessoires")} // 切换菜单状态
          />
          <li className="text-red-500 transition duration-300 ease-in-out transform hover:text-red-200 hover:underline">
            <Link href="/web/sale">SALE</Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
            <Link href="/web/collections/all">All Products</Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:text-gray-400 md:hidden lg:block">
            <Link href="/web/service/contact-us">24H Service</Link>
          </li>
        </nav>

        {/* Dropdown Navbar for mobile (visible when open) */}
        {open && (
          <nav className="absolute top-28 left-0 z-20 right-0 bg-gray-100 p-4 flex flex-col items-start list-none gap-12 text-lg font-semibold text-gray-600 md:hidden">
            <li className="transition duration-300 ease-in-out transform hover:text-red-200 hover:underline">
              <Link href="/web">Home</Link>
            </li>
            <MenuInNavbar
              content={sneakers}
              isFake={isFake}
              isOpen={activeMenu === "sneakers"}
              onToggle={() => toggleMenu("sneakers")}
            />
            <MenuInNavbar
              content={accessoires}
              isFake={isFake}
              isOpen={activeMenu === "accessoires"}
              onToggle={() => toggleMenu("accessoires")}
            />
            <li className="text-red-500 transition duration-300 ease-in-out transform hover:text-red-200 hover:underline">
              <Link href="/web/sale">SALE</Link>
            </li>
            <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
              <Link href="/web/collections/all">All Products</Link>
            </li>
            <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
              <Link href="/web/service/contact-us">24H Service</Link>
            </li>
          </nav>
        )}

        {/* Area Selector and Profile (always visible) */}
        <div className="flex gap-4 items-center">
          <SelectArea />
          <UserProfile />
        </div>
      </div>
    </div>
  );
};
