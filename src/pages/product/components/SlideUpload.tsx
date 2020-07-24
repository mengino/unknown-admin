import React, { useState } from 'react';
import { Upload, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

export interface PicturesWallProps {
  name: string;
  num?: number;
  value?: string[];
}

const PicturesWall: React.FC<PicturesWallProps> = (props) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getBase64 = (file: File | Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    const preview: string | undefined =
      !file.url && !file.preview
        ? ((await getBase64(file.originFileObj as File | Blob)) as string | undefined)
        : file.preview;

    setPreviewImage(file.url || (preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || (file.url?.substring(file.url.lastIndexOf('/') + 1) as string));
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => setFileList(info.fileList);

  return (
    <div className="clearfix">
      <Form.Item
        noStyle
        name={props.name}
        getValueFromEvent={(e) => {
          if (!e || !e.fileList) {
            return e;
          }

          return e.fileList;
        }}
        // initialValue={fileList}
      >
        <Upload
          action="/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= (props.num || 0) ? null : (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">上传</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="封面图预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default PicturesWall;
