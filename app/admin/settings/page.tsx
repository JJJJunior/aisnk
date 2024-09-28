"use client";
import React, { useEffect, useState } from "react";
import { Divider, Popconfirm, message, Switch } from "antd";
import QAForm from "@/app/components/QAForm";
import { Card } from "antd";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { QAType, SettingsType } from "@/app/lib/types";
import axios from "axios";

const page = () => {
  const [qas, setQas] = useState<QAType[]>([]);
  const [currentQA, setCurrentQA] = useState<QAType>();
  const [setting, setSetting] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);

  // console.log(settings);
  const handleEditor = (id: number) => {
    setCurrentQA(qas.find((item) => item.id === id && item));
  };

  const fetchQAs = async () => {
    const res = await axios.get("/api/admin/qas");
    if (res.status === 200) {
      setQas(res.data.data);
      setLoading(false);
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
          setSetting(createData);
        } else {
          setSetting(exsistData);
        }
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    fetchQAs();
    findSettingsAndCreate();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`/api/admin/qas/${id}`);
      if (res.status === 200) {
        message.success("删除成功");
        fetchQAs();
      }
    } catch (err) {
      // console.error(err);
    }
  };

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

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">网站设置</div>
      <Divider />
      <div>
        <div className="flex gap-4 my-6">
          <p className="font-semibold">网站是否显示伪数据</p>
          <Switch value={setting?.value === "1" ? true : false} onChange={showFakeInfo} />
        </div>
        <p>
          使用伪数据注意事项：1、正常产品图片不少于9张，伪数据网站呈现最后1张图片。2、栏目图片不少于2张，网站呈现最后1张。
        </p>
      </div>
      <Divider />
      <div className="text-xl font-semibold">网站信息管理</div>
      <Divider />
      <div className="grid grid-cols-4 gap-6">
        {qas &&
          qas.length > 0 &&
          qas.map((qas) => (
            <div key={qas.id} className="w-[300px] h-[460px] bg-white shadow-lg rounded-lg overflow-auto">
              <Card title={qas.title} size="small" style={{ backgroundColor: "#ffffff" }} loading={loading}>
                <div className="flex gap-2 justify-end items-center">
                  <button className="hover:text-red-400" onClick={(e) => handleEditor(qas.id)}>
                    <FormOutlined />
                  </button>
                  <Popconfirm title="确定删除?" onConfirm={() => handleDelete(qas.id)}>
                    <button className="hover:text-red-400">
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                </div>
                <p className="font-semibold mb-2">{qas.question}</p>
                <p className="text-sm">{qas.answer}</p>
              </Card>
            </div>
          ))}
        <QAForm currentQA={currentQA} setCurrentQA={setCurrentQA} fetchQAs={fetchQAs} />
      </div>
    </div>
  );
};

export default page;
