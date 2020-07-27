import React, { useState } from 'react';
import { Upload, message, Form } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

export interface CoverImageProps {
  name: string;
  value?: UploadFile[];
}

const CoverImage: React.FC<CoverImageProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>(props.value || []);
  const [imageUrl, setImageUrl] = useState<string>(fileList[0]?.url || '');

  const getBase64 = (
    img: File | Blob,
    callback: (imageUrl: string | ArrayBuffer | null) => void,
  ) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅支持上传 JPG/PNG 图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片必须小于5MB');
    }
    return isJpgOrPng && isLt5M;
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as File | Blob, (imgUrl) => {
        setImageUrl(imgUrl as string);
        setLoading(false);
        setFileList([info.file]);
      });
    }
  };

  return (
    <Form.Item
      noStyle
      name={props.name}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (!e || !e.fileList) {
          return e;
        }

        return [e.fileList.pop()];
      }}
    >
      <Upload
        listType="picture-card"
        className="image-uploader"
        showUploadList={false}
        action="/api/upload"
        method="POST"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
      >
        {imageUrl ? (
          <img alt="封面图预览" src={imageUrl} style={{ width: '100%' }} />
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
};

export default CoverImage;
