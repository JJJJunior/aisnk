"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Spin, message, Select, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form"; // 创建表单实例
import UploadImages from "@/app/components/UploadImages";
import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { CollectionType, CollectionStatusType, ImageType } from "@/app/lib/types";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMoveImmutable from "array-move";
import Loader from "@/app/components/Loader";
import axios from "axios";
import { ParentType } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EditCollectionPropos {
  params: {
    id: string;
  };
}

const EditCollection: React.FC<EditCollectionPropos> = ({ params }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageType[]>([]);
  const [status, setStatus] = useState<CollectionStatusType[]>([]);
  const router = useRouter();
  const [parents, setParents] = useState<ParentType[]>([]);

  const fetchCollectionStatus = async () => {
    try {
      const res = await axios.get("/api/admin/collections/status");
      if (res.status === 200) {
        setStatus(res.data.data);
      }
    } catch (err) {
      // console.log("[getCollectionStatus_GET]...", err);
    }
  };

  const fetchCollectionDetails = async () => {
    try {
      if (params.id === null) return;
      const res = await axios.get(`/api/admin/collections/${params.id}`);
      if (res.status === 200) {
        form.setFieldsValue(res.data.data);
        setImages(res.data.data.images || []);
      }
    } catch (err) {
      // console.log("[collectionId_GET]", err);
    } finally {
      setLoading(false);
    }
  };
  const getParents = async () => {
    try {
      const res = await axios.get("/api/admin/parents");
      if (res.status === 200) {
        setParents(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchCollectionStatus();
    fetchCollectionDetails();
    getParents();
  }, []);

  interface FormValueType {
    id: number;
    title: string;
    status: string;
    parentId: number;
    order_index: number;
    images: ImageType[];
  }

  const onFinish = async (values: FormValueType) => {
    const newCollection: CollectionType = {
      ...values,
      order_index: values.order_index === undefined ? 999 : values.order_index,
      title: values.title.trim(),
      images: images?.map((image: ImageType, index: number) => ({ ...image, order_index: index + 1 })),
    };
    if (newCollection.images?.length === 0) {
      message.error("请上传至少一张图片");
      return;
    }
    setLoading(true);
    // console.log(newCollection);
    try {
      const res = await axios.put(`/api/admin/collections/${params.id}`, newCollection);
      if (res.status === 200) {
        message.success("修改栏目成功");
        router.push("/admin/collections");
      }
    } catch (err) {
      // console.log(err);
      message.error("修改栏目失败");
    } finally {
      setLoading(false);
    }
  };

  const handRemoveImageBtn = (evt: React.MouseEvent<HTMLButtonElement>, item: ImageType) => {
    evt.preventDefault();
    setImages((prevState) => prevState.filter((image) => image.url !== item.url));
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  console.log("images", images);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="flex gap-6 w-full">
          <Form.Item
            label="栏目名称"
            name="title"
            rules={[{ required: true, message: "栏目名称不能为空" }]}
            className="flex-1"
          >
            <Input />
          </Form.Item>
          <Form.Item label="栏目别名" name="alias_title" className="flex-1">
            <Input />
          </Form.Item>
        </div>
        <Form.Item label="栏目排序" name="order_index">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="父栏目" name="parentId">
          <Select
            options={
              parents?.map((item: ParentType) => ({
                label: item.name,
                value: item.id,
              })) || []
            }
            placeholder="请选择父栏目"
            disabled={parents.length === 0}
          />
        </Form.Item>
        <Form.Item
          label="栏目图片"
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
          {images?.length > 0 ? (
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
            ))
          ) : (
            <p>Loading ....</p>
          )}
        </SortableList>
        <div className="mt-6 flex gap-6 w-full">
          <Form.Item
            label="栏目描述"
            name="description"
            rules={[{ required: true, message: "栏目描述不能为空" }]}
            className="flex-1"
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item label="别名描述" name="alias_description" className="flex-1">
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>
        <Form.Item label="栏目状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
          <Select placeholder="选择状态">
            {status.map((s) => (
              <Select.Option key={s.status} value={s.status}>
                {s.status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "提交"}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                router.push("/admin/collections");
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

export default EditCollection;
