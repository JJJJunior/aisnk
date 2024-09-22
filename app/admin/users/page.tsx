"use client";
import { useState, useEffect } from "react";
import RegisterForm from "@/app/components/RegisterForm";
import { Table, Popconfirm, Button, message } from "antd";
import { UserType } from "@/app/lib/types";
import axios from "axios";
import { JWTPlayloadType } from "@/app/lib/types";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<JWTPlayloadType | null>(null);

  const getValidatedUsers = async () => {
    try {
      const res = await axios.get("/api/admin/validate");
      res.status === 200 && setCurrentUser(res.data.data);
    } catch (err) {
      // console.log(err);
    }
  };
  const fetchUsers = async () => {
    // 获取用户数据
    try {
      const res = await axios.get("/api/admin/users");
      if (res.status === 200) {
        setUsers(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
    getValidatedUsers();
  }, []);

  const handleDelete = async (record: UserType) => {
    if (record.username === currentUser?.username) {
      message.error("无法删除当前登录用户");
      return;
    }
    try {
      const res = await axios.delete(`/api/admin/users/${record.id}`);
      if (res.status === 200) {
        message.success("用户删除成功");
        fetchUsers();
      }
    } catch (err) {
      message.error("用户删除失败");
      // console.log(err);
    }
  };

  const handleRest = async (record: UserType) => {
    try {
      const res = await axios.post(`/api/admin/users/reset_password/${record.id}`);
      if (res.status === 200) {
        message.success("密码重置成功");
        fetchUsers();
      }
    } catch (err) {
      message.error("密码重置失败");
      // console.log(err);
    }
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "创建",
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
    {
      title: "密码重置",
      dataIndex: "operation",
      key: "operation",
      render: (record: UserType) =>
        users.length >= 1 ? (
          <div>
            <Popconfirm title="确认重置?" onConfirm={() => handleRest(record)}>
              <Button type="primary">密码重置</Button>
            </Popconfirm>
          </div>
        ) : null,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (record: UserType) =>
        users.length >= 1 ? (
          <div>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return (
    <div>
      <RegisterForm fetchUsers={fetchUsers} />
      <Table dataSource={users} columns={columns} rowKey="id" className="border shadow-lg" loading={loading} />;
    </div>
  );
};

export default Users;
