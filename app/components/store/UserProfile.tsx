"use client";
import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useCart from "@/app/lib/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { Cart } from "./Cart";
import { CustomerType } from "@/app/lib/types";
import axios from "axios";
import useRefTracker from "@/app/lib/hooks/useRefTracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandGroup, CommandItem, CommandList, Command } from "@/components/ui/command";
import { UserIcon, LogOutIcon } from "lucide-react";

//用户使用clerk登录后
const UserProfile = () => {
  const { user } = useUser();
  const router = useRouter();
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { refId } = useRefTracker();
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();

  const isLogin = () => {
    const value = `${document.cookie}`;
    return value.includes("__session");
  };

  //如果有推荐人，将推荐码保存在数据库
  const createCustomer = async (user: CustomerType) => {
    try {
      const res = await axios.post("/api/web/customers", {
        ...user,
        referredById: refId ? refId : null,
      });
      // console.log(res.data);
    } catch (err) {
      // console.log(err)
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const loginStatus = isLogin();
    setLoggedIn(loginStatus);
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
    } else {
      if (!user) {
        setLoading(true);
      } else {
        createCustomer({
          id: user.id,
          username: user.username ? user.username : "",
          email: user.emailAddresses[0].emailAddress ? user.emailAddresses[0].emailAddress : "",
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          createdAt: user.createdAt ? user.createdAt : null,
          lastSignInAt: user.lastSignInAt ? user.lastSignInAt : null,
        });
        setLoading(false);
      }
    }
  }, [user, loggedIn]);
  // console.log(user);
  return (
    <div className="flex gap-8">
      {loading ? (
        <Skeleton className="h-8 w-8 rounded-full" />
      ) : user ? (
        <div className="relative">
          <button className="hover:cursor-pointer" onClick={() => setOpen(!open)}>
            <Avatar className="h-8 w-8 rounded-full shadow-md">
              <AvatarImage src={user.imageUrl} alt="@shadcn" />
              <AvatarFallback>{user.username?.slice(0, 1).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          {open && (
            <div className="absolute top-8 z-20 right-0 w-[160px] h-auto mt-2">
              <Command className="rounded-lg border shadow-lg">
                <CommandList>
                  <CommandGroup>
                    <CommandItem>
                      <button
                        onClick={() => {
                          router.push("/web/customers");
                          setOpen(false);
                        }}
                        className="flex items-center w-full"
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span className="p-1">Profile</span>
                      </button>
                    </CommandItem>
                    <CommandItem>
                      <button
                        onClick={() => {
                          signOut({ redirectUrl: "/" });
                          setOpen(false);
                        }}
                        className="flex items-center w-full"
                      >
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        <span className="p-1">Logout</span>
                      </button>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-in")}>
            Login
          </Button>
          <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-up")}>
            Register
          </Button>
        </div>
      )}
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
  );
};
export default UserProfile;
