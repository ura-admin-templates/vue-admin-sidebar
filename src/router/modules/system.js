/*
 * @Author: eamiear
 * @Date: 2019-02-20 15:14:15
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-25 15:45:03
 */


export default [
  {
    name: '/system/theme.html',
    path: '/system/theme.html',
    desc: '系统主题',
    component: () => import('views/system/theme.vue'),
    meta: {isTab: true}
  }, {
    name: '/system/message.html',
    path: '/system/message.html',
    desc: '系统消息',
    component: () => import('views/system/message.vue'),
    meta: {isTab: true}
  }
]
