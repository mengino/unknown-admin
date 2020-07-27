import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Select, Popconfirm, Cascader } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { CascaderOptionType } from 'antd/lib/cascader';
import { UploadFile } from 'antd/lib/upload/interface';

import { queryRule as categoryQuery } from '@/pages/category/service';
import { CategoryItem } from '@/pages/category/data';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CoverImage from './components/CoverUpload';
import PicturesWall from './components/SlideUpload';

import { ProductSearch, ProductAdd, ProductEdit, ProductItem } from './data';
import { queryRule, updateRule, addRule, removeRule } from './service';

const { Option } = Select;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: ProductAdd) => {
  const hide = message.loading('正在添加');
  try {
    const [group, categoryID] = fields.category || [];
    const [imageFile] = fields.image;

    const image: string = imageFile.response?.data.file_name as string;
    const slide: string[] = [];
    fields.slide.map(
      (value) => value.response !== undefined && slide.push(value.response.data.file_name),
    );

    await addRule({
      title: fields.title,
      image,
      slide,
      group,
      category_id: categoryID,
      sort: fields.sort,
      size: fields.size,
      intro: fields.intro,
      content: fields.content,
      url: fields.url,
      version: fields.version,
      language: fields.language,
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
const handleUpdate = async (fields: Partial<ProductEdit>) => {
  const hide = message.loading('正在配置');
  try {
    const [group, categoryID] = fields.category || [];
    const [imageFile] = fields.image as UploadFile<{
      data: { file_name: string; url: string };
      code: number;
      message: string;
    }>[];

    const image: string = imageFile.response?.data.file_name || imageFile.name;
    const slide: string[] = [];
    fields.slide?.map((value) => slide.push(value.response?.data.file_name || value.name));

    await updateRule({
      id: fields.id,
      image,
      slide,
      group,
      category_id: categoryID,
      sort: fields.sort,
      title: fields.title,
      version: fields.version,
      language: fields.language,
      size: fields.size,
      intro: fields.intro,
      content: fields.content,
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
const handleRemove = async (selectedRows: ProductItem[]) => {
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

const ProductList: React.FC<{}> = () => {
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

      data.forEach((element: CategoryItem) => {
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
  const [selectedRowsState, setSelectedRows] = useState<ProductItem[]>([]);
  const columns: ProColumns<ProductItem>[] = [
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
      dataIndex: 'category',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: () => <Cascader options={category} placeholder="请选择分类" />,
    },
    {
      title: '分类',
      dataIndex: 'category',
      hideInSearch: true,
      hideInTable: true,
      rules: [
        {
          required: true,
          message: '归属类别为必选项',
        },
      ],
      renderFormItem: () => <Cascader options={category} placeholder="请选择分类" />,
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        for (let i = 0; i < category.length; i += 1) {
          const { value, label, children } = category[i];
          if (value === record.group && children !== undefined) {
            for (let j = 0; j < children.length; j += 1) {
              if (children[j].value === record.category_id) {
                return (
                  <>
                    {label} / {children[j].label}
                  </>
                );
              }
            }
          }
        }

        return '';
      },
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
      title: '版本号',
      dataIndex: 'version',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '语言',
      dataIndex: 'language',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: () => (
        <Select style={{ width: '100%' }} placeholder="请选择语言">
          {language.map((element) => {
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
      title: '大小',
      dataIndex: 'size',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '下载地址',
      dataIndex: 'url',
      hideInSearch: true,
      hideInTable: true,
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
      renderFormItem: (item) => <PicturesWall name={item.dataIndex as string} num={9} />,
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
      <ProTable<ProductItem, ProductSearch>
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
            title: params.title,
            group,
            category_id: categoryID,
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
        <ProTable<ProductItem, ProductAdd>
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

export default ProductList;
