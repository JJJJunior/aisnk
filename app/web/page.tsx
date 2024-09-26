import { Hero } from "@/app/components/store/Hero";
import Promise from "@/app/components/store/Promise";
import VisitorTracker from "../components/store/VisitorTracker";
import InitWebDate from "../components/store/InitWebDate";
import Main from "../components/Main";
import RefTracker from "../components/store/RefTracker";

const Page = () => {
  return (
    <div className="w-full mx-auto">
      {/* 追踪访客的插件 */}
      <VisitorTracker />
      {/* 追踪推荐用户插件 */}
      <RefTracker />
      {/* 集中放置全局hooks的插件 */}
      <InitWebDate />
      <Promise />
      <Hero />
      <Main />
    </div>
  );
};

export default Page;
