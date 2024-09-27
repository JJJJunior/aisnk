"use client";
import React from "react";
import { Bar } from "@ant-design/charts";

interface TotalBarProps {
  groupAreas: {
    国家: string | null;
    访客数量: number | null;
  }[];
}
const TotalBar: React.FC<TotalBarProps> = ({ groupAreas }) => {
  const config = {
    title: {
      visible: true,
      text: "基础条形图",
    },
    forceFit: true,
    data: groupAreas, // 使用正确的数据字段
    xField: "国家",
    yField: "访客数量",
    label: {
      visible: true,
      style: {
        fontSize: 12,
      },
      formatter: (v: number) => v,
    },
  };

  return <Bar {...config} />;
};
export default TotalBar;
