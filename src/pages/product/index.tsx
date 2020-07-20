import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, InputNumber, Form, Select, Popconfirm, Cascader } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { CascaderOptionType } from 'antd/lib/cascader';

import { queryRule as categoryQuery } from '@/pages/category/service';
import { TableListItem as categoryTableListItem } from '@/pages/category/data';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CoverImage from './components/CoverUpload';
import PicturesWall from './components/SlideUpload';

import { TableListItem, TableListParams } from './data';
import { queryRule, updateRule, addRule, removeRule } from './service';

const { Option } = Select;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    const [group, category] = fields.category || [];

    const slide: Array<string> = [];
    fields.image.fileList.map((value) => slide.push(value.response.data.file_name));

    await addRule({
      ...fields,
      image: fields.image.file.response.data.file_name,
      slide,
      group,
      category,
    });

    // await addRule({ ...fields });
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
const handleUpdate = async (fields: Partial<TableListItem>) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      id: fields.id,
      sort: fields.sort,
      title: fields.title,
      image: fields.image,
      category: fields.category,
      version: fields.version,
      language: fields.language,
      size: fields.size,
      intro: fields.intro,
      content: fields.content,
      hot: fields.hot,
      top: fields.top,
      url: fields.url,
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
const handleRemove = async (selectedRows: TableListItem[]) => {
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

const TableList: React.FC<{}> = () => {
  const [category, setCategory] = useState<CascaderOptionType[]>([
    {
      value: 1,
      label: '游戏',
      children: [],
    },
    {
      value: 2,
      label: '软件',
      children: [],
    },
  ]);

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

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await categoryQuery();

      data.forEach((element: categoryTableListItem) => {
        category[element.group - 1].children?.push({
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
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
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
      title: '分类',
      dataIndex: 'category_id',
      rules: [
        {
          required: true,
          message: '归属类别为必选项',
        },
      ],
      renderFormItem: () => <Cascader options={category} placeholder="请选择分类" />,
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
      renderFormItem: () => <CoverImage name="image" />,
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      renderFormItem: () => (
        <Form.Item name="sort">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      ),
    },
    {
      title: '版本号',
      dataIndex: 'version',
      hideInSearch: true,
    },
    {
      title: '语言',
      dataIndex: 'language',
      hideInSearch: true,
      renderFormItem: () => (
        <Form.Item name="language">
          <Select style={{ width: '100%' }} placeholder="请选择语言">
            {language.map((element) => {
              return (
                <Option key={element.value} value={element.value}>
                  {element.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      hideInSearch: true,
    },
    {
      title: '下载地址',
      dataIndex: 'url',
      hideInSearch: true,
    },
    {
      title: '简介',
      dataIndex: 'intro',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '详情',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '截图',
      dataIndex: 'slide',
      valueType: 'avatar',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: () => <PicturesWall name="image" id="slide" />,
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
      <ProTable<TableListItem, TableListParams>
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
          const [group, categoryID] = params.category || [];

          return queryRule({
            pageSize: params.pageSize,
            currentPage: params.current,
            filter: {
              title: params.title,
              group,
              category: categoryID,
              ...filter,
            },
            sorter,
          });
          // return queryRule({ ...data, sorter, filter })
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
        <ProTable<TableListItem, TableListItem>
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
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
