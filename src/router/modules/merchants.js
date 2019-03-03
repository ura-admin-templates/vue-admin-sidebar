/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-25 11:34:56
 */

export default [
  {
    name: '/merchant/store/list.html',
    path: '/merchant/store/list.html',
    desc: '商铺库',
    component: () => import('views/merchant/store/list.vue'),
    meta: {isTab: true}
  }, {
    name: '/merchant/brand/list.html',
    path: '/merchant/brand/list.html',
    desc: '品牌库',
    component: () => import('views/merchant/brand/list.vue'),
    meta: {isTab: true}
  }, {
    name: '/merchant/brand/publish.html',
    path: '/merchant/brand/publish.html',
    desc: '发布品牌',
    component: () => import('views/merchant/brand/publish.vue'),
    meta: {isTab: true}
  }
]
