// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: false,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              name: 'homepage',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/category',
              name: 'category',
              icon: 'crown',
              component: './category',
              // authority: ['admin'],
              // routes: [
              //   {
              //     path: '/category/game',
              //     name: 'game',
              //     icon: 'smile',
              //     component: './ListTableList/game',
              //     authority: ['admin'],
              //   },
              //   {
              //     path: '/category/software',
              //     name: 'software',
              //     icon: 'smile',
              //     component: './ListTableList/software',
              //     authority: ['admin'],
              //   },
              //   {
              //     path: '/category/article',
              //     name: 'article',
              //     icon: 'smile',
              //     component: './ListTableList/article',
              //     authority: ['admin'],
              //   },
              // ],
            },
            {
              name: 'product',
              icon: 'table',
              path: '/product',
              component: './product',
              // routes: [
              //   {
              //     path: '/product/game',
              //     name: 'game',
              //     icon: 'smile',
              //     component: './ListTableList/app',
              //   },
              //   {
              //     path: '/product/software',
              //     name: 'software',
              //     icon: 'smile',
              //     component: './ListTableList/app',
              //   },
              // ],
            },
            // {
            //   name: 'article',
            //   icon: 'table',
            //   path: '/article',
            //   routes: [
            //     {
            //       path: '/article/game',
            //       name: 'game',
            //       icon: 'smile',
            //       component: './ListTableList/app',
            //     },
            //     {
            //       path: '/article/software',
            //       name: 'software',
            //       icon: 'smile',
            //       component: './ListTableList/app',
            //     },
            //   ],
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
