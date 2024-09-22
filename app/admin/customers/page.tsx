"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { CustomerType, OrderType } from "@/app/lib/types";
import axios from "axios";
import { TransactionOutlined } from "@ant-design/icons";

interface CountsType {
  customerId: string;
  _count: {
    _all: number;
  };
  _sum: {
    totalAmount: number;
  };
}

const page = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CountsType[]>([]);

  const getOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders/counts");
      if (res.status === 200) {
        setCounts(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.error(err);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  //在nextjs中是通过url路径进行缓存的，当请求的路径没有发生改变，都是默认从缓存获取。
  const getCustomers = async () => {
    try {
      const res = await fetch(`/api/admin/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const promote_customer = async (record: CustomerType) => {
    try {
      const res = await axios.put(`/api/admin/customers/promote/${record.id}`);
      if (res.status === 200) {
        message.success("设置合作商成功");
        getCustomers();
      }
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // console.log(counts);
  // console.log(customers);

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "是否合作商",
      dataIndex: "isRef",
      key: "isRef",
      render: (isRef: number) => isRef === 1 && <TransactionOutlined style={{ color: "red", fontSize: 20 }} />,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "邀请人",
      dataIndex: "referredById",
      key: "referredById",
    },
    {
      title: "订单总数",
      render: (_: any, record: CustomerType) => {
        const found = counts.find((item) => item.customerId === record.id);
        return found ? found._count._all : 0; // 返回订单总数
      },
    },
    {
      title: "订单总金额",
      render: (_: any, record: CustomerType) => {
        const found = counts.find((item) => item.customerId === record.id);
        return found ? found._sum.totalAmount : 0; // 返回订单总金额
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: CustomerType) =>
        record.isRef !== 1 ? (
          <div className="flex flex-col items-center gap-2">
            <Popconfirm title="升级成合作商?" onConfirm={() => promote_customer(record)}>
              <Button type="primary" size="small">
                升级成合作商
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return <Table dataSource={customers} columns={columns} rowKey="id" size="small" loading={loading} />;
};

export default page;
