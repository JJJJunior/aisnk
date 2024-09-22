import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { ImageType } from "../lib/types";
import { UploadFile } from "antd/lib/upload/interface";

interface UploadProps {
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
}
const UploadImages: React.FC<UploadProps> = ({ setImages }) => {
  const onChange = ({ file }: { file: UploadFile }) => {
    file.status === "done" &&
      setImages((prev) => {
        return [...prev, { id: file.uid, url: file.response.url }];
      });
  };
  const props = {
    maxCount: 12,
    withCredentials: true,
    multiple: true,
    action: "/api/admin/upload",
  };

  return (
    <Upload {...props} onChange={onChange}>
      <Button type="primary" onClick={(evt) => evt.preventDefault()} icon={<UploadOutlined />}>
        点击上传最多12张
      </Button>
    </Upload>
  );
};

export default UploadImages;
