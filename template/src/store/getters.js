/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:28
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-22 18:29:14
 */

export default {
  token: state => state.user.token,
  uid: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  userInfo: state => state.user.userInfo,
  navbarMenus: state => state.menu.navbarMenus,
  sysMenuList: state => state.menu.sysMenuList,
  sidebarMenuList: state => state.menu.sidebarMenuList,
  sidebarCollapse: state => state.sidebarCollapse,
  tabsNavList: state => state.tab.tabsNavList,
  tabsActiveName: state => state.tab.tabsActiveName,
  documentClientHeight: state => state.documentClientHeight
}
