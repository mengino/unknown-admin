import React from 'react';
import { Upload, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends React.Component<{ id: string; name: string }> {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Form.Item name={this.props.name}>
          <Upload
            id={this.props.id}
            action="/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img style={{ width: '100%' }} src={previewImage} />
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
