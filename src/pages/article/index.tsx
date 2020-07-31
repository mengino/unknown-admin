import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Select, Popconfirm } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { LabeledValue } from 'antd/lib/select';
import { UploadFile } from 'antd/lib/upload/interface';

import { queryRule as categoryQuery } from '@/pages/category/service';
import { CategoryItem } from '@/pages/category/data';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CoverImage from './components/CoverUpload';
import SelectInput from './components/SelectInput';
import RichTextEditor from './components/RichTextEditor';

import { ArticleSearch, ArticleAdd, ArticleEdit, ArticleItem } from './data';
import { queryRule, updateRule, addRule, removeRule } from './service';

const { Option } = Select;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: ArticleAdd) => {
  const hide = message.loading('正在添加');
  try {
    const [imageFile] = fields.image;

    await addRule({
      title: fields.title,
      image: imageFile.response?.data.file_name as string,
      category_id: fields.category_id,
      product_id: fields.product_id,
      sort: fields.sort,
      content: fields.content,
    });

    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: Partial<ArticleEdit>) => {
  console.log(fields);
  const hide = message.loading('正在配置');
  try {
    const [imageFile] = fields.image as UploadFile<{
      data: { file_name: string; url: string };
      code: number;
      message: string;
    }>[];

    // console.log(fields.content);

    await updateRule({
      id: fields.id,
      image: imageFile.response?.data.file_name || imageFile.name,
      category_id: fields.category_id,
      product_id: fields.product_id,
      sort: fields.sort,
      title: fields.title,
      content: fields.content,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: ArticleItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const ArticelList: React.FC<{}> = () => {
  const [category, setCategory] = useState<LabeledValue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await categoryQuery({ group: 3 });

      data.forEach((element: CategoryItem) => {
        category.push({
          value: element.id,
          label: element.name,
        });
      });

      setCategory(category);
    };

    fetchData();
  }, []);

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<ArticleItem[]>([]);
  const columns: ProColumns<ArticleItem>[] = [
    {
      title: '名称',
      dataIndex: 'title',
      rules: [
        {
          required: true,
          message: '名称为必填项',
        },
      ],
    },
    {
      title: '封面图',
      dataIndex: 'image',
      valueType: 'avatar',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '请上传封面图',
        },
      ],
      renderFormItem: (item) => <CoverImage name={item.dataIndex as string} />,
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      hideInTable: true,
      rules: [
        {
          required: true,
          message: '归属类别为必选项',
        },
      ],
      renderFormItem: () => (
        <Select style={{ width: '100%' }} placeholder="请选择分类">
          {category.map((element) => {
            return (
              <Option key={element.value} value={element.value}>
                {element.label}
              </Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        for (let i = 0; i < category.length; i += 1) {
          const { value, label } = category[i];
          if (value === record.category_id) {
            return label;
          }
        }

        return '';
      },
    },
    {
      title: '关联App',
      dataIndex: 'product_id',
      hideInTable: true,
      rules: [
        {
          required: true,
          message: '关联App别为必选项',
        },
      ],
      renderFormItem: (item) => (
        <SelectInput
          name={item.dataIndex as string}
          placeholder="请输入关联App"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '关联App',
      dataIndex: 'product_id',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => record.product.title,
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
      valueType: 'digit',
      hideInSearch: true,
      hideInForm: true,
      sorter: true,
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
      valueType: 'digit',
      hideInSearch: true,
      hideInTable: true,
      rules: [
        {
          message: '请输入大于0的整数',
          pattern: /^[+]{0,1}\d+/,
          min: 0,
        },
      ],
    },
    {
      title: '详情',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, config, form) => {
        return (
          <RichTextEditor
            name={item.dataIndex as string}
            value={config.value || ''}
            onChange={(v) => form.setFieldsValue({ content: v })}
          />
        );
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={async () => {
              await handleRemove([record]);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ArticleItem, ArticleSearch>
        headerTitle="App列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        options={false}
        request={(params, sorter, filter) => {
          return queryRule({
            title: params.title,
            category_id: params.category_id,
            product_id: params.product_id,
            pageSize: params.pageSize,
            currentPage: params.current,
            filter,
            sorter,
          });
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<ArticleItem, ArticleAdd>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reloadAndRest();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          category={category}
        />
      ) : null}
    </PageContainer>
  );
};

export default ArticelList;
