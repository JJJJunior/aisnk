// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { updateToken } from "./app/lib/token";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/web", req.url));
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
    //如果有token就更新token
    updateToken();
    return NextResponse.next(); // 确保返回有效的 Response 实例
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
