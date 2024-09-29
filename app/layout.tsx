import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from "next/font/google";

// 加载 Rubik 字体
const rubik = Rubik({
  subsets: ["latin"], // 选择字符集
  weight: ["400", "500", "700"], // 选择需要的字体权重
  variable: "--font-rubik", // 定义 CSS 变量以便在全局 CSS 中使用
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME}-SneakerClub-Your nextone kicks`,
  description:
    "SneakerClub,Your nextone kicks,unboxing kicks,discover a curated selection of footwear, from comfortable everyday sneakers to exclusive limited-edition styles. We offer top brands like Nike, Vans, Converse, Adidas, Salomon, Onitsuka Tiger, ASICS, and Puma, all paired with unique accessories to elevate your style. Whether you're gearing up for casual sports or stepping out in street fashion, our collection provides the perfect match to help you express your individuality. Explore now for a seamless shopping experience and fast shipping!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.variable}>{children}</body>
    </html>
  );
}
