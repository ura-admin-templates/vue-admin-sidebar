<template>
  <section class="app-wrapper" :class="sidebarCollapseClass">
    <aside class="app-sidebar">
      <brand></brand>
      <sidebar-menu></sidebar-menu>
    </aside>
    <section class="app-body" :style="appBodyStyles">
      <navbar class="app-header"></navbar>
      <article class="app-main"  v-if="!isTabView" :style="appMainStyles">
        <keep-alive v-if="isKeepAlive">
           <router-view/>
        </keep-alive>
         <router-view v-else/>
      </article>
      <tabs-view class="app-main" v-else/>
    </section>
  </section>
</template>

<script>
import Brand from '@/views/layout/Brand.vue'
import SidebarMenu from '@/views/layout/SidebarMenu.vue'
import Navbar from '@/views/layout/Navbar.vue'
import TabsView from '@/components/Layout/TabsView.vue'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'layout',
  components: {
    Brand,
    SidebarMenu,
    Navbar,
    TabsView
  },
  created () {
    // this.getUserInfo()
  },
  mounted () {
    this.resetDocumentClientHeight()
    window.onresize = () => {
      this.resetDocumentClientHeight()
    }
  },
  computed: {
    ...mapGetters([
      'sidebarCollapse',
      'documentClientHeight'
    ]),
    sidebarCollapseClass () {
      return {
        'app-sidebar--collapse': this.sidebarCollapse
      }
    },
    appWrapperStyles () {
      return {}
    },
    appBodyStyles () {
      return [{ 'minHeight': `${this.documentClientHeight}px` }, { 'height': `${this.documentClientHeight}px` }]
    },
    appMainStyles () {
      let height = this.documentClientHeight
      height -= 50 // navbar
      return [{
        'minHeight': `${height}px`
      }, {
        'height': `${height}px`
      }]
    },
    isTabView () {
      return this.$route.meta && this.$route.meta.isTab
    },
    isKeepAlive () {
      return this.$route.meta && this.$route.meta.isKeepAlive
    }
  },
  methods: {
    resetDocumentClientHeight () {
      this.$store.dispatch('updateDocumentClientHeight', document.documentElement.clientHeight)
    },
    getUserInfo () {
      this.$store.dispatch('getUserInfo')
    }
  }
}
</script>
