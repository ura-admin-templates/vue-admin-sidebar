/*
 * @Author: eamiear
 * @Date: 2019-02-19 10:38:07
 * @Last Modified by:   eamiear
 * @Last Modified time: 2019-02-19 10:38:07
 */

import { AUTHORITY_KEY, USER_TOKEN_KEY, USER_ID_KEY } from '@/common/constants'
const Cacher = {
  set (key, value) {
    localStorage.setItem(key, value)
  },
  get (key) {
    return localStorage.getItem(key)
  },
  remove (key) {
    return localStorage.removeItem(key)
  },
  clear () {
    return localStorage.clear()
  }
}

const storageMap = {
  'set-token': token => Cacher.set(USER_TOKEN_KEY, token),
  'get-token': () => Cacher.get(USER_TOKEN_KEY) || '',
  'remove-token': () => Cacher.remove(USER_TOKEN_KEY),
  'get-uid': () => Cacher.get(USER_ID_KEY),
  'set-uid': uid => Cacher.set(USER_ID_KEY, uid),
  'remove-uid': () => Cacher.remove(USER_ID_KEY),
  'set-auth': auth => Cacher.set(AUTHORITY_KEY, auth),
  'get-auth': () => Cacher.get(AUTHORITY_KEY),
  'remove-auth': () => Cacher.remove(AUTHORITY_KEY)
}

const Storage = {
  set (key, value) {
    storageMap[`set-${key}`].call(this, value)
  },
  get (key) {
    return storageMap[`get-${key}`].call(this)
  },
  remove (key) {
    storageMap[`remove-${key}`].call()
  },
  clearAuth () {
    this.remove('token')
    this.remove('uid')
    this.remove('auth')
  }
}

export default Storage
