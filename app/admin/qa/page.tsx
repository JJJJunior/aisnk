"use client";
import React, { useState, useEffect } from "react";
import QAForm from "@/app/components/QAForm";
import { Card, message, Divider, Popconfirm } from "antd";
import { QAType } from "@/app/lib/types";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const QAPage = () => {
  const [currentQA, setCurrentQA] = useState<QAType>();
  const [qas, setQas] = useState<QAType[]>([]);
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
  useEffect(() => {
    fetchQAs();
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
  return (
    <div className="w-full">
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

export default QAPage;
