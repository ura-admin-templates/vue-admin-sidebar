<template>
  <div class="select-component-container">
    <div class="select-pagination-editor">
      <div class="select-container">
          <div v-bind:class="{'selected-box': true, 'noButton': !visibleButton}" @click="showDialog">
            <el-tag v-for="item in tags" :key="item.id" closable @close="handleClose(item)">{{item[tag]}}</el-tag>
            <el-button size="mini" v-if="visibleButton" class="select-btn" type="primary" @click="showDialog">选择</el-button>
          </div>
          <el-input v-model="value" type="hidden" v-show="false"></el-input>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        top="11vh"
        :visible.sync="dialogVisible"
        width="80%">
        <div class="select-pagination2-body">
          <el-row :gutter="20">
            <el-col :span="11">
              <div ref="leftContainer" class="grid-content">
                <div class="list">
                  <div class="list-header">{{listHeader}}</div>
                  <div class="query-container">
                    <el-form :model="listQuery" class="dialog-form" :label-width="labelWidth" :inline="true">
                      <slot name="search"></slot>
                      <el-button style="float:right;margin: 0 5px 10px 0;" size="mini" type="primary" @click="getList">查询</el-button>
                    </el-form>
                  </div>
                  <el-table
                    class="utable-container"
                    :key="tableKey"
                    ref="multipleTable"
                    @selection-change="handleListMultiple"
                    :data="list"
                    v-loading="listLoading"
                    @row-dblclick="moveToTarget"
                    border fit highlight-current-row
                    :height="height1"
                    align="center">
                    <slot name="tableData"></slot>
                  </el-table>
                  <div class="pagination-container">
                    <el-pagination @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.pageNo"
                                   :page-sizes="[10,20,30, 50]"
                                   :page-size="listQuery.pageSize"
                                   layout="total, prev, pager, next, jumper"
                                   :total="total"></el-pagination>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="btn-area">
                <span><i class="el-icon-arrow-right" @click="MutipleMoveToTarget"></i></span>
                <span><i class="el-icon-arrow-left" @click="MutipleDelTarget"></i></span>
                <span><i class="el-icon-refresh" @click="freshTarget"></i></span>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content">
                <div class="list">
                  <div class="list-header">已选择记录</div>
                  <el-table
                    class="utable-container"
                    :key='tableKey'
                    :data="target"
                    @selection-change="handleTargetMultiple"
                    v-loading="listLoading"
                    @row-dblclick="delTarget"
                    border fit highlight-current-row
                    :height="height2"
                    align="center">
                    <slot name="selectTableData"></slot>
                  </el-table>
                  <div class="pagination-container" v-show="false">
                    <el-pagination @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.pageNo"
                                   :page-sizes="[10,20,30, 50]"
                                   :page-size="listQuery.pageSize"
                                   layout="total, prev, pager, next, jumper"
                                   :total="total"></el-pagination>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="onSubmit">保 存</el-button>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
import { Utopa } from '@/common/utopa'
import { error } from '@/utils/dialog'
export default {
  name: 'pagination-mutipleselect',
  data () {
    return {
      listQuery: {
        pageNo: PAGINATION_PAGENO, // 页码
        pageSize: PAGINATION_PAGESIZE // 页数
      },
      listLoading: true,
      tableKey: 0,
      total: 0,
      height1: 370,
      height2: 479,
      listMultipleVal: [],
      targetMultipleVal: [],
      value: '',
      target: [],
      tags: [],
      list: [],
      dialogVisible: false
    }
  },
  props: {
    tag: {
      type: String,
      default: 'name'
    },
    title: {
      type: String
    },
    listHeader: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    queryData: {
      type: Object
    },
    apiService: {
      type: Function
    },
    visibleButton: {
      type: Boolean,
      default: true
    },
    tableDataStru: {
      type: Object,
      default: () => ({
        data: 'data.data.records',
        total: 'data.data.total'
      })
    }
  },
  watch: {
    tags (val) {
      // this.value = val.map((item, index) => {
      //   return item.id
      // }).join(',')
      this.$emit('input', val)
    }
  },
  mounted () {
  },
  methods: {
    fixLayout () {
      setTimeout(() => {
        this.$nextTick(() => {
          const leftContainerHeight = this.$refs.leftContainer.clientHeight
          this.height2 = (leftContainerHeight - 35) + 'px'
        })
      }, 50)
    },
    // 获取列表
    getList () {
      const _this = this
      const data = Object.assign(this.listQuery, this.queryData)
      this.apiService(data).then(response => {
        if (Utopa.isValidRequest(response)) {
          _this.list = response
          _this.total = response
          _this.tableDataStru.data.split('.').forEach(item => {
            _this.list = _this.list[item]
          })
          _this.tableDataStru.total.split('.').forEach(item => {
            _this.total = _this.total[item]
          })
          _this.total = _this.total || PAGINATION_PAGETOTAL
        } else {
          error('获取失败')
        }
        this.listLoading = false
      }).catch(err => {
        error(err.message || '获取数据失败')
        this.listLoading = false
      })
    },
    showDialog () {
      this.dialogVisible = true
      this.getList()
      this.freshTarget()
      this.fixLayout()
    },
    // pagination change current page
    handleCurrentChange (pageNo) {
      this.listQuery.pageNo = pageNo
      this.getList()
    },
    // pagination change page size
    handleSizeChange (pageSize) {
      this.listQuery.pageSize = pageSize
      this.getList()
    },
    // 双击目标列表删除
    delTarget (data) {
      this.target.forEach((item, index) => {
        if (item === data) {
          this.target.splice(index, 1)
        }
      })
    },
    //  双击移动到目标框
    moveToTarget (data) {
      if (!this.multiple) {
        this.target = []
        this.target[0] = data
      } else {
        // 去重
        this.target.forEach((item, index) => {
          if (item.id === data.id) {
            this.target.splice(index, 1)
          }
        })
        this.target.push(data)
      }
    },
    // 刷新去除目标框列表
    freshTarget () {
      this.target = []
    },
    // 待选框多选
    handleListMultiple (val) {
      this.listMultipleVal = val
    },
    MutipleMoveToTarget () {
      if (!this.multiple) {
        if (this.listMultipleVal.length > 1) {
          this.$message({
            message: '只能选择一条记录',
            type: 'warning'
          })
        } else {
          this.target = []
          this.target[0] = this.listMultipleVal[0]
          this.$refs.multipleTable.clearSelection()
        }
      } else {
        const arr = this.listMultipleVal.slice(0)
        this.target.forEach(item => {
          arr.forEach((val, index) => {
            if (item.id === val.id) {
              arr.splice(index, 1)
              arr.splice(index, 1)
            }
          })
        })
        this.target.push.apply(this.target, arr)
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 已选框多选
    handleTargetMultiple (val) {
      this.targetMultipleVal = val
    },
    MutipleDelTarget () {
      const ids = this.targetMultipleVal.map(item => item.id)
      const l = ids.length
      for (let i = 0; i < l; i++) {
        this.target.forEach((item, index) => {
          if (item.id === ids[i]) {
            this.target.splice(index, 1)
          }
        })
      }
    },
    // 处理关闭标签
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    onSubmit () {
      if (!this.multiple) {
        this.tags[0] = this.target[0]
        this.$emit('input', this.tags[0])
      } else {
        // 去重
        this.tags.forEach(item => {
          this.target.forEach((val, index) => {
            if (item.id === val.id) {
              this.target.splice(index, 1)
            }
          })
        })
        this.tags.push.apply(this.tags, this.target)
      }
      this.dialogVisible = false
    }
  }
}
</script>
