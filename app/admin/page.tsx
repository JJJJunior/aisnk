import React from "react";
import { prisma } from "@/prisma/db";
import { Divider } from "antd";

const AdminPage = async () => {
  // 获取访客数据
  const visitors = await prisma.visitor.findMany({
    select: {
      lastVisit: true, // 只选择 lastVisit 字段
    },
  });

  // 按日期分组统计访问量
  const groupedData =
    visitors &&
    visitors.reduce((acc, visitor) => {
      const date = new Date(visitor.lastVisit).toISOString().split("T")[0]; // 只保留日期部分
      acc[date] = (acc[date] || 0) + 1; // 统计每个日期的访问量
      return acc;
    }, {});

  // 转换为数组格式
  const chartData = Object.entries(groupedData).map(([date, count]) => ({
    date,
    visitCount: count,
  }));

  // 获取客户数据
  const newCustomersByDate = await prisma.customer.groupBy({
    by: ["createdAt"], // 按创建日期分组
    _count: {
      id: true, // 统计每个日期的新增客户数
    },
    orderBy: {
      createdAt: "asc", // 按照日期升序排序
    },
  });

  // 转换数据格式以适应表格
  const customerChartData = newCustomersByDate.map((item) => ({
    date: new Date(item.createdAt).toISOString().split("T")[0], // 格式化为 YYYY-MM-DD
    newCustomers: item._count.id, // 每日新增客户数
  }));

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">首页</div>
      <Divider />
      <div className="grid grid-cols-2 gap-4">
        {/* 访客表格 */}
        <div>
          <h2 className="text-lg font-bold mb-4">每日访客统计</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">日期</th>
                <th className="py-2 px-4 border-b">访客数</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item) => (
                <tr key={item.date}>
                  <td className="py-2 px-4 border-b">{item.date}</td>
                  <td className="py-2 px-4 border-b">{item.visitCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 客户表格 */}
        <div>
          <h2 className="text-lg font-bold mb-4">每日新增客户统计</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">日期</th>
                <th className="py-2 px-4 border-b">新增客户数</th>
              </tr>
            </thead>
            <tbody>
              {customerChartData.map((item) => (
                <tr key={item.date}>
                  <td className="py-2 px-4 border-b">{item.date}</td>
                  <td className="py-2 px-4 border-b">{item.newCustomers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
