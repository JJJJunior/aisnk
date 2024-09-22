"use client";
import React, { useState, useEffect } from "react";
import UploadImages from "@/app/components/UploadImages";
import { Button, Form, Input, InputNumber, Select, Spin, Switch } from "antd";
import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { CollectionType, ImageType, ProductType, ProductStatusType } from "@/app/lib/types";
import { message } from "antd";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMoveImmutable from "array-move";
import UploadOne from "@/app/components/UploadOne";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const NewProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<ImageType[]>([]);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [status, setStatus] = useState<ProductStatusType[] | null>(null);
  const [sizeImage, setSizeImage] = useState("");

  const [cost, setCost] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [commission, setCommission] = useState(0);
  const [expense, setExpense] = useState(0);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get("/api/admin/collections");
      res.status === 200 && setCollections(res.data.data);
    } catch (err) {
      // console.error(err);
    }
  };
  const fetchProductStatus = async () => {
    try {
      const res = await axios.get("/api/admin/products/status");
      if (res.status === 200) {
        setStatus(res.data.data);
        setSizeImage(res.data.data.size_image);
      }
    } catch (err) {
      // console.log("[fetchProductStatus_GET]...", err);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProductStatus();
  }, []);

  interface FormValueType {
    title: string;
    description: string;
    code: string;
    price: number;
    discount: number;
    colors: string;
    sizes: string;
    tags: string;
    cost: number;
    alias_titles: string;
    alias_description: string;
    is_recommended: number;
    shipping: number;
    commission: number;
    collections: number[];
    images: ImageType[];
  }

  const onFinish = async (values: FormValueType) => {
    const newProduct: ProductType = {
      ...values,
      title: values.title.trim(),
      discount: values.discount === 0 || values.discount === undefined ? 1 : values.discount,
      size_image: sizeImage,
      images: images.map((image, index) => ({ ...image, order_index: index + 1 })),
      colors: replaceSymbolsInTags(values.colors),
      sizes: replaceSymbols(values.sizes),
      tags: replaceSymbolsInTags(values.tags),
      is_recommended: values.is_recommended ? 1 : 0,
      collections: values.collections
        .map((id: number) => collections.find((collection) => collection.id === id))
        .filter(Boolean),
    };
    if (newProduct.images?.length === 0) {
      message.error("请上传至少一张图片");
      return;
    }
    // console.log("Received values of form: ", newProduct);
    setLoading(true);
    try {
      const res = await axios.post("/api/admin/products", newProduct);
      if (res.status === 200) {
        message.success("创建产品成功");
        router.push("/admin/products");
      }
    } catch (err) {
      // console.log(err);
      message.error("创建产品失败");
    } finally {
      cleanAll();
      setLoading(false);
    }
  };

  const cleanAll = () => {
    form.resetFields();
    setImages([]);
  };
  const handRemoveImageBtn = (evt: React.MouseEvent<HTMLButtonElement>, item: ImageType) => {
    evt.preventDefault();
    setImages((prevState) => prevState.filter((image) => image.url !== item.url));
  };

  const replaceSymbols = (input: string): string => {
    // 定义要替换的符号和目标符号
    const symbolsToReplace = /[， ；、‧]/g;
    const replacementSymbol = ",";

    // 检查字符串是否包含要替换的符号
    if (symbolsToReplace.test(input)) {
      // 使用正则表达式替换所有符合条件的符号
      return input.replace(symbolsToReplace, replacementSymbol);
    }

    // 如果没有符号要替换，直接返回原字符串
    return input;
  };

  const replaceSymbolsInTags = (input: string): string => {
    // 定义要替换的符号和目标符号
    const symbolsToReplace = /[，、]/g;
    const replacementSymbol = ",";

    // 检查字符串是否包含要替换的符号
    if (symbolsToReplace.test(input)) {
      // 使用正则表达式替换所有符合条件的符号
      return input.replace(symbolsToReplace, replacementSymbol);
    }

    // 如果没有符号要替换，直接返回原字符串
    return input;
  };

  return (
    <div className="p-4">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div>
          <div className="flex gap-6 w-full">
            <Form.Item
              label="产品名称"
              name="title"
              rules={[{ required: true, message: "产品名称不能为空" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
            <Form.Item label="产品别名" name="alias_title" className="flex-1">
              <Input />
            </Form.Item>
          </div>
          <div className="flex gap-6">
            <Form.Item label="产品状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
              <Select placeholder="选择状态">
                {status &&
                  status.length > 0 &&
                  status.map((status) => (
                    <Select.Option key={status.status} value={status.status}>
                      {status.status}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="是否首页推荐" name="is_recommended">
              <Switch />
            </Form.Item>
          </div>
        </div>
        <div className="flex gap-2">
          <Form.Item label="产品编码" name="code" rules={[{ required: true, message: "产品编码不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item label={`售价 ($) 推荐:${String(cost + shipping + commission + expense)}`}>
            <Form.Item name="price" noStyle rules={[{ required: true, message: "价格不能为空" }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="进货价 ($)">
            <Form.Item name="cost" noStyle>
              <InputNumber min={0} onChange={() => setCost(form.getFieldValue("cost"))} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="运费 ($)">
            <Form.Item name="shipping" noStyle>
              <InputNumber min={0} onChange={() => setShipping(form.getFieldValue("shipping"))} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="其他费用 ($)">
            <Form.Item name="expense" noStyle>
              <InputNumber min={0} onChange={() => setExpense(form.getFieldValue("expense"))} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="佣金 ($)">
            <Form.Item name="commission" noStyle>
              <InputNumber min={0} onChange={() => setCommission(form.getFieldValue("commission"))} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="折扣 (0.8 = 8折)">
            <Form.Item name="discount" noStyle>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="库存">
            <Form.Item name="stock" noStyle>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
        </div>
        <Form.Item
          label="产品图片"
          valuePropName="点击上传图片"
          rules={[
            {
              validator: () => {
                if (!images || images.length === 0) {
                  return Promise.reject(new Error("请至少上传一张图片"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <UploadImages setImages={setImages} />
        </Form.Item>
        <SortableList onSortEnd={onSortEnd} className="flex flex-wrap gap-4" draggedItemClassName="dragged">
          {images.length > 0 &&
            images.map((image, index) => (
              <SortableItem key={index}>
                <div key={index} className="flex relative">
                  <div className="h-42 w-36">
                    <Image
                      src={`/api/images?file=${image.url}`}
                      alt="image"
                      width={200}
                      height={300}
                      className="rounded-xl border shadow-lg"
                    />
                  </div>
                  <button
                    onClick={(evt) => handRemoveImageBtn(evt, image)}
                    className="absolute right-2 top-2 text-2xl text-gray-400 hover:text-red-600"
                  >
                    <CloseSquareOutlined />
                  </button>
                </div>
              </SortableItem>
            ))}
        </SortableList>
        <div className="mt-6 flex gap-6 w-full">
          <Form.Item
            label="产品描述"
            name="description"
            rules={[{ required: true, message: "产品描述不能为空" }]}
            className="flex-1"
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item label="别名描述" name="alias_description" className="flex-1">
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>
        <Form.Item label="尺码表" valuePropName="点击上传尺码表">
          <UploadOne setSizeImage={setSizeImage} />
        </Form.Item>
        {sizeImage && (
          <div className="flex justify-start">
            <Image
              src={`/api/images?file=${sizeImage.split("/").slice(1).join("/")}`}
              alt="尺码表"
              width={100}
              height={100}
              className="rounded-xl border shadow-lg"
            />
            <button
              onClick={(evt) => {
                evt.preventDefault();
                setSizeImage("");
              }}
              className="right-2 top-2 text-2xl text-gray-400 hover:text-red-600"
            >
              <CloseSquareOutlined />
            </button>
          </div>
        )}
        <div className="grid grid-cols-3 justify-center gap-4 mt-4">
          <Form.Item label="上线栏目" name="collections" rules={[{ required: true, message: "栏目不能为空" }]}>
            <Select placeholder="选择栏目" mode="multiple">
              {collections.length > 0 &&
                collections.map((collection) => (
                  <Select.Option value={collection.id} key={collection.id}>
                    {collection.title}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="分类名称" name="category" rules={[{ required: true, message: "分类名称不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="颜色" name="colors">
            <Input placeholder="比如：red，yellow，blue 仅支持逗号进行分隔" />
          </Form.Item>
          <Form.Item label="尺寸" name="sizes">
            <Input placeholder="比如：36 37 41 42 仅支持逗号、顿号、空格进行分隔" />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Input placeholder="比如：shoes，hot，summer 只支持逗号进行分隔" />
          </Form.Item>
        </div>
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "保存"}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                router.push("/admin/products");
              }}
            >
              返回
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewProduct;
