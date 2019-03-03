<template>
  <div class="form-page-container">
    <div class="main-top">
      <p class="header-title">{{headTitle}}</p>
      <el-button size="small" v-if="showCancelBtn" @click="cancel(formName)">{{cancelBtnText}}</el-button>
      <el-button type="primary" v-if="showSubmitBtn" :disabled="isDisable" size="small" @click="submit(formName)">{{submitBtnText}}</el-button>
    </div>
    <div class="form-body">
      <slot name="form"></slot>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
</style>
<script>

export default {
  name: 'baseForm',
  data () {
    return {
    }
  },
  props: {
    isDisable: {
      type: Boolean,
      default: false
    },
    cancel: Function,
    submit: Function,
    formName: String,
    headTitle: String,
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    showSubmitBtn: {
      type: Boolean,
      default: true
    },
    submitBtnText: {
      type: String,
      default: '保存'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    fixLayouts: {
      type: Function
    }
  },
  filters: {},
  created () {
  },
  mounted () {
    this.$nextTick(this.fixLayout)
    window.onresize = () => (() => {
      this.$nextTick(this.fixLayout)
    })()
  },
  methods: {
    fixLayout () {
      function getClientHeight ($el) {
        let $elHeight = 500
        try {
          $elHeight = $el.clientHeight || $el.style.height
          if (typeof $elHeight === 'string' && $elHeight.lastIndexOf('px') !== -1) {
            $elHeight = Number($elHeight.replace('px', ''))
          }
        } catch (err) {}
        return $elHeight
      }
      const formContainer = document.querySelector('.form-body')
      const tabContainerContent = document.querySelector('.tabs-container-content')
      let layoutGap = 0
      if (tabContainerContent) {
        const tabContainerContentHeight = getClientHeight(tabContainerContent)
        // app-container padding: 20; form-page-container .main-top: 46
        layoutGap = tabContainerContentHeight - 20 - 46
      } else {
        const tabContainerHeight = getClientHeight(document.querySelector('.tabs-container'))
        layoutGap = tabContainerHeight - 20 - 46
      }

      if (this.fixLayouts) {
        return this.fixLayouts(formContainer, layoutGap)
      }
      if (formContainer) {
        formContainer.style.height = layoutGap + 'px'
      }
    }
  }
}
</script>
