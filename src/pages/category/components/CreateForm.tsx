import React from 'react';
import { Modal } from 'antd';
import styles from '../index.less';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="新建分类"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      className={styles.createForm}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
