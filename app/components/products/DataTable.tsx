"use client";
import React, { useRef, useState } from "react";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { Button, Input, InputRef, message, Popconfirm, Space, TableColumnType, Image, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { ImageType, ProductType, ProductCollectionType } from "@/app/lib/types";
import type { TableColumnsType } from "antd";
import Link from "next/link";
import axios from "axios";

type DataIndex = keyof ProductType;

interface DataTableProps {
  dataSource: ProductType[] | [];
  fetchCollections: () => Promise<void>;
  setShowAddColumns: React.Dispatch<React.SetStateAction<boolean>>;
  receiveDataFromChild: (selectedProducts: ProductType[]) => void; // 修改此处的类型
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  dataSource,
  fetchCollections,
  setShowAddColumns,
  receiveDataFromChild,
  loading,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  // console.log(dataSource);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductType[]) => {
      if (selectedRows.length > 0) {
        setShowAddColumns(true);
      } else {
        setShowAddColumns(false);
      }
      // 将选中的产品传递给父组件
      receiveDataFromChild(selectedRows);
    },
  };

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = async (record: ProductType) => {
    // console.log(key);
    try {
      const res = await axios.delete(`/api/admin/products/${Number(record.id)}`);
      if (res.status === 200) {
        message.success("删除成功");
        fetchCollections();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ProductType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`查找 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      (record[dataIndex]?.toString() ?? "")
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<ProductType> = [
    {
      title: "产品名称",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      render: (_, record) => (
        <Link href={`/admin/products/${record.id}`} className="text-green-500">
          {record.title}
        </Link>
      ),
    },
    {
      title: "产品编码",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "首页推荐",
      dataIndex: "is_recommended",
      key: "is_recommended",
      render: (text) => <span color={text ? "green" : "red"}>{text ? "是" : ""}</span>,
    },
    {
      title: "产品图片",
      dataIndex: "images",
      key: "images",
      render: (images: ImageType[]) => (
        <div>
          <Image alt="images" className="rounded-lg shadow-lg" width={80} src={`/api/images?file=${images[0].url}`} />
          <p>{images.length}</p>
        </div>
      ),
    },
    {
      title: "已上架栏目",
      dataIndex: "collections",
      key: "collections",
      render: (collections) => (
        <div className="flex flex-col gap-1">
          {collections.map((item: ProductCollectionType, index: number) => (
            <p key={index} className="text-sm border bg-blue-500 rounded-md text-white">
              {item.collection?.title}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: "分类名称",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (text) => (
        <span
          className={`${text === "上架" ? "text-green-500" : text === "归档" ? "text-yellow-500" : "text-red-500"}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (_, record) => {
        if (record.discount !== 1) {
          return (
            <div>
              <p className="text-sm font-semibold">原价：{Number(record.price).toFixed(2)}</p>
              <p className="text-sm font-semibold text-red-400">
                折后价：{(Number(record.price) * Number(record.discount)).toFixed(2)}
              </p>
            </div>
          );
        } else {
          return <p className="text-sm font-semibold">{Number(record.price).toFixed(2)}</p>;
        }
      },
    },

    {
      title: "尺码表",
      dataIndex: "size_image",
      key: "size_image",
      render: (size_image) => (
        <p className="w-8">{size_image === "" || size_image === null || size_image === undefined ? "无" : "有"}</p>
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="flex flex-col items-center gap-2">
            <Button type="primary">
              <Link href={`/admin/products/${record.id}`}>编辑</Link>
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
  return (
    <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      sticky={true}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      className="border overflow-hidden shadow-lg"
      loading={loading}
    />
  );
};

export default DataTable;
