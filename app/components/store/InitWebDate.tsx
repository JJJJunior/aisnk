"use client";
import { useEffect } from "react";
import { useCustomer } from "@/app/lib/hooks/useCustomer";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useSettings } from "@/app/lib/hooks/useSettings";

const InitWebDate = () => {
  const { addCustomerInfo } = useCustomer();
  const { addSetting } = useSettings();
  const { userId } = useAuth();

  //初始化customer信息
  const getCustomerInfo = async () => {
    try {
      const res = await axios.get(`/api/web/customers/${userId}`);
      if (res.status === 200) {
        // console.log("getCustomerInfo-----initweb--------", res.data.data);
        addCustomerInfo(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  //初始化网页设置
  const getWebSettings = async () => {
    const res = await axios.get("/api/web/settings/websettings");
    if (res.status === 200) {
      addSetting(res.data.data);
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
