import { logout } from "@/app/lib/logout";
import { NextResponse } from "next/server";
export const GET = () => {
  logout();
  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
};
