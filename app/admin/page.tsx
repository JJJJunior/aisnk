import React from "react";
import { prisma } from "@/prisma/db";
import { Card, Col, Statistic, Divider } from "antd";
import TotalBar from "../components/main/TotalBar";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const AdminPage = async () => {
  // 获取当前时间的 UTC 时间
  const now = new Date();

  // 计算今天 UTC 0 点的时间
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // 计算昨天 UTC 0 点的时间
  const startOfYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));

  // 计算前天 UTC 0 点的时间
  const startOfDayBeforeYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2));

  // 计算昨天的 UTC 结束时间（23:59:59）
  const endOfYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 1);

  // 计算前天的 UTC 结束时间（23:59:59）
  const endOfDayBeforeYesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1) - 1);

  // 获取昨天的客户数
  const yesterdayCustomers = await prisma.customer.findMany({
    where: {
      createdAt: {
        gte: startOfYesterday, // 昨天 UTC 0 点
        lte: endOfYesterday, // 昨天 UTC 23:59:59
      },
    },
  });

  // 获取前天的客户数
  const dayBeforeYesterdayCustomers = await prisma.customer.findMany({
    where: {
      createdAt: {
        gte: startOfDayBeforeYesterday, // 前天 UTC 0 点
        lte: endOfDayBeforeYesterday, // 前天 UTC 23:59:59
      },
    },
  });

  // 获取今天、昨天和前天新增的产品数
  const todayProducts = await prisma.product.findMany({
    where: {
      created_at: {
        gte: startOfToday, // 今天 UTC 0 点
        lte: now, // 当前时间的 UTC
      },
    },
  });

  const yesterdayProducts = await prisma.product.findMany({
    where: {
      created_at: {
        gte: startOfYesterday, // 昨天 UTC 0 点
        lte: endOfYesterday, // 昨天 UTC 23:59:59
      },
    },
  });

  const totalProducts = await prisma.product.findMany();
  const totalCustomers = await prisma.customer.findMany();
  // 订单和总销售额
  const totalOrders = await prisma.order.findMany({});
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalAmount: true, // 计算 totalAmount 的总和
    },
  });

  // 查询今天的访客数
  const todayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfToday, // 今天 UTC 0 点
        lte: now, // 当前时间的 UTC
      },
    },
  });

  // 查询昨天的访客数
  const yesterdayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfYesterday, // 昨天 UTC 0 点
        lte: endOfYesterday, // 昨天 UTC 23:59:59
      },
    },
  });

  // 查询前天的访客数
  const dayBeforeYesterdayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfDayBeforeYesterday, // 前天 UTC 0 点
        lte: endOfDayBeforeYesterday, // 前天 UTC 23:59:59
      },
    },
  });

  // 按国家分组访客统计
  const groupAreas = await prisma.visitor.groupBy({
    by: ["countryName"],
    _sum: {
      visitCount: true,
    },
  });
  // 将数据转换为 TotalBar 组件需要的格式
  const formattedData = groupAreas.map((item) => ({
    国家: item.countryName,
    访客数量: item._sum.visitCount,
  }));

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">首页</div>
      <Divider />
      <div className="grid grid-cols-4 gap-4">
        <Col>
          <Card bordered={false}>
            <Statistic title="前天访客" value={dayBeforeYesterdayVisitors} valueStyle={{ color: "#3f8600" }} />
            <Statistic title="昨天访客" value={yesterdayVisitors} valueStyle={{ color: "#3f8600" }} />
            <Statistic
              title="今天访客"
              value={todayVisitors}
              valueStyle={{ color: "#3f8600" }}
              prefix={todayVisitors - yesterdayVisitors > 0 && <ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col>
          <Card bordered={false}>
            <Statistic title="产品总数" value={totalProducts.length} valueStyle={{ color: "#3f8600" }} />
            <div className="flex justify-between">
              <Statistic title="昨日产品数" value={yesterdayProducts.length} valueStyle={{ color: "#3f8600" }} />
              <Statistic title="今日产品数" value={todayProducts.length} valueStyle={{ color: "#3f8600" }} />
            </div>
            <Statistic
              title="新增产品数"
              value={todayProducts.length - yesterdayProducts.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col>
          <Card bordered={false}>
            <Statistic
              title="前日客户数"
              value={dayBeforeYesterdayCustomers.length}
              valueStyle={{ color: "#3f8600" }}
            />
            <Statistic title="昨日客户数" value={yesterdayCustomers.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic
              title="新增客户数"
              value={yesterdayCustomers.length - dayBeforeYesterdayCustomers.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col>
          <Card bordered={false}>
            <Statistic title="总客户数" value={totalCustomers.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic title="订单总数" value={totalOrders.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic
              title="销售总金额"
              value={totalSales._sum.totalAmount ? totalSales._sum.totalAmount : 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </div>
      <div className="w-full mx-auto p-6 border rounded-lg bg-slate-200 mt-8">
        <h1 className="text-xl">访客明细</h1>
        <TotalBar groupAreas={formattedData} />
      </div>
    </div>
  );
};

export default AdminPage;
