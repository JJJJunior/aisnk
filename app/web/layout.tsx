import Notication from "@/app/components/store/Notication";
import { NavbarPage } from "@/app/components/store/NavbarPage";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../components/store/Footer";
import { Toaster } from "react-hot-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="h-screen w-full mx-auto">
        <Notication />
        <NavbarPage />
        <Toaster position="top-center" />
        {children}
        <Footer />
      </div>
    </ClerkProvider>
  );
}
