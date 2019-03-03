<template>
  <el-menu
    class="ura-menu"
    :mode="menuMode"
    unique-opened
    :collapse="isCollapse"
    :collapse-transition="transition"
    :default-active="menuActive">
    <sub-menu
      v-for="menu in menuList"
      :key="menu.id"
      :menus='menu'
      :menuEvent="menuEvent">
    </sub-menu>
  </el-menu>
</template>

<script>
import SubMenu from './SubMenu.vue'
export default {
  name: 'UraMenu',
  props: {
    menuMode: {
      type: String,
      default: 'horizontal'
    },
    menuList: {
      type: Array,
      default: () => []
    },
    menuActive: {
      type: String,
      default: ''
    },
    menuEvent: {
      type: Function,
      default: () => {}
    },
    transition: {
      type: Boolean,
      default: false
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  components: { SubMenu },
}
</script>
