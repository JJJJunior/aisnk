import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntApp } from "antd";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntApp>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: "#1677ff",
              borderRadius: 4,

              // 派生变量，影响范围小
              colorBgContainer: "#f5f5f5",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </AntApp>
  );
}
