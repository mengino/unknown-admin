import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, InputNumber, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { queryRule, updateRule, addRule, removeRule } from './service';

const FormItem = Form.Item;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
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
      name: fields.name,
      group: fields.group,
      sort: fields.sort
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '分类名称为必填项',
        },
      ],
    },
    {
      title: '归属类别',
      dataIndex: 'group',
      valueEnum: new Map([
        [1, { text: '游戏', status: 'Error' }],
        [2, { text: '软件', status: 'Success' }],
        [3, { text: '文章', status: 'Processing' }],
      ]),
      rules: [
        {
          required: true,
          message: '分类为必选项'
        }
      ]
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      renderFormItem: () => (
        <FormItem
          name="sort"
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </FormItem>
      )
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      defaultSortOrder: 'descend'
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
          <a onClick={async () => {
              if (confirm('确定要删除吗？')) {
                await handleRemove([record]);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest();
              }
            }}
          >
              删除
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="分类列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        options={false}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
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
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadAndRest();
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
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
