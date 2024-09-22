import Notication from "@/app/components/store/Notication";
import { NavbarPage } from "@/app/components/store/NavbarPage";
import { ClerkProvider } from "@clerk/nextjs";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div>
        <Notication />
        <NavbarPage />
        {children}
      </div>
    </ClerkProvider>
  );
}
