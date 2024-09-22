import { SignIn } from "@clerk/nextjs";
import RefTracker from "@/app/components/store/RefTracker";

export default function Page() {
  return (
    <div className="flex justify-center items-center">
      {/* 追踪受邀人插件 */}
      <RefTracker />
      <SignIn />
    </div>
  );
}
