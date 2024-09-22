"use client"; // 标记为客户端组件
import { useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const VisitorTracker = () => {
  useEffect(() => {
    const getVisitorId = async () => {
      try {
        // 假设您有一个获取 IP 地址的 API
        const ipResponse = await axios.get("https://api.db-ip.com/v2/free/self");
        const { ipAddress, continentName, countryName, stateProv, city } = ipResponse.data;

        // 您可以使用一个随机 ID 或者更合适的方式来生成 visitorId
        const visitorId = localStorage.getItem("visitorId") || generateVisitorId();

        // 如果是新访客，保存 visitorId 到 localStorage
        if (!localStorage.getItem("visitorId")) {
          localStorage.setItem("visitorId", visitorId);
        }

        // 发送访客信息到 API
        await axios.post("/api/visitor", {
          visitorId,
          ip: ipAddress,
          userAgent: navigator.userAgent,
          deviceType: getDeviceType(),
          os: getOS(),
          browser: getBrowser(),
          continentName: continentName ? continentName : "",
          countryName: countryName ? countryName : "",
          stateProv: stateProv ? stateProv : "",
          city: city ? city : "",
        });
      } catch (error) {
        console.error("Error tracking visitor:", error);
      }
    };

    getVisitorId();
  }, []);

  // 简单的访客 ID 生成器（可以根据需要更换）
  const generateVisitorId = () => {
    return "visitor_" + uuidv4();
  };

  const getDeviceType = () => {
    // 根据 User-Agent 判断设备类型（简化逻辑）
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile/i.test(userAgent)) {
      return "Mobile";
    } else {
      return "Desktop";
    }
  };

  const getOS = () => {
    // 根据 User-Agent 获取操作系统（简化逻辑）
    const userAgent = navigator.userAgent.toLowerCase();
    if (/windows/i.test(userAgent)) return "Windows";
    if (/mac/i.test(userAgent)) return "macOS";
    if (/linux/i.test(userAgent)) return "Linux";
    if (/android/i.test(userAgent)) return "Android";
    if (/iphone|ipad/i.test(userAgent)) return "iOS";
    return "Unknown OS";
  };

  const getBrowser = () => {
    // 根据 User-Agent 获取浏览器（简化逻辑）
    const userAgent = navigator.userAgent.toLowerCase();
    if (/chrome|crios/i.test(userAgent)) return "Chrome";
    if (/firefox/i.test(userAgent)) return "Firefox";
    if (/safari/i.test(userAgent)) return "Safari";
    if (/edge/i.test(userAgent)) return "Edge";
    return "Unknown Browser";
  };

  return null; // 这个组件不需要渲染任何内容
};

export default VisitorTracker;
