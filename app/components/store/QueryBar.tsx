"use client";
import { ArrowBigRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form } from "antd";
import { Input } from "@/components/ui/input";

const QueryBar = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: { query: string }) => {
    if (values.query === undefined || values.query.trim() === "") return;
    const query_key = values.query.trim();
    router.push(`/web/search?q=${query_key}`);
    form.resetFields();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className="flex gap-2 justify-center items-center top-[400px] left-0 absolute h-[60px] z-50">
      <button onClick={handleOpen} className="w-[25px] h-[60px] bg-gray-600 rounded-r-sm">
        <ArrowBigRight size={18} className="text-gray-400 hover:text-gray-200" />
        {/* <Search size={30} className="text-gray-700 hover:text-gray-400" /> */}
      </button>
      {open && (
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="query">
            <Input
              onBlur={() => {
                form.submit();
                setOpen(false);
              }}
              placeholder="Search..."
              className="mt-6 bg-black text-white"
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default QueryBar;
