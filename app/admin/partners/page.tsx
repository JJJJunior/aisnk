"use client";
import React, { useRef, useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Input, Space, Divider } from "antd";
import axios from "axios";
import QrcodePage from "@/app/components/Qrcode";
import Highlighter from "react-highlight-words";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { InputRef, TableColumnType, TableColumnsType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PartnerType } from "@/app/lib/types";

type DataIndex = keyof PartnerType;

const page = () => {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<PartnerType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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

  //在nextjs中是通过url路径进行缓存的，当请求的路径没有发生改变，都是默认从缓存获取。
  const fetchPartners = async () => {
    setBtnLoading(true);
    const res = await fetch(`/api/admin/partners`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    setBtnLoading(false);
    setLoading(false);
    setPartners(data.data);
  };
  // console.log(partners);

  const cancel_customer = async (record: PartnerType) => {
    try {
      const res = await axios.put(`/api/admin/customers/cancel/${record.id}`);
      if (res.status === 200) {
        message.success("取消合作商成功");
        fetchPartners();
      }
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const columns: TableColumnsType<PartnerType> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "推荐码（勿多次生成）",
      dataIndex: "referralCode",
      key: "referralCode",
      ...getColumnSearchProps("referralCode"),
    },
    {
      title: "推荐链接（勿多次生成）",
      dataIndex: "referralCode",
      key: "referralCode",
      render: (referralCode: string) =>
        referralCode ? (
          <div>
            <QrcodePage url={`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${referralCode}`} />
            <div>{`${window.location.href.split("/").slice(0, 3).join("/")}/web?ref=${referralCode}`}</div>
          </div>
        ) : (
          ""
        ),
    },
    {
      title: "推广注册数",
      dataIndex: "refCount",
      key: "refCount",
      defaultSortOrder: "descend",
      sorter: (a: PartnerType, b: PartnerType) => (a.refCount ?? 0) - (b.refCount ?? 0),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "促成订单金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => (a.totalAmount ?? 0) - (b.totalAmount ?? 0),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: PartnerType) =>
        partners.length >= 1 ? (
          <div className="flex flex-col items-center gap-2">
            <Popconfirm title="取消该合作商?" onConfirm={() => cancel_customer(record)}>
              <Button type="primary" danger size="small">
                取消该合作商
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">合作商管理</div>
      <Divider />
      <div className="mb-2">
        <Button type="primary" onClick={fetchPartners} loading={btnLoading}>
          {btnLoading ? "Loading..." : "同步最新数据"}
        </Button>
      </div>
      <Table
        dataSource={partners}
        columns={columns}
        bordered
        showSorterTooltip={{ target: "sorter-icon" }}
        rowKey="id"
        size="small"
        loading={loading}
      />
    </div>
  );
};

export default page;
