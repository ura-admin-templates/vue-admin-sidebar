/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:06:02
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-26 09:36:58
 */

import common from './common'
import operator from './operator'
import merchants from './merchants'
import system from './system'
const menuRoutes = {
  name: 'home',
  path: '/',
  desc: '首页',
  component: () => import('views/layout/Layout.vue'),
  redirect: { path: '/dashboard' },
  children: [{
    name: '/dashboard',
    path: '/dashboard',
    desc: '首页面板',
    component: () => import('views/dashboard/index.vue'),
    meta: {isTab: true}
  },
  ...operator,
  ...merchants,
  ...system,
  ...common
  ]
}

export default [
  {
    name: 'login',
    path: '/login',
    desc: '登录页',
    component: () => import('views/login/index.vue')
  },
  menuRoutes,
  {
    path: '*',
    redirect: '/404'
  }
]
