import { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers } from '@/services/user';
import BaseModel from './base';

// export interface CurrentUser {
//   avatar?: string;
//   name?: string;
//   title?: string;
//   group?: string;
//   signature?: string;
//   tags?: {
//     key: string;
//     label: string;
//   }[];
//   userid?: number;
//   totalCount?: number;
//   unreadCount?: number;
// }

export interface UserModelState extends BaseModel {
  // currentUser?: CurrentUser;
  data?: {
    avatar?: string;
    name?: string;
    user_id?: number;
    totalCount?: number;
    unreadCount?: number;
  };
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    data: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        data: action.payload.data || {},
      };
    },
    changeNotifyCount(
      state = {
        data: {},
      },
      action,
    ) {
      return {
        ...state,
        data: {
          ...state.data,
          notifyCount: action.payload.data.totalCount,
          unreadCount: action.payload.data.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
