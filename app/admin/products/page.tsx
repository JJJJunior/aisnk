"use client";
import { useEffect, useState } from "react";
import DataTable from "@/app/components/products/DataTable";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { CollectionType, ProductType } from "@/app/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddColumns, setShowAddColumns] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [selectedPds, setSelectedPds] = useState<ProductType[]>([]);
  const [selectedCols, setSelectedCols] = useState<CollectionType[]>([]);
  const router = useRouter();

  const receiveDataFromChild = (products: ProductType[]) => {
    // console.log("receiveDataFromChild", products);
    const selectedProducts = products.filter((product): product is ProductType => product !== null);
    setSelectedPds(selectedProducts);
  };
  const fetchCollections = async () => {
    try {
      const res = await axios.get("/api/admin/collections");
      if (res.status === 200) {
        // console.log(res.data.data);
        setCollections(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      if (res.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  // console.log(products);

  const handleProductConnectionToCollections = async () => {
    // TODO: 实现产品和栏目关联的逻辑
    const newData = {
      product_ids: selectedPds.map((p) => p.id),
      collection_ids: selectedCols.map((col) => col.id),
    };

    if (newData.collection_ids.length === 0) {
      message.warning("请先选择栏目");
      return;
    }
    // 发送请求到后台，实现产品和栏目关联
    // console.log(newData, "fasongshujudaohoutai");
    try {
      setLoading(true);
      const res = await axios.post("/api/admin/product_on_collection", newData);
      if (res.status === 200) {
        message.success("产品上架栏目成功");
        fetchProducts();
      }
      // console.log(res.data.data);
    } catch (err) {
      // console.log(err);
      message.error("产品上架栏目失败");
    } finally {
      setShowAddColumns(false);
      setLoading(false);
    }
  };
  const handleSelected = (values: []) => {
    const selectedCollections = values
      .map((value) => collections.find((collection: CollectionType) => collection.id === value) || null)
      .filter((collection): collection is CollectionType => collection !== null);
    setSelectedCols(selectedCollections);
  };
  return (
    <div className="w-full">
      <div className="flex gap-4">
        {showAddColumns && (
          <>
            <Select
              showSearch
              mode="multiple"
              style={{ width: 300 }}
              placeholder="选择栏目"
              onChange={handleSelected}
              options={(collections || []).map((collection) => ({
                value: collection.id,
                label: collection.title,
              }))}
            />
            <Button onClick={handleProductConnectionToCollections} type="primary" ghost>
              批量上栏目
              <PlusCircleOutlined className="ml-2" />
            </Button>
            <Button
              onClick={() => {
                setShowAddColumns(false);
                setSelectedCols([]);
                setSelectedPds([]);
                router.push("/admin/products");
              }}
            >
              取消
              <CloseCircleOutlined />
            </Button>
          </>
        )}
        <Button type="primary">
          <Link href="/admin/products/new">
            添加产品
            <PlusCircleOutlined className="ml-2" />
          </Link>
        </Button>
      </div>
      <div className="w-full">
        <DataTable
          dataSource={products}
          fetchCollections={fetchProducts}
          setShowAddColumns={setShowAddColumns}
          receiveDataFromChild={receiveDataFromChild}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Products;
