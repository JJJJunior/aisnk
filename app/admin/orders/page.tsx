"use client";
import React, { useEffect, useState } from "react";
import {
  CustomerType,
  ExchangeAndShippingType,
  OrderType,
  ProductsOnOderType,
  ProductType,
  ShippingAddressType,
} from "@/app/lib/types";
import axios from "axios";
import type { TableColumnsType } from "antd";
import { Table, Select, message, Tag, Button, Popconfirm } from "antd";
import Image from "next/image";
import type { PopconfirmProps } from "antd";

interface OrderStatusType {
  id: string;
  status: string;
}

// 定义订单状态和对应颜色的映射类型
type OrderStatus =
  | "待支付"
  | "已支付"
  | "处理中"
  | "已发货"
  | "已送达"
  | "已取消"
  | "退货处理中"
  | "已退货"
  | "已退款"
  | "失败";

// 订单状态和对应颜色的映射
const statusColors: Record<OrderStatus, string> = {
  待支付: "default",
  已支付: "green",
  处理中: "blue",
  已发货: "orange",
  已送达: "cyan",
  已取消: "red",
  退货处理中: "purple",
  已退货: "magenta",
  已退款: "volcano",
  失败: "red",
};

interface BTNLoadingType {
  id: string;
  status: boolean;
}

const page = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<OrderStatusType[]>([]);

  const getOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      if (res.status === 200) {
        setOrders(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.error(err);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const handleChangeStatus = async (record: OrderType, status: string) => {
    // console.log(record.id, status);
    try {
      const res = await axios.put(`/api/admin/orders/${record.id}/status`, { status: status });
      if (res.status === 200) {
        message.success("状态修改成功");
        getOrders();
      }
    } catch (err) {
      // console.log("Error:", err);
    }
  };

  const handleCheckPartner = async (record: OrderType) => {
    // console.log(record.customer.referredById);

    try {
      const res = await axios.get(`/api/referred/${record.customer.referredById}`);
      if (res.status === 200) {
        await axios.put(`/api/admin/orders/${record.id}/partner`, {
          partner: res.data.data.id,
        });
        message.success("同步成功");
        getOrders();
      }
    } catch (err) {
      message.error("推广人不存在");
    }
  };

  const handleCountCommission = async (record: OrderType) => {
    try {
      const res = await axios.get("/api/admin/exchange");
      if (res.status === 200) {
        const item = res.data.data.filter(
          (item: ExchangeAndShippingType) => item.courtyName === "美国" && item.exchangeRate
        );
        const totalCommission = record.products
          .map((item) => item.product.commission)
          .reduce((acc, commission) => acc + commission, 0);
        const commissionInUSD = totalCommission * item[0].exchangeRate;
        // console.log(commissionInUSD.toFixed(0));
        await axios.put(`/api/admin/orders/${record.id}/commission`, {
          commission: Number(commissionInUSD.toFixed(0)),
        });
        message.success("计算成功");
        getOrders();
      }
    } catch (err) {
      // console.log("Error:", err);
    }
  };

  const handleConfirm: PopconfirmProps["onConfirm"] = async (record: OrderType) => {
    try {
      const res = await axios.put(`/api/admin/orders/${record.id}/confirmed`, {
        confirmed: 1,
      });
      if (res.status === 200) {
        message.success("确认成功");
        getOrders();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const columns = [
    {
      title: "联系方式",
      dataIndex: "customer",
      key: "customer",
      render: (customer: CustomerType) => {
        return (
          <div>
            <div>
              {customer.name
                ? customer.name
                : customer.firstName && customer.lastName && customer.firstName + customer.lastName
                ? customer.username
                : ""}
            </div>
            <div>{customer.email}</div>
            <div>{customer.phone}</div>
          </div>
        );
      },
    },
    {
      title: "收货地址",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (shippingAddress: ShippingAddressType) => {
        return (
          <div>
            <div className="text-xs font-semibold flex gap-2">
              <p>Country:</p>
              <p className="text-red-500">{shippingAddress.country}</p>
            </div>
            <div className="text-xs font-semibold flex gap-2">
              <p>City:</p>
              <p className="text-green-500">{shippingAddress.city}</p>
            </div>
            <div className="text-xs font-semibold flex gap-2">
              <p>PostalCode:</p>
              <p className="text-blue-500">{shippingAddress.postalCode}</p>
            </div>
            <div className="text-xs font-semibold flex gap-2">
              <p>State:</p>
              <p className="text-blue-500">{shippingAddress.state}</p>
            </div>
            <div className="text-xs font-semibold flex gap-2">
              <p>StreetName:</p>
              <p className="text-blue-500">{shippingAddress.streetName}</p>
            </div>
            <div className="text-xs font-semibold flex gap-2">
              <p>StreetNumber:</p>
              <p className="text-blue-500">{shippingAddress.streetNumber}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "订单状态",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => <Tag color={statusColors[status] || "default"}>{status}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: OrderType) => (
        <Select
          defaultValue={record.status}
          value={orderStatus.find((item) => item.id === record.id)?.status}
          onChange={(newStatus) => handleChangeStatus(record, newStatus)} // 传递新的状态值
          style={{ width: 120 }}
          options={[
            { value: "待支付", label: "待支付" },
            { value: "已支付", label: "已支付" },
            { value: "处理中", label: "处理中" },
            { value: "已发货", label: "已发货" },
            { value: "已送达", label: "已送达" },
            { value: "已取消", label: "已取消" },
            { value: "退货处理中", label: "退货处理中" },
            { value: "已退货", label: "已退货" },
            { value: "已退款", label: "已退款" },
            { value: "失败", label: "失败" },
          ]}
        />
      ),
    },
    {
      title: "订单总金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "显示合作商",
      dataIndex: "commission",
      key: "commission",
      render: (_: any, record: OrderType) => (
        <div>
          <div className="text-xs w-[100px]">{record.partner === null ? "None" : record.partner}</div>
          {
            <Button type="primary" onClick={() => handleCheckPartner(record)}>
              同步
            </Button>
          }
        </div>
      ),
    },
    {
      title: "推荐返佣",
      dataIndex: "commission",
      key: "commission",
      render: (_: any, record: OrderType) => (
        <div>
          <div>$ {record.commission === null ? 0 : record.commission}</div>
          {
            <Button
              onClick={() => handleCountCommission(record)}
              disabled={record.partner === null || record.status !== "已送达" || record.confirmed === 1}
            >
              计算返现
            </Button>
          }
        </div>
      ),
    },
    {
      title: "确认返佣",
      dataIndex: "commission",
      key: "commission",
      render: (_: any, record: OrderType) => (
        <div>
          <div>${record.confirmed === 1 && record.commission ? record.commission : 0}</div>
          {
            <Popconfirm
              title="发放返佣"
              description={`确认将$${record.commission} USD 发放给${record.partner}吗?`}
              onConfirm={() => handleConfirm(record)} // 使用箭头函数包装以传递 record
              okText="是的"
              cancelText="再考虑一下"
            >
              <Button type="primary" disabled={record.confirmed === 1 || record.commission === null} danger>
                发放
              </Button>
            </Popconfirm>
          }
        </div>
      ),
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  const expandedRowRender = (record: OrderType) => {
    const columns: TableColumnsType<ProductsOnOderType> = [
      {
        title: "产品名称",
        dataIndex: "title",
        key: "title",
        render: (title) => <div className="text-xs w-[100px]">{title}</div>,
      },
      {
        title: "产品代码",
        dataIndex: "product",
        render: (product: ProductType) => <div className="text-xs font-semibold">{product.code}</div>,
      },
      {
        title: "产品图片",
        dataIndex: "product",
        render: (product: ProductType) => (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER}${product?.images && product?.images[0].url}`}
            width={60}
            height={60}
            alt="pic"
            className="rounded-lg"
          />
        ),
      },
      {
        title: "成本",
        dataIndex: "product",
        render: (product: ProductType) => <div className="text-xs font-semibold text-red-600">{product.cost} RMB</div>,
      },
      {
        title: "佣金",
        dataIndex: "product",
        render: (product: ProductType) => (
          <div className="text-xs font-semibold text-red-600">{product.commission} RMB</div>
        ),
      },
      { title: "颜色", dataIndex: "color", key: "color" },
      { title: "尺寸", dataIndex: "size", key: "size" },
      { title: "数量", dataIndex: "quantity", key: "quantity" },
      {
        title: "售价",
        dataIndex: "amountSubtotal",
        key: "amountSubtotal",
        render: (_, record: ProductsOnOderType) => (
          <div className="text-xs font-semibold text-red-600">
            {record.amountSubtotal / 100} {record.currency.toUpperCase()}
          </div>
        ),
      },
    ];

    return (
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={record.products}
        pagination={false}
        rowKey="productId"
      />
    );
  };
  return (
    <Table
      rowKey="id"
      expandable={{ expandedRowRender }}
      dataSource={orders}
      columns={columns}
      size="small"
      showHeader
      loading={loading}
    />
  );
};

export default page;
