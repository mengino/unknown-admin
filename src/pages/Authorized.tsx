import React from 'react';
import { Redirect, connect, ConnectProps } from 'umi';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';
import { ConnectState, UserModelState } from '@/models/connect';

interface AuthComponentProps extends ConnectProps {
  currentUser: UserModelState['data'];
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  currentUser,
}) => {
  const { routes = [] } = route;
  const isLogin = currentUser && currentUser.user_id;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.data,
}))(AuthComponent);
