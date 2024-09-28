"use client";
import { useEffect } from "react";
import { useCustomer } from "@/app/lib/hooks/useCustomer";
import { useAuth } from "@clerk/nextjs";
import { useSettings } from "@/app/lib/hooks/useSettings";

const InitWebDate = () => {
  const { addCustomerInfo } = useCustomer();
  const { addSetting } = useSettings();
  const { userId } = useAuth();

  //初始化customer信息
  const getCustomerInfo = async () => {
    try {
      const res = await fetch(`/api/web/customers/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        addCustomerInfo(data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  //初始化网页设置
  const getWebSettings = async () => {
    const res = await fetch("/api/web/settings/show", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      // console.log(data.data);
      addSetting(data.data);
    }
  };

  useEffect(() => {
    getWebSettings();
  }, []);

  useEffect(() => {
    if (userId) {
      getCustomerInfo();
    }
  }, [userId]);

  return null;
};

export default InitWebDate;
