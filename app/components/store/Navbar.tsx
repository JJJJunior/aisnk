"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserProfile from "@/app/components/store/UserProfile";
import { SelectArea } from "./SelectArea";
import MenuInNavbar from "./MenuInNavbar";
import { ParentType } from "@/app/lib/types";
import { usePathname } from "next/navigation";
import axios from "axios";

interface NavbarProps {
  sneakers: ParentType;
  accessoires: ParentType;
}

export const Navbar: React.FC<NavbarProps> = ({ sneakers, accessoires }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [current, setCurrent] = useState("");
  const [isFake, setIsFake] = useState(0);

  const getWebSettings = async () => {
    const res = await axios.get("/api/web/settings/websettings");
    if (res.status === 200) {
      setIsFake(res.data.data.is_fake);
    }
  };

  useEffect(() => {
    setCurrent(pathname);
    getWebSettings();
  }, []);

  useEffect(() => {
    if (pathname !== current) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <div className="bg-gray-100">
      <div className="mx-4 h-20 lg:mx-16 lg:h-28 flex justify-between items-center lg:relative">
        {/* Logo */}
        <div className="text-xl hidden lg:block left-20 lg:text-3xl font-semibold">
          <Link href="/web">{process.env.NEXT_PUBLIC_SITE_NAME}</Link>
        </div>

        {/* Hamburger menu icon (visible on small screens) */}
        <button className="lg:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>

        {/* Full Navbar (visible on medium and large screens) */}
        <nav className="hidden lg:flex list-none gap-8 lg:gap-12 text-base lg:text-lg font-semibold text-gray-600">
          <MenuInNavbar isFake={isFake} content={sneakers} />
          <MenuInNavbar isFake={isFake} content={accessoires} />
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

        {/* Dropdown Navbar for mobile (visible when open) */}
        {open && (
          <nav className="absolute top-28 left-0 z-20 right-0 bg-gray-100 p-4 flex flex-col items-start list-none gap-12 text-lg font-semibold text-gray-600 md:hidden">
            <MenuInNavbar content={sneakers} isFake={isFake} />
            <MenuInNavbar content={accessoires} isFake={isFake} />
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
