<template>
  <el-submenu
    v-if="!menus.hide && menus.children && menus.children.length > 0"
    :index="menus.id + ''">
    <template slot="title">
      <ura-icon v-if="menus.icon" :name="menus.icon"></ura-icon>
      <span slot="title" class="el-menu-item-title">{{menus.name}}</span>
    </template>
    <sub-menu
      v-for="item in menus.children"
      :key="item.id"
      :menus="item"
      :menuEvent="menuEvent"></sub-menu>
  </el-submenu>
  <el-menu-item
    :index="menus.id + ''"
    v-else-if="!menus.hide && (!menus.children || (menus.children && menus.children.length === 0))"
    @click="menuEvent(menus.path, $route)">
    <ura-icon v-if="menus.icon" :name="menus.icon"></ura-icon>
    <span slot="title" class="el-menu-item-title">{{menus.name}}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './SubMenu.vue'
import UraIcon from '@/assets/package/icon'
export default {
  name: 'SubMenu',
  props: {
    menus: Object,
    menuEvent: {
      type: Function,
      default: () => {}
    }
  },
  components: { SubMenu, UraIcon },
  computed: {

  },
  methods: {

  }
}
</script>
