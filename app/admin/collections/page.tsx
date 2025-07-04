"use client";
import { useEffect, useState } from "react";
import DataTable from "@/app/components/collections/DataTable";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CollectionType } from "@/app/lib/types";
import Link from "next/link";
import axios from "axios";
import { Divider } from "antd/lib";

const Collections = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const res = await axios.get("/api/admin/collections");
      if (res.status === 200) {
        // console.log(res.data.data);
        setCollections(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // console.log(collections);

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">栏目管理</div>
      <Divider />
      <div className="mb-2">
        <Button type="primary">
          <Link href="/admin/collections/new">
            添加栏目
            <PlusCircleOutlined className="ml-2" />
          </Link>
        </Button>
      </div>
      <DataTable dataSource={collections} fetchCollections={fetchCollections} loading={loading} />
    </div>
  );
};

export default Collections;
