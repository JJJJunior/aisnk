"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserProfile from "@/app/components/store/UserProfile";
import { SelectArea } from "./SelectArea";
import MenuInNavbar from "./MenuInNavbar";
import { ParentType } from "@/app/lib/types";
import axios from "axios";
import { usePathname } from "next/navigation";
import useCart from "@/app/lib/hooks/useCart";
import { Cart } from "./Cart";

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
  const { cartItems } = useCart();

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
    <div className="bg-white w-full">
      <div className="mx-auto h-20 px-6 md:px-12 lg:h-28 flex justify-between items-center lg:relative">
        {/* Logo */}
        <div className="text-xl hidden lg:block left-20 md:text-xl lg:text-3xl font-semibold">
          <Link href="/web">{process.env.NEXT_PUBLIC_SITE_NAME}</Link>
        </div>
        {/* Hamburger menu icon (visible on small screens) */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
        {/* Full Navbar (visible on medium and large screens) */}
        <nav className="hidden list-none rounded-lg p-6 gap-8 lg:text-md xl:text-xl xl:gap-12 text-base font-semibold text-gray-600 md:flex md:gap-6 md:text-sm">
          <li className="text-red-500 transition duration-300 ease-in-out transform hover:text-red-200 hover:underline">
            <Link href="/web/sale">SALE</Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
            <Link href="/web/collections/all">Products</Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:text-gray-400 md:hidden lg:block">
            <Link href="/web/service/contact-us">Service</Link>
          </li>
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
        </nav>
        {/* Dropdown Navbar for mobile (visible when open) */}
        {open && (
          <nav className="w-full mx-auto px-2 md:px-12 absolute top-28 left-0 z-20 right-0 bg-gray-300 p-4 flex flex-col items-start list-none gap-12 text-lg md:font-semibold text-gray-600 md:hidden">
            <li className="transition duration-300 ease-in-out transform hover:text-red-200 hover:underline">
              <Link onClick={() => setOpen(false)} href="/web">
                Home
              </Link>
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
              <Link onClick={() => setOpen(false)} href="/web/sale">
                SALE
              </Link>
            </li>
            <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
              <Link onClick={() => setOpen(false)} href="/web/collections/all">
                All Products
              </Link>
            </li>
            <li className="transition duration-300 ease-in-out transform hover:text-gray-400">
              <Link onClick={() => setOpen(false)} href="/web/service/contact-us">
                24H Service
              </Link>
            </li>
          </nav>
        )}
        {/* Area Selector and Profile (always visible) */}
        <div className="flex gap-6 md:gap-4 items-center">
          <SelectArea />
          <UserProfile />
          <div>
            {cartItems && cartItems.length > 0 ? (
              <span className="relative">
                <Cart />
                <p className="absolute bottom-8 left-6 text-sm w-4 h-4 rounded-full bg-red-600 flex justify-center items-center text-white">
                  {cartItems.length}
                </p>
              </span>
            ) : (
              <Cart />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
