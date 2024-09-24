import Notication from "@/app/components/store/Notication";
import { NavbarPage } from "@/app/components/store/NavbarPage";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../components/store/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="h-screen">
        <Notication />
        <NavbarPage />
        {children}
        <Footer />
      </div>
    </ClerkProvider>
  );
}
