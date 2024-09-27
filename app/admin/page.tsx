import React from "react";
import { prisma } from "@/prisma/db";
import { Card, Col, Statistic, Divider } from "antd";
import TotalBar from "../components/main/TotalBar";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const AdminPage = async () => {
  const utcOffset = 8; // +8 GMT 时区偏移量

  // 当前时间的 UTC 时间
  const now = new Date();

  // 计算今天开始的 UTC 时间
  const startOfToday = new Date();
  startOfToday.setUTCHours(0 - utcOffset, 0, 0, 0);

  // 计算昨天的 UTC 开始时间
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1); // 昨天 0 点

  // 计算前天的 UTC 开始时间
  const startOfDayBeforeYesterday = new Date(startOfYesterday);
  startOfDayBeforeYesterday.setUTCDate(startOfDayBeforeYesterday.getUTCDate() - 1); // 前天 0 点

  // 计算昨天的 UTC 结束时间
  const endOfYesterday = new Date(startOfToday);
  endOfYesterday.setUTCSeconds(-1); // 昨天 23:59:59

  // 计算前天的 UTC 结束时间
  const endOfDayBeforeYesterday = new Date(startOfYesterday);
  endOfDayBeforeYesterday.setUTCSeconds(-1); // 前天 23:59:59

  //客户数
  const todayCustomers = await prisma.customer.findMany({
    where: {
      createdAt: {
        gte: startOfYesterday, // 昨天 0 点（+8）对应的 UTC 开始时间
        lte: endOfYesterday, // 昨天 23:59:59 对应的 UTC 结束时间
      },
    },
  });
  const yesdayCustomers = await prisma.customer.findMany({
    where: {
      createdAt: {
        gte: startOfYesterday, // 昨天 0 点（+8）对应的 UTC 开始时间
        lte: endOfYesterday, // 昨天 23:59:59 对应的 UTC 结束时间
      },
    },
  });
  //产品数
  const totalProducts = await prisma.product.findMany({});

  const todayProducts = await prisma.product.findMany({
    where: {
      created_at: {
        gte: startOfToday, // 今天 0 点（+8）对应的 UTC 开始时间
        lte: now, // 当前时间的 UTC
      },
    },
  });
  const yesdayProducts = await prisma.product.findMany({
    where: {
      created_at: {
        gte: startOfYesterday,
        lte: endOfYesterday,
      },
    },
  });

  //订单数
  const orders = await prisma.order.findMany({});
  // 总销售额
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalAmount: true, // 计算 totalAmount 的总和
    },
  });
  const totalCustomers = await prisma.customer.findMany();

  // 查询今天的访客
  const todayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfToday, // 今天0点（+8）对应的 UTC 开始时间
        lte: now, // 当前时间的 UTC
      },
    },
  });

  // 查询昨天的访客
  const yesterdayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfYesterday, // 昨天 0 点（+8）对应的 UTC 开始时间
        lte: endOfYesterday, // 昨天 23:59:59 对应的 UTC 结束时间
      },
    },
  });

  // 查询前天的访客
  const dayBeforeYesterdayVisitors = await prisma.visitor.count({
    where: {
      createdAt: {
        gte: startOfDayBeforeYesterday, // 前天 0 点（+8）对应的 UTC 开始时间
        lte: endOfDayBeforeYesterday, // 前天 23:59:59 对应的 UTC 结束时间
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
              <Statistic title="昨日产品数" value={yesdayProducts.length} valueStyle={{ color: "#3f8600" }} />
              <Statistic title="今日产品数" value={todayProducts.length} valueStyle={{ color: "#3f8600" }} />
            </div>
            <Statistic
              title="新增产品数"
              value={todayCustomers.length - yesdayCustomers.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col>
          <Card bordered={false}>
            <Statistic title="昨日客户数" value={yesdayCustomers.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic title="今日客户数" value={todayCustomers.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic
              title="新增客户数"
              value={todayCustomers.length - yesdayCustomers.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col>
          <Card bordered={false}>
            <Statistic title="总客户数" value={totalCustomers.length} valueStyle={{ color: "#3f8600" }} />
            <Statistic title="订单总数" value={orders.length} valueStyle={{ color: "#3f8600" }} />
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
