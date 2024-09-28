"use client";
import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomerType } from "@/app/lib/types";
import axios from "axios";
import useRefTracker from "@/app/lib/hooks/useRefTracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandGroup, CommandItem, CommandList, Command } from "@/components/ui/command";
import { UserIcon, LogOutIcon, UserCircleIcon } from "lucide-react";
import { useCustomer } from "@/app/lib/hooks/useCustomer";

//用户使用clerk登录后
const UserProfile = () => {
  const { user } = useUser();
  const router = useRouter();
  const { refId } = useRefTracker();
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const { addCustomerInfo, customer } = useCustomer();
  const [openUser, setOpenUser] = useState(false);

  //如果有推荐人，将推荐码保存在数据库
  const createCustomer = async (user: CustomerType) => {
    try {
      const res = await axios.post("/api/web/customers", {
        ...user,
        refId: refId ? refId : null,
      });
      // console.log(res.data);
    } catch (err) {
      // console.log(err)
    }
  };

  //从数据库获取用户资料，放入全局hooks中
  const getCustomer = async (userId: string) => {
    try {
      const res = await axios.get(`/api/web/customers/${userId}`);
      if (res.status === 200) {
        addCustomerInfo(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  //从数据库获取用户资料，放入全局hooks中
  useEffect(() => {
    if (user) {
      getCustomer(user.id);
      if (user.id !== customer.id) {
        createCustomer({
          id: user.id,
          username: user.username ? user.username : "",
          email: user.emailAddresses[0].emailAddress ? user.emailAddresses[0].emailAddress : "",
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          createdAt: user.createdAt ? user.createdAt : null,
          lastSignInAt: user.lastSignInAt ? user.lastSignInAt : null,
        });
      }
    }
  }, [user]);

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

  // console.log(user);
  return (
    <div className="flex gap-8">
      {user ? (
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
                    {customer.is_partner === true && (
                      <CommandItem>
                        <button
                          onClick={() => {
                            router.push("/web/partners");
                            setOpen(false);
                          }}
                          className="flex items-center w-full"
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          <span className="p-1">Partner</span>
                        </button>
                      </CommandItem>
                    )}
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
        <div className="relative">
          <UserCircleIcon
            className="hover:text-gray-400 cursor-pointer lg:hidden"
            size={30}
            onClick={() => setOpenUser(!openUser)}
          />
          {openUser ? (
            <div className="flex flex-col gap-2 top-10 right-1 absolute bg-white p-12 z-30 rounded-lg shadow-lg">
              <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-in")}>
                Login
              </Button>
              <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-up")}>
                Register
              </Button>
            </div>
          ) : (
            <div className="hidden lg:flex lg:gap-2">
              <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-in")}>
                Login
              </Button>
              <Button className="hover:text-gray-300" onClick={() => router.push("/web/sign-up")}>
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default UserProfile;
