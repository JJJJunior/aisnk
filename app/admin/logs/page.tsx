"use client";
import { useEffect, useState } from "react";
import { Table, Divider } from "antd";
import { LogType } from "@/app/lib/types";
import axios from "axios";

const SystemLogs = () => {
  const [systemLogs, setSystemLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSystemLogs = async () => {
    try {
      const res = await axios.get("/api/admin/logs");
      if (res.status === 200) {
        setSystemLogs(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    // 获取系统日志数据
    fetchSystemLogs();
  }, []);

  const columns = [
    {
      title: "用户",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "操作类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "国家",
      dataIndex: "country_name",
      key: "country_name",
    },
    {
      title: "城市",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "详情",
      dataIndex: "info",
      key: "info",
      render: (info: string) => <p className="w-[400px]">{info}</p>,
    },
    {
      title: "操作时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Date) => {
        const date = new Date(created_at);
        const formattedDate = date
          .toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace("T", " ");
        return formattedDate;
      },
    },
  ];
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">日志管理</div>
      <Divider />
      <Table dataSource={systemLogs} columns={columns} rowKey="id" className="border shadow-lg" loading={loading} />;
    </div>
  );
};

export default SystemLogs;
