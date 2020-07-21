import React from 'react';
import { Upload, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { UploadFile } from 'antd/lib/upload/interface';

function getBase64(file: File | Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends React.Component<{ name: string; num: number }> {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: UploadFile) => {
    const preview: string | undefined =
      !file.url && !file.preview
        ? ((await getBase64(file.originFileObj as File | Blob)) as string | undefined)
        : file.preview;

    this.setState({
      previewImage: file.url || preview,
      previewVisible: true,
      previewTitle: file.name || file.url?.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }: { fileList: UploadFile[] }) => this.setState({ fileList });

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Form.Item
          noStyle
          name={this.props.name}
          getValueFromEvent={(e) => {
            if (!e || !e.fileList) {
              return e;
            }

            return e.fileList;
          }}
          initialValue={this.state.fileList}
        >
          <Upload
            action="/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= this.props.num ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="封面图预览" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

/* you can make up upload button and sample style by using stylesheets */
//   .ant-upload-select-picture-card i {
//     color: #999;
//     font-size: 32px;
//   }

//   .ant-upload-select-picture-card .ant-upload-text {
//     margin-top: 8px;
//     color: #666;
//   }
