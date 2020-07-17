// import { Alert, Checkbox } from 'antd';
// import React, { useState } from 'react';
// import { Link, connect, Dispatch } from 'umi';

import { Alert } from 'antd';
import React from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';

const { UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting, dispatch } = props;
  const { code } = userLogin;
  // const [autoLogin, setAutoLogin] = useState(true);

  const handleSubmit = (values: LoginParamsType) => {
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm onSubmit={handleSubmit}>
        <div>
          {(code !== undefined && code !== 0) && !submitting && (
            <LoginMessage content="账户或密码错误" />
          )}

          <UserName
            name="nickname"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </div>
        {/* <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div> */}
        <Submit loading={submitting}>登录</Submit>
        {/* <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div> */}
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
