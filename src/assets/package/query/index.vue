<template>
  <section>
    <div class="uv-filter">
      <p class="uv-filter-title">{{title}}</p>
      <el-form autoComplete="on" :ref="refference" :label-width="labelWidth" :model="listQuery" label-position="left" :inline="true">
        <slot></slot>
        <el-button  class="uv-filter-btn" type="primary" icon="el-icon-refresh" @click="handleReset">刷新</el-button>
        <el-button class="uv-filter-btn" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <a class="uv-filter-more" v-if="btnShow"  @click="changeText" href="javascript:;" v-text="isShow === true ? '隐藏更多条件' : '显示更多条件'"></a>
      </el-form>
    </div>
  </section>
</template>
<style lang="scss" scoped>
  .el-button{
    display: block !important;
  }
</style>
<script>
export default {
  name: 'query',
  data () {
    return {
      isShow: false,
      btnShow: true
    }
  },
  props: {
    listQuery: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    amount: {
      type: Number,
      default: 5
    },
    refference: {
      type: String,
      default: 'queryForm'
    },
    title: {
      type: String
    },
    onChange: {
      type: Function
    },
    query: Function,
    reset: Function
  },
  mounted () {
    this.btnShow = this.amount < this.$refs.queryForm.$children.length - 2
    this.handleItem()
  },
  methods: {
    handleItem () {
      const queryItem = this.$refs.queryForm.$children
      if (!this.isShow) {
        queryItem.forEach((item, index) => {
          if (index > this.amount - 1) {
            item.$el.style.display = 'none'
          }
        })
      } else {
        queryItem.forEach(item => {
          item.$el.style.display = 'block'
        })
      }
    },
    changeText () {
      this.isShow = !this.isShow
      this.handleItem()
      this.onChange && this.onChange()
    },
    handleReset () {
      this.$refs[this.refference].resetFields()
      this.reset && this.reset()
    }
  }
}
</script>
