<template>
  <div class="tabs-container">
    <el-tabs
      class="tabs-wrapper"
      v-model="tabActiveName">
      <el-tab-pane
        v-for="tab in tabsNavList"
        :key="tab.name"
        :name="tab.name">

        <el-tag
          type="info"
          slot="label"
          @click="selectedTabHandler(tab)"
          :closable="isTabClosable(tab.name)"
          @close.prevent="closeTabsActive(tab.name)">
          <i :class="{'info': tab.name === tabActiveName, 'dot': true}"></i>
          {{tab.title}}
        </el-tag>

        <article :style="contentViewStyles(tab)" class="tabs-container-content">
          <iframe
            :id="`tab_${tab.id}`"
            v-if="tab.static"
            :src="tab.path"
            width="100%" height="100%" frameborder="0" scrolling="yes">
          </iframe>
          <keep-alive v-else>
            <router-view v-if="tab.name === tabActiveName" :key="$route.fullPath"></router-view>
          </keep-alive>
        </article>
      </el-tab-pane>
    </el-tabs>
    <el-dropdown v-if="isEmptyTabsNavList" class="tab-tools" @command="toolsCommandHandler" :show-timeout="0" trigger="click">
      <el-button type="primary">
        标签选项<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeTabsActive">关闭当前标签页</el-dropdown-item>
        <el-dropdown-item command="closeTabsLeft">关闭左边标签页</el-dropdown-item>
        <el-dropdown-item command="closeTabsRight">关闭右边标签页</el-dropdown-item>
        <el-dropdown-item command="closeTabsOther">关闭其他标签页</el-dropdown-item>
        <el-dropdown-item command="clearTabs">关闭全部标签页</el-dropdown-item>
        <el-dropdown-item command="refreshTabsActive">刷新当前标签页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import { DASHBOARD_HOME } from '@/common/constants'
export default {
  name: 'TabsView',
  data () {
    return {

    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'documentClientHeight',
      'tabsNavList',
      'tabsActiveName'
    ]),
    isEmptyTabsNavList () {
      return !!this.tabsNavList.length
    },
    tabActiveName: {
      get () {
        return this.tabsActiveName
      },
      set (name) {
        this.$store.dispatch('updateTabsActiveName', name)
      }
    }
  },
  methods: {
    contentViewStyles (tab) {
      let height = this.documentClientHeight
      height -= 50 // content-wrapper：navbar
      height -= 50 // content-wrapper：el-tabs__header
      height += 'px'
      return [
        tab.type === 'iframe' ? { height } : { minHeight: height, height }
      ]
    },
    isTabActive (tabName) {
      return tabName === this.$route.name
    },
    isTabClosable (tabName) {
      return tabName !== DASHBOARD_HOME
    },
    toolsCommandHandler (command) {
      const commander = {
        'closeTabsActive': this.closeTabsActive,
        'closeTabsLeft': this.closeTabsLeft,
        'closeTabsRight': this.closeTabsRight,
        'closeTabsOther': this.closeTabsOther,
        'clearTabs': this.clearTabs,
        'refreshTabsActive': this.refreshTabsActive
      }
      commander[command].call(this)
    },
    closeTabsActive (v) {
      const tabName = v || this.tabActiveName
      return this.$store.dispatch('delTabsNavList', tabName).then(tabs => {
        if (this.isTabActive(tabName)) {
          const latestView = tabs.slice(-1)[0]
          latestView && this.$router.push(latestView, () => {
            this.tabActiveName = this.$route.name
          })
        }
      })
    },
    closeTabsLeft (v = this.tabActiveName) {
      this.$store.dispatch('closeLeftTabsNavList', v)
    },
    closeTabsRight (v = this.tabActiveName) {
      this.$store.dispatch('closeRightTabsNavList', v)
    },
    closeTabsOther (v = this.tabActiveName) {
      this.$store.dispatch('closeOtherTabsNavList', v)
    },
    refreshTabsActive () {
      const tempTabName = this.tabActiveName
      this.closeTabsActive(tempTabName).then(() => {
        this.$router.push({path: tempTabName})
      })
    },
    clearTabs () {
      this.$confirm('是否关闭全部?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('clearTabsNavList')
        this.$router.push({path: DASHBOARD_HOME})
      }).catch(() => {
      })
    },
    selectedTabHandler (tab) {
      tab = this.tabsNavList.find(item => item.name === tab.name)
      if (!isEmpty(tab)) {
        this.$router.push(tab)
      }
    }
  },
  watch: {
    tabsNavList (tabs) {
      if (tabs.length <= 0) {
        this.$store.dispatch('updateTabsActiveName', '')
        this.$router.push({ path: DASHBOARD_HOME })
      }
    }
  }
}
</script>
