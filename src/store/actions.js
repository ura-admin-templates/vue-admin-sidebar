/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:55
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-22 16:11:49
 */

export default {
  collapseSidebar ({commit}, sidebarCollapse) {
    commit('COLLAPSE_SIDEBAR', sidebarCollapse)
  },
  updateDocumentClientHeight ({commit}, height) {
    commit('UPDATE_DOCUMENT_CLIENT_HEIGHT', height)
  }
}
