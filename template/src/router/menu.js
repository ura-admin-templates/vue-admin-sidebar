export const operatorMenus = [
  {
    name: '发布商铺',
    path: '/operator/shops/projectList.html'
  }, {
    name: '个人中心',
    path: '/operator/usercenter/password.html'
  }, {
    name: '配置信息',
    children: [
      {
        name: '系统配置',
        path: '/operator/usercenter/password.html'
      }
    ]
  }
]

export const merchantMenus = [
  {
    name: '商铺库',
    path: '/merchant/store/list.html'
  }, {
    name: '品牌库',
    path: '/merchant/brand/list.html'
  }, {
    name: '发布品牌',
    path: '/merchant/brand/publish.html'
  }, {
    name: '个人中心',
    path: '/operator/usercenter/password.html'
  }
]

export const systemtMenus = [
  {
    name: '系统主题',
    path: '/system/theme.html',
    meta: {isTab: true}
  }, {
    name: '系统消息',
    path: '/system/message.html',
    meta: {isTab: true}
  }
]

export const sidebartMenus = [
  {
    id: 1,
    name: '首页',
    path: '/dashboard'
  },
  {
    id: 2,
    name: '系统主题',
    icon: 'circle-o',
    path: '/system/theme.html'
  }, {
    id: 3,
    name: '商铺库',
    icon: 'circle-o',
    path: '/merchant/store/list.html'
  }, {
    id: 4,
    name: '品牌库',
    icon: 'cogs',
    path: '/merchant/brand/list.html'
  }, {
    id: 5,
    name: '发布品牌',
    icon: 'list',
    path: '/merchant/brand/publish.html'
  }, {
    id: 6,
    name: '个人中心',
    icon: 'user',
    path: '/operator/usercenter/password.html'
  }, {
    id: 7,
    name: '发布商铺',
    icon: 'list',
    path: '/operator/shops/projectList.html'
  }, {
    id: 8,
    name: '配置信息',
    icon: 'cogs',
    children: [
      {
        id: 9,
        name: '系统配置',
        path: '/system/message.html'
      }
    ]
  }, {
    id: 98,
    name: '401',
    path: '/401',
    hide: true
  }, {
    id: 99,
    name: '404',
    path: '/404',
    hide: true
  }
]
