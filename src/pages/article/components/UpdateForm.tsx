import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, InputNumber } from 'antd';
import { LabeledValue } from 'antd/lib/select';

import SelectInput from './SelectInput';
import CoverImage from './CoverUpload';

import { ArticleEdit, ArticleItem } from '../data.d';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: Partial<ArticleItem>) => void;
  onSubmit: (values: Partial<ArticleEdit>) => void;
  updateModalVisible: boolean;
  values: Partial<ArticleItem>;
  category: LabeledValue[];
}
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<Partial<ArticleEdit>>({
    id: props.values.id,
    title: props.values.title,
    sort: props.values.sort,
    image:
      props.values.image !== undefined
        ? [
            {
              uid: props.values.image,
              name: props.values.image,
              status: 'done',
              size: 0,
              type: '',
              url: props.values.image,
            },
          ]
        : [],
    category_id: props.values.category_id,
    product_id: props.values.product_id,
    product: props.values.product,
    content: props.values.content,
  });

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    category,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({
        id: formVals.id,
        title: formVals.title,
        image: formVals.image,
        category_id: formVals.category_id,
        product_id: formVals.product_id,
        sort: formVals.sort,
        content: formVals.content,
      });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <FormItem
          name="image"
          label="封面图"
          rules={[
            {
              required: true,
              message: '请上传封面图',
            },
          ]}
        >
          <CoverImage name="image" />
        </FormItem>
      );
    }
    if (currentStep === 2) {
      return (
        <FormItem name="content" label="详情">
          <Input.TextArea style={{ width: '100%' }} />
        </FormItem>
      );
    }
    return (
      <>
        <FormItem
          name="title"
          label="名称"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="category_id"
          label="分类"
          rules={[
            {
              required: true,
              message: '归属类别为必选项',
            },
          ]}
        >
          <Select style={{ width: '100%' }} placeholder="请选择分类">
            {category.map((element) => {
              return (
                <Option key={element.value} value={element.value}>
                  {element.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem
          name="product_id"
          label="关联App"
          rules={[
            {
              required: true,
              message: '关联App别为必选项',
            },
          ]}
        >
          <SelectInput
            name="product_id"
            initValue={[{ label: formVals.product?.title, value: formVals.product_id as number }]}
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem
          name="sort"
          label="排序权重"
          rules={[
            {
              message: '请输入大于0的整数',
              pattern: /^[+]{0,1}\d+/,
              min: 0,
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
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
      title="编辑App"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
        <Step title="基本信息" />
        <Step title="图片上传" />
        <Step title="详情编辑" />
      </Steps>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          title: formVals.title,
          sort: formVals.sort,
          image: formVals.image,
          category_id: formVals.category_id,
          product_id: formVals.product_id,
          content: formVals.content,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
