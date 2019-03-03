import {
  UPDATE_TABS_ACTIVE_NAME,
  CLEAR_TABS_NAV_LIST,
  ADD_TABS_NAV_LIST,
  DEL_TABS_NAV_LIST,
  CLOSE_OTHER_TABS_NAV_LIST,
  CLOSE_LEFT_TABS_NAV_LIST,
  CLOSE_RIGHT_TABS_NAV_LIST
} from '../mutation-types'
import { DASHBOARD_HOME } from '@/common/constants'

const HOME_DASHBOARD = DASHBOARD_HOME || '/dashboard'

export default {
  state: {
    tabsActiveName: '',
    tabsNavList: []
  },
  mutations: {
    [UPDATE_TABS_ACTIVE_NAME] (state, tabsActiveName) {
      state.tabsActiveName = tabsActiveName
    },
    [CLEAR_TABS_NAV_LIST] (state) {
      state.tabsNavList = state.tabsNavList.filter(tab => tab.name === HOME_DASHBOARD)
    },
    [ADD_TABS_NAV_LIST] (state, tab) {
      tab.name === HOME_DASHBOARD ? state.tabsNavList.unshift(tab) : state.tabsNavList.push(tab)
      // state.tabsNavList.push(tab)
    },
    [DEL_TABS_NAV_LIST] (state, tabName) {
      if (tabName === HOME_DASHBOARD) return
      state.tabsNavList = state.tabsNavList.filter(tab => tab.name !== tabName)
    },
    [CLOSE_OTHER_TABS_NAV_LIST] (state, tabActiveName) {
      state.tabsNavList = state.tabsNavList.filter(tab => tab.name === tabActiveName || tab.name === HOME_DASHBOARD)
    },
    [CLOSE_LEFT_TABS_NAV_LIST] (state, tabActiveName) {
      if (!tabActiveName) return
      const index = state.tabsNavList.findIndex(v => v.name === tabActiveName)
      state.tabsNavList.splice(1, index - 1)
    },
    [CLOSE_RIGHT_TABS_NAV_LIST] (state, tabActiveName) {
      if (!tabActiveName) return
      const index = state.tabsNavList.findIndex(v => v.name === tabActiveName)
      state.tabsNavList.splice(index + 1, state.tabsNavList.length)
    }
  },
  actions: {
    addTabsNavList ({commit, state}, tab) {
      return new Promise(resolve => {
        commit('ADD_TABS_NAV_LIST', tab)
        resolve([...state.tabsNavList])
      })
    },
    clearTabsNavList ({commit}) {
      commit('CLEAR_TABS_NAV_LIST')
    },
    delTabsNavList ({commit, state}, tabActiveName) {
      return new Promise(resolve => {
        commit('DEL_TABS_NAV_LIST', tabActiveName)
        resolve([...state.tabsNavList])
      })
    },
    closeOtherTabsNavList ({commit, state}, tabActiveName) {
      return new Promise(resolve => {
        commit('CLOSE_OTHER_TABS_NAV_LIST', tabActiveName)
        resolve([...state.tabsNavList])
      })
    },
    closeLeftTabsNavList ({commit, state}, tabActiveName) {
      return new Promise(resolve => {
        commit('CLOSE_LEFT_TABS_NAV_LIST', tabActiveName)
        resolve([...state.tabsNavList])
      })
    },
    closeRightTabsNavList ({commit, state}, tabActiveName) {
      return new Promise(resolve => {
        commit('CLOSE_RIGHT_TABS_NAV_LIST', tabActiveName)
        resolve([...state.tabsNavList])
      })
    },
    updateTabsActiveName ({commit}, tabActiveName) {
      commit('UPDATE_TABS_ACTIVE_NAME', tabActiveName)
    }
  }
}
