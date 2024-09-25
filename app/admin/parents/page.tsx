"use client";
import { Form, Input, Button, Table, message, Popconfirm, Divider } from "antd";
import { useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import axios from "axios";

type FileType = {
  name?: string;
};

interface ParentType {
  id: number;
  name: string;
}

const Parents = () => {
  const [parents, setParents] = useState<ParentType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const onFinish: FormProps<FileType>["onFinish"] = async (values) => {
    // console.log("Success:", values);
    try {
      const res = await axios.post("/api/admin/parents", values);
      if (res.status === 200) {
        message.success("添加成功");
        getParents();
      }
    } catch (err) {
      // console.log(err);
      message.error("添加失败");
    }
    // setParents([...parents, { name: values.parent ? values.parent : "" }]);
    form.resetFields();
  };

  const getParents = async () => {
    try {
      const res = await axios.get("/api/admin/parents");
      if (res.status === 200) {
        setParents(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
      message.error("获取数据失败");
    }
  };
  useEffect(() => {
    getParents();
  }, []);

  const handleDelete = async (record: ParentType) => {
    console.log("handleDelete");
    try {
      const res = await axios.delete(`/api/admin/parents/${record.id}`);
      if (res.status === 200) {
        message.success("删除成功");
        getParents();
      }
    } catch (err) {
      // console.log(err);
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: unknown, record: ParentType) =>
        parents.length >= 1 ? (
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">父栏目管理</div>
      <Divider />
      <Form className="flex gap-2" onFinish={onFinish} form={form}>
        <Form.Item<FileType> label="父栏目" name="name" rules={[{ required: true, message: "请输入父栏目名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={parents} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default Parents;
