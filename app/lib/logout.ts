import { cookies } from "next/headers";

export const logout = () => {
  // 重置 Cookie
  cookies().set("token", "", { expires: new Date(0) });
};
