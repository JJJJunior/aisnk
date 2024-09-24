import { Hero } from "@/app/components/store/Hero";
import Promise from "@/app/components/store/Promise";
import VisitorTracker from "../components/store/VisitorTracker";
import RefTracker from "../components/store/RefTracker";
import NewProductsInRow from "../components/NewProductsInRow";
import HotProductInRow from "../components/HotProductInRow";
import RecomendCollection from "../components/RecomendCollection";
import TopCollection from "../components/TopCollection";

const Page = () => {
  return (
    <div>
      {/* 追踪访客的插件 */}
      <VisitorTracker />
      {/* 追踪被邀请人的插件 */}
      <RefTracker />
      <Promise />
      <Hero />
      <TopCollection />
      <RecomendCollection />
      <NewProductsInRow />
      <HotProductInRow />
    </div>
  );
};

export default Page;
