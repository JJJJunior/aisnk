"use client";
import React from "react";
import { QRCode, Space } from "antd";

interface QrcodePageProps {
  url: string;
}

const QrcodePage: React.FC<QrcodePageProps> = ({ url }) => {
  return (
    <Space>
      <QRCode value={url || "-"} />
    </Space>
  );
};

export default QrcodePage;
