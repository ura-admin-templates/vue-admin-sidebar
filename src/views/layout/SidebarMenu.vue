<template>
  <ura-sidebar-menu
    class="sidebar-menu"
    menuMode="vertical"
    :isCollapse="sidebarCollapse"
    :menuList="sidebarMenuList"
    :menuActive="sidebarMenuActiveName"
    :menuEvent="menuEvent">
  </ura-sidebar-menu>
</template>

<script>
import UraSidebarMenu from '@/components/Layout/Menu.vue'
import { mapGetters } from 'vuex'
import isEmpty from 'lodash/isEmpty'
export default {
  name: 'NavMenu',
  data () {
    return {

    }
  },
  components: {UraSidebarMenu},
  computed: {
    ...mapGetters([
      'sidebarMenuList',
      'tabsNavList',
      'sidebarCollapse'
    ]),
    sidebarMenuActiveName: {
      get () {
        return this.$store.state.menu.sidebarMenuActiveName
      },
      set (name) {
        this.$store.dispatch('updateSidebarMenuActiveName', name)
      }
    }
  },
  created () {
    this.$store.dispatch('generateSidebarMenu').then(() => {
      this.routerHandler(this.$route)
    })
  },
  watch: {
    $route: 'routerHandler'
  },
  methods: {
    menuEvent (path, router) {
      const routeName = path
      if (/\S/.test(routeName)) {
        this.$router.push({ name: routeName, query: { s: Date.now() }, params: { s: Date.now() } }, to => {
          to.matched && to.matched.length === 0 && this.$router.push({ path: '/404' })
        })
      }
    },
    routerHandler (route) {
      // if (!hasPermission(route.name, this.sidebarMenus)) {
      //   return this.$router.push({path: '/401'})
      // }
      if (route.meta && route.meta.isTab) {
        let tab = this.tabsNavList.filter(tabItem => tabItem.name === route.name)[0] || {}
        if (isEmpty(tab)) {
          const menuNav = this.getMenuNavByRouteName(route.name, this.sidebarMenuList)
          if (!isEmpty(menuNav)) {
            tab = {
              id: menuNav.id,
              name: route.name,
              title: menuNav.name,
              static: route.meta.static,
              path: menuNav.path,
              query: route.query,
              params: route.params
            }
            this.$store.dispatch('addTabsNavList', tab)
          } else {
            return console.error('没有可用tab标签页!')
          }
        }
        this.sidebarMenuActiveName = `${tab.id}`
        this.$store.dispatch('updateTabsActiveName', `${route.name}`)
      }
    },
    getMenuNavByRouteName (routeName, menuNavList) {
      let temp = []
      for (let i = 0; i < menuNavList.length; i++) {
        if (menuNavList[i].children && menuNavList[i].children.length >= 1) {
          temp = temp.concat(menuNavList[i].children)
        } else if (menuNavList[i].path === routeName) {
          return menuNavList[i]
        }
      }
      return temp.length >= 1 ? this.getMenuNavByRouteName(routeName, temp) : []
    }
  },
}
</script>

<style scoped>

</style>
