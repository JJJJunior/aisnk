"use client";
import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { QAType } from "../lib/types";

interface QAFormProps {
  currentQA?: QAType;
  setCurrentQA: React.Dispatch<React.SetStateAction<QAType | undefined>>;
  fetchQAs: () => Promise<void>;
}

const QAForm: React.FC<QAFormProps> = ({ currentQA, setCurrentQA, fetchQAs }) => {
  const [from] = useForm();

  const onFinish = async (values: QAType) => {
    let res;
    try {
      if (!currentQA) {
        res = await axios.post("/api/admin/qas", values);
      } else {
        res = await axios.put(`/api/admin/qas/${currentQA.id}`, values);
      }
      if (res.status === 200) {
        message.success("添加成功");
        currentQA && setCurrentQA(undefined);
        fetchQAs();
      }
    } catch (err) {
      // console.error(err);
    } finally {
      from.resetFields();
    }
  };

  useEffect(() => {
    if (currentQA) {
      from.setFieldsValue(currentQA);
    }
  }, [currentQA]);

  const handleCancel = () => {
    setCurrentQA(undefined);
    from.resetFields();
  };
  return (
    <div className="p-2 shadow-lg">
      <Form form={from} onFinish={onFinish} layout="vertical">
        <Form.Item label="标题" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="问题" name="question">
          <Input />
        </Form.Item>
        <Form.Item label="回答" name="answer">
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button type="primary" onClick={handleCancel} className="ml-4" danger>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QAForm;
