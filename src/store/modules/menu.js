import {
  SET_MENU_NAV_LIST,
  SET_SYS_MENU_LIST,
  UPDATE_MENU_NAV_ACTIVE_NAME,
  SET_SIDEBAR_MENU_LIST,
  UPDATE_SIDEBAR_MENU_ACTIVE_NAME
} from '../mutation-types'

// import Storage from '@/common/cache'
// import SysMenuAPI from '@/api/menu'
import { operatorMenus, merchantMenus, systemtMenus, sidebartMenus } from '@/router/menu'
import store from '@/store'

const menu = {
  state: {
    menuNavActiveName: '',
    navbarMenus: [],
    sysMenuList: [],
    sidebarMenuActiveName: '',
    sidebarMenuList: []
  },
  mutations: {
    [SET_MENU_NAV_LIST] (state, navbarMenus) {
      state.navbarMenus = navbarMenus
    },
    [SET_SYS_MENU_LIST] (state, sysMenuList) {
      state.sysMenuList = sysMenuList
    },
    [UPDATE_MENU_NAV_ACTIVE_NAME] (state, menuNavActiveName) {
      state.menuNavActiveName = menuNavActiveName
    },
    [SET_SIDEBAR_MENU_LIST] (state, sidebarMenuList) {
      state.sidebarMenuList = sidebarMenuList
    },
    [UPDATE_SIDEBAR_MENU_ACTIVE_NAME] (state, sidebarMenuActiveName) {
      state.sidebarMenuActiveName = sidebarMenuActiveName
    }
  },
  actions: {
    generateSidebarMenu ({ commit }) {
      return new Promise(resolve => {
        store.dispatch('getUserInfo').then(userInfo => {
          userInfo.type = 1
          commit('SET_SIDEBAR_MENU_LIST', sidebartMenus)
          resolve(userInfo)
        }).catch(() => {
          commit('SET_SIDEBAR_MENU_LIST', [])
        })
      })
    },
    generateNavibarMenu ({ commit }) {
      return new Promise(resolve => {
        store.dispatch('getUserInfo').then(userInfo => {
          userInfo.type = 1
          commit('SET_MENU_NAV_LIST', userInfo.type === 1 ? merchantMenus : operatorMenus)
          resolve(userInfo)
        }).catch(() => {
          commit('SET_MENU_NAV_LIST', [])
        })
      })
    },
    generatesystemMenu ({ commit }) {
      return new Promise(resolve => {
        commit('SET_SYS_MENU_LIST', systemtMenus)
        resolve(systemtMenus)
      })
    },
    updateMenuNavActiveName ({ commit }, activeName) {
      commit('UPDATE_MENU_NAV_ACTIVE_NAME', activeName)
    },
    updateSidebarMenuActiveName ({ commit }, activeName) {
      commit('UPDATE_SIDEBAR_MENU_ACTIVE_NAME', activeName)
    }
  }
}

export default menu
