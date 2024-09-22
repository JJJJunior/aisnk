"use client";
import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { message } from "antd/lib";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getIpInDBIP } from "@/app/lib/actions";
import { LogType } from "@/app/lib/types";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log('Success:', values);
    try {
      setLoading(true);
      const res = await axios.post("/api/login", values);
      if (res.status === 200) {
        router.push("/admin");
        message.success("登录成功");
        const data = await getIpInDBIP();
        const logObj: LogType = {
          user: values.username || "",
          type: "用户登录",
          info: "登录成功",
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        const res = await axios.post("/api/logs/login", logObj);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      message.error("登录失败");
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col  items-center justify-center">
      <div className="flex flex-col gap-4 w-[500px] justify-center items-center">
        <h1 className="text-xl font-bold text-center">{process.env.NEXT_PUBLIC_SITE_NAME}产品管理系统</h1>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="w-full h-full rounded-lg"
        >
          <Form.Item<FieldType> label="用户名" name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: "请输入密码!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "加载中..." : "登录"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginPage;
