"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Divider } from "antd";
import { CustomerType, PartnerType } from "@/app/lib/types";
import { OrderType } from "@/app/lib/types";

import { customAlphabet } from "nanoid";
// 定义只包含字母和数字的字符集
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 生成长度为8的nanoid
const generateNanoId = customAlphabet(alphabet, 8);

const page = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);

  //在nextjs中是通过url路径进行缓存的，当请求的路径没有发生改变，都是默认从缓存获取。
  const getCustomers = async () => {
    try {
      const res = await fetch(`/api/admin/customers`, {
        cache: "no-cache",
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //还需要创建合作商..............
  const promote_customer = async (record: CustomerType) => {
    try {
      const res = await fetch(`/api/admin/customers/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_partner: true }),
      });
      if (res.ok) {
        const res = await fetch(`/api/admin/partners`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: record.id,
            username: record.username,
            email: record.email,
            firstName: record.firstName,
            lastName: record.lastName,
            name: record.name,
            phone: record.phone,
            code: generateNanoId(),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          // console.log(data)
          message.success("设置合作商成功");
          getCustomers();
        }
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
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "邀请人",
      dataIndex: "Partner",
      key: "Partner",
      render: (Partner: PartnerType) => <p>{Partner?.username}</p>,
    },
    {
      title: "订单总数",
      dataIndex: "Orders",
      key: "Orders",
      render: (Orders: OrderType[]) => <p>{Orders.length}</p>,
    },
    {
      title: "消费总金额",
      dataIndex: "Orders",
      key: "Orders",
      render: (Orders: OrderType[]) => {
        const total = Orders.reduce((acc, order) => acc + (order.totalAmount ? order.totalAmount : 0), 0);
        return <p>$ {total}</p>;
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: CustomerType) =>
        !record.is_partner ? (
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
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">客户管理</div>
      <Divider />
      <Table dataSource={customers} columns={columns} rowKey="id" size="small" loading={loading} />
    </div>
  );
};

export default page;
