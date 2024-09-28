"use client";
import React, { useEffect, useState } from "react";
import { Divider, message, Switch, Form, Table, Input, Button } from "antd";
import { SettingsType } from "@/app/lib/types";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";

const page = () => {
  const [showFake, setShowFake] = useState<SettingsType | null>(null);
  const [settings, setSettings] = useState<SettingsType[]>([]);
  const [form] = useForm();

  const fectchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      // message.error("获取网站信息失败");
    }
  };

  const findSettingsAndCreate = async () => {
    try {
      const res = await fetch(`/api/admin/settings/show`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const exsistData = await res.json();
        // console.log(res.data.data);
        if (exsistData === null) {
          // 创建网站信息
          const create_res = await fetch("/api/admin/settings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: "show",
              value: "0",
            }),
          });
          const createData = await create_res.json();
          setShowFake(createData);
        } else {
          setShowFake(exsistData);
        }
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    findSettingsAndCreate();
    fectchSettings();
  }, []);

  // 显示伪数据
  const showFakeInfo = async (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    try {
      const res = await axios.put(`/api/admin/settings/show`, {
        value: checked ? "1" : "0",
      });
      if (res.status === 200) {
        message.success("修改成功");
        findSettingsAndCreate();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "value",
      dataIndex: "value",
      key: "value",
    },
  ];

  const onFinish = async (values: { key: string; value: string }) => {
    console.log(values);
    try {
      const res = await fetch(`/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        message.success("添加成功");
        form.resetFields();
        fectchSettings();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">网站设置</div>
      <Divider />
      <div>
        <div className="flex gap-4 my-6">
          <p className="font-semibold">网站是否显示伪数据</p>
          <Switch value={showFake?.value === "1" ? true : false} onChange={showFakeInfo} />
        </div>
        <p>
          使用伪数据注意事项：1、正常产品图片不少于9张，伪数据网站呈现最后1张图片。2、栏目图片不少于2张，网站呈现最后1张。
        </p>
      </div>
      <Divider />
      <div className="text-2xl font-semibold mb-4">社媒链接管理</div>
      <Form className="grid grid-cols-3 gap-2" form={form} onFinish={onFinish}>
        <Form.Item label="key" name="key">
          <Input />
        </Form.Item>
        <Form.Item label="value" name="value">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={settings} columns={columns} />;
    </div>
  );
};

export default page;
