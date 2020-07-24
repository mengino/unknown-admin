import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select, Steps, Cascader, InputNumber } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';

import CoverImage from './CoverUpload';
import PicturesWall from './SlideUpload';

import { ProductEdit, ProductItem } from '../data.d';

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: Partial<ProductItem>) => void;
  onSubmit: (values: Partial<ProductEdit>) => void;
  updateModalVisible: boolean;
  values: Partial<ProductItem>;
  category: CascaderOptionType[];
}
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [language] = useState([
    {
      value: 1,
      label: '简体中文',
    },
    {
      value: 2,
      label: '繁体中文',
    },
    {
      value: 3,
      label: '英文',
    },
    {
      value: 4,
      label: '日文',
    },
    {
      value: 5,
      label: '韩文',
    },
    {
      value: 6,
      label: '俄语',
    },
  ]);

  const [formVals, setFormVals] = useState<Partial<ProductEdit>>({
    id: props.values.id,
    title: props.values.title,
    sort: props.values.sort,
    // image: props.values.image,
    // slide: props.values.slide,
    category: [props.values.group as number, props.values.category_id as number],
    version: props.values.version,
    language: props.values.language,
    size: props.values.size,
    intro: props.values.intro,
    content: props.values.content,
    url: props.values.url,
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
      // handleUpdate({ ...formVals, ...fieldsValue });
      handleUpdate({
        id: formVals.id,
        title: formVals.title,
        image: formVals.image,
        slide: formVals.slide,
        category: formVals.category,
        sort: formVals.sort,
        size: formVals.size,
        intro: formVals.intro,
        content: formVals.content,
        url: formVals.url,
        version: formVals.version,
        language: formVals.language,
      });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
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
          <FormItem name="slide" label="截图">
            <PicturesWall name="slide" num={9} />
          </FormItem>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <FormItem name="intro" label="简介">
            <Input.TextArea style={{ width: '100%' }} />
          </FormItem>
          <FormItem name="content" label="详情">
            <Input.TextArea style={{ width: '100%' }} />
          </FormItem>
        </>
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
          name="category"
          label="分类"
          rules={[
            {
              required: true,
              message: '归属类别为必选项',
            },
          ]}
        >
          <Cascader options={category} placeholder="请选择分类" />
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
        <FormItem name="version" label="版本号">
          <Input style={{ width: '100%' }} />
        </FormItem>
        <FormItem name="language" label="语言">
          <Select style={{ width: '100%' }} placeholder="请选择语言">
            {language.map((element) => {
              return (
                <Option key={element.value} value={element.value}>
                  {element.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem name="size" label="大小">
          <Input style={{ width: '100%' }} />
        </FormItem>
        <FormItem name="url" label="下载地址">
          <Input style={{ width: '100%' }} />
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
          slide: formVals.slide,
          category: formVals.category,
          version: formVals.version,
          language: formVals.language,
          size: formVals.size,
          intro: formVals.intro,
          content: formVals.content,
          url: formVals.url,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
