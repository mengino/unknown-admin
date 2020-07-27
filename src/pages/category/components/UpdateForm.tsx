import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Modal, Select } from 'antd';

import { CategoryEdit, CategoryItem } from '../data';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: Partial<CategoryItem>) => void;
  onSubmit: (values: Partial<CategoryEdit>) => void;
  updateModalVisible: boolean;
  values: Partial<CategoryItem>;
}
const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<Partial<CategoryEdit>>({
    id: props.values.id,
    name: props.values.name,
    group: props.values.group,
    sort: props.values.sort,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '分类名称为必填项' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="group" label="归属类别">
          <Select style={{ width: '100%' }}>
            <Option value={1}>游戏</Option>
            <Option value={2}>软件</Option>
            <Option value={3}>文章</Option>
          </Select>
        </FormItem>
        <FormItem
          name="sort"
          label="排序权重"
          rules={[{ required: true, message: '请填写大于0的数字', type: 'number' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="编辑分类"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: formVals.id,
          name: formVals.name,
          group: formVals.group,
          sort: formVals.sort,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
