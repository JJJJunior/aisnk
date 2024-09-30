import Notication from "@/app/components/store/Notication";
import { NavbarPage } from "@/app/components/store/NavbarPage";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../components/store/Footer";
import InitWebDate from "../components/store/InitWebDate";
import { Toaster } from "react-hot-toast";
import QueryBar from "../components/store/QueryBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* 集中放置全局hooks的插件 */}
      <InitWebDate />
      <div className="min-h-screen">
        <div className="sticky z-50 top-0 shadow-md">
          <Notication />
          <NavbarPage />
          <div className="relative">
            <QueryBar />
          </div>
        </div>
        <Toaster position="top-center" />
        {children}
        <Footer />
      </div>
    </ClerkProvider>
  );
}
