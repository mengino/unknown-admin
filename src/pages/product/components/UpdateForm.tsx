import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';

import LazyOptions from './LazyOptions';

import { TableListItem } from '../data';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: Partial<TableListItem>) => void;
  onSubmit: (values: Partial<TableListItem>) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const category = [
  {
    value: 1,
    label: '游戏',
    isLeaf: false,
  },
  {
    value: 2,
    label: '软件',
    isLeaf: false,
  },
];

export interface UpdateFormState {
  formVals: Partial<TableListItem>;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<Partial<TableListItem>>({
    id: props.values.id,
    title: props.values.title,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handle = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="title"
          label="名称"
          rules={[{ required: true, message: '请输入规则名称！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="intro"
          label="简介"
          rules={[{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </FormItem>
        <LazyOptions name="category" label="分类" placeholder="请选择分类" options={category} />
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handle()}>
          下一步
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="规则配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: formVals.id,
          // group: formVals.group,
          sort: formVals.sort,
          title: formVals.title,
          image: formVals.image,
          category: formVals.category,
          version: formVals.version,
          language: formVals.language,
          size: formVals.size,
          intro: formVals.intro,
          content: formVals.content,
          hot: formVals.hot,
          top: formVals.top,
          // slide: formVals.slide,
          url: formVals.url,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
