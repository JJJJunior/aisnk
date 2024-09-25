"use client";
import { Form, Input, Button, Table, message, Popconfirm, InputNumber, Divider } from "antd";
import { useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import axios from "axios";
import { ExchangeAndShippingType } from "@/app/lib/types";

const Exchange = () => {
  const [exchangeFormItems, setExchangeFormItems] = useState<ExchangeAndShippingType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState<ExchangeAndShippingType | null>(null);

  // console.log(exchangeFormItems);
  const onFinish: FormProps<ExchangeAndShippingType>["onFinish"] = async (values) => {
    try {
      let res;
      if (!currentData) {
        res = await axios.post("/api/admin/exchange", values);
      } else {
        res = await axios.put(`/api/admin/exchange/${currentData.id}`, values);
      }
      if (res.status === 200) {
        message.success("添加成功");
        getExchange();
      }
    } catch (err) {
      // console.log(err);
      message.error("添加失败");
    }
    // setParents([...parents, { name: values.parent ? values.parent : "" }]);
    form.resetFields();
  };

  const getExchange = async () => {
    try {
      const res = await axios.get("/api/admin/exchange");
      if (res.status === 200) {
        setExchangeFormItems(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
      message.error("获取数据失败");
    }
  };

  const handleDelete = async (record: ExchangeAndShippingType) => {
    // console.log("handleDelete");
    try {
      const res = await axios.delete(`/api/admin/exchange/${record.id}`);
      if (res.status === 200) {
        message.success("删除成功");
        getExchange();
      }
    } catch (err) {
      // console.log(err);
      message.error("删除失败");
    }
  };

  const columns = [
    {
      title: "国家代码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "国家名称",
      dataIndex: "courtyName",
      key: "courtyName",
      render: (_: any, record: ExchangeAndShippingType) => {
        return (
          <div>
            {record.courtyName} {record.englishCoutryName}
          </div>
        );
      },
    },
    {
      title: "货币代码",
      dataIndex: "currencyCode",
      key: "currencyCode",
    },
    {
      title: "对RBM汇率",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
    },
    {
      title: "对USB汇率",
      dataIndex: "toUSDRate",
      key: "toUSDRate",
    },
    {
      title: "Stripe运费代码",
      dataIndex: "shippingCodeInStripe",
      key: "shippingCodeInStripe",
    },
    {
      title: "Stripe运费明细",
      dataIndex: "shippingCodeDesInStripe",
      key: "shippingCodeDesInStripe",
    },
    {
      title: "支付方式",
      dataIndex: "paymentTypeInStripe",
      key: "paymentTypeInStripe",
    },
    {
      title: "销售地区",
      dataIndex: "allowedCountries",
      key: "allowedCountries",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: unknown, record: ExchangeAndShippingType) =>
        exchangeFormItems.length >= 1 ? (
          <div>
            <Button
              type="primary"
              className="mr-2"
              onClick={() => {
                form.setFieldsValue({
                  id: record.id,
                  code: record.code,
                  courtyName: record.courtyName,
                  englishCoutryName: record.englishCoutryName,
                  currencyCode: record.currencyCode,
                  exchangeRate: record.exchangeRate,
                  shippingCodeInStripe: record.shippingCodeInStripe,
                  shippingCodeDesInStripe: record.shippingCodeDesInStripe,
                  paymentTypeInStripe: record.paymentTypeInStripe,
                  allowedCountries: record.allowedCountries,
                });
                setCurrentData(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  useEffect(() => {
    getExchange();
  }, []);

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">汇率及运费管理</div>
      <Divider />
      <Form onFinish={onFinish} form={form}>
        <div>
          <div className="grid grid-cols-4 gap-4">
            <Form.Item label="国家代码" name="code" rules={[{ required: true, message: "国家名称" }]}>
              <Input required />
            </Form.Item>
            <Form.Item label="国家名称" name="courtyName" rules={[{ required: true, message: "国家名称" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="英文名称" name="englishCoutryName" rules={[{ required: true, message: "国家名称" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="货币代码" name="currencyCode" rules={[{ required: true, message: "货币代码" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="对RMB汇率" name="exchangeRate" rules={[{ required: true, message: "对人民币汇率" }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="对USD汇率" name="toUSDRate" rules={[{ required: true, message: "对人民币汇率" }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Stripe运费代码"
              name="shippingCodeInStripe"
              rules={[{ required: true, message: "Stripe运费代码" }]}
            >
              <Input placeholder="多个运费代码用,进行分隔" />
            </Form.Item>
            <Form.Item
              label="Stripe运费明细"
              name="shippingCodeDesInStripe"
              rules={[{ required: true, message: "货币代码" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="支付方式" name="paymentTypeInStripe" rules={[{ required: true, message: "货币代码" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="销售地区" name="allowedCountries" rules={[{ required: true, message: "货币代码" }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                danger
                className="ml-2"
                onClick={() => {
                  form.resetFields();
                  setCurrentData(null);
                }}
              >
                取消
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
      <Table dataSource={exchangeFormItems} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default Exchange;
