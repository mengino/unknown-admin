import React from 'react';
import { Upload, message, Form } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

function getBase64(img: File | Blob, callback: (imageUrl: string | ArrayBuffer | null) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('仅支持上传 JPG/PNG 图片!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片必须小于5MB');
  }
  return isJpgOrPng && isLt5M;
}

export default class CoverImage extends React.Component<{ name: string }> {
  state = {
    imageUrl: '',
    loading: false,
    fileList: [],
  };

  handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as File | Blob, (imageUrl) => {
        this.setState({
          fileList: [info.file],
          imageUrl,
          loading: false,
        });
      });
    }
  };

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Form.Item
        noStyle
        name={this.props.name}
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (!e || !e.fileList) {
            return e;
          }

          const { fileList } = e;

          return [fileList.pop()];
        }}
        initialValue={this.state.fileList}
      >
        <Upload
          listType="picture-card"
          className="image-uploader"
          showUploadList={false}
          action="/api/upload"
          method="POST"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          fileList={this.state.fileList}
        >
          {imageUrl ? (
            <img alt="封面图预览" src={imageUrl} style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
    );
  }
}
