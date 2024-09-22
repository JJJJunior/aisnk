import RefTracker from "@/app/components/store/RefTracker";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center">
      {/* 追踪受邀人插件 */}
      <RefTracker />
      <SignUp />
    </div>
  );
}
