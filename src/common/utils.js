/*
 * @Author: eamiear
 * @Date: 2019-02-08 13:44:23
 * @Last Modified by:   eamiear
 * @Last Modified time: 2019-02-08 13:44:23
 */

export function hasPermission (path, menuNavList) {
  let temp = []
  for (let i = 0; i < menuNavList.length; i++) {
    if (menuNavList[i].children && menuNavList[i].children.length >= 1) {
      temp = temp.concat(menuNavList[i].children)
    } else if (menuNavList[i].path === path) {
      return true
    }
  }
  return temp.length >= 1 ? hasPermission(path, temp) : false
}
