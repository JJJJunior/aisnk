import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";

interface UploadImagesProps {
  setSizeImage: React.Dispatch<React.SetStateAction<string>>;
}

const UploadOne: React.FC<UploadImagesProps> = ({ setSizeImage }) => {
  const onChange = ({ file }: { file: UploadFile }) => {
    file.status === "done" && setSizeImage(file.response.url);
  };
  const props = {
    maxCount: 12,
    withCredentials: true,
    multiple: true,
    action: "/api/admin/upload",
  };

  return (
    <Upload {...props} onChange={onChange}>
      <Button type="primary" ghost onClick={(evt) => evt.preventDefault()} icon={<UploadOutlined />}>
        点击上传最多1张
      </Button>
    </Upload>
  );
};

export default UploadOne;
