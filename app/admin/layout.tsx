"use client";
import React, { useEffect, useState } from "react";
import { Layout as AntLayout, Menu, theme, ConfigProvider, App as AntdApp } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { MenuProps } from "antd";
import {
  SkinOutlined,
  ProfileOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined,
  SecurityScanOutlined,
  WindowsOutlined,
  TransactionOutlined,
  SettingOutlined,
  LikeOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const { Content, Footer, Sider } = AntLayout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "/admin", icon: <HomeOutlined />, label: "首页" },
  { key: "/admin/parents", icon: <WindowsOutlined />, label: "父栏目管理" },
  { key: "/admin/collections", icon: <ProfileOutlined />, label: "栏目管理" },
  { key: "/admin/products", icon: <SkinOutlined />, label: "产品管理" },
  { key: "/admin/customers", icon: <TeamOutlined />, label: "客户管理" },
  { key: "/admin/partners", icon: <LikeOutlined />, label: "合作商管理" },
  { key: "/admin/orders", icon: <DollarOutlined />, label: "订单管理" },
  { key: "/admin/exchange", icon: <TransactionOutlined />, label: "汇率及运费管理" },
  { key: "/admin/users", icon: <UserOutlined />, label: "用户管理" },
  { key: "/admin/logs", icon: <SecurityScanOutlined />, label: "日志管理" },
  { key: "/admin/qa", icon: <SoundOutlined />, label: "网站问答" },
  { key: "/admin/settings", icon: <SettingOutlined />, label: "网站设置" },
  { key: "/admin/logout", icon: <LogoutOutlined />, label: "退出登录" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [current, setCurrent] = useState("1");

  const logout = async () => {
    try {
      await axios.get("/api/admin/logout");
      router.push("/dashboard/login");
    } catch (err) {
      // console.log(err);
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/admin/logout") {
      logout();
      return;
    }
    setCurrent(e.key);
    router.push(e.key);
  };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setCurrent(pathname);
    }
  }, [pathname]);

  return (
    <AntdApp>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: "#722ed1",
              borderRadius: 6,

              // 派生变量，影响范围小
              colorBgContainer: "#f9f0ff",
            },
          }}
        >
          <AntLayout hasSider>
            <Sider style={siderStyle}>
              <div className="demo-logo-vertical" />
              <Menu
                defaultSelectedKeys={["1"]}
                mode="inline"
                onClick={onClick}
                theme="dark"
                selectedKeys={[current]}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              />
            </Sider>
            <AntLayout style={{ marginInlineStart: 200 }}>
              <Content
                style={{
                  margin: "6px 0px",
                  padding: 16,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                {/*children在这里*/}
                {children}
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Copyright ©{new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME} All rights reserved.
              </Footer>
            </AntLayout>
          </AntLayout>
        </ConfigProvider>
      </AntdRegistry>
    </AntdApp>
  );
};

export default Layout;
