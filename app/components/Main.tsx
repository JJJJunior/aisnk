import React from "react";
import NewProductsInRow from "../components/NewProductsInRow";
import HotProductInRow from "../components/HotProductInRow";
import RecomendCollection from "../components/RecomendCollection";
import TopCollection from "../components/TopCollection";
import { prisma } from "@/prisma/db";
import { SettingsType } from "../lib/types";

const Main = async () => {
  const websetting = await prisma.settings.findUnique({
    where: {
      key: "websettings",
    },
  });

  const websettingData = websetting as SettingsType;

  return (
    <>
      <TopCollection websetting={websettingData} />
      <RecomendCollection websetting={websettingData} />
      <NewProductsInRow websetting={websettingData} />
      <HotProductInRow websetting={websettingData} />
    </>
  );
};

export default Main;
