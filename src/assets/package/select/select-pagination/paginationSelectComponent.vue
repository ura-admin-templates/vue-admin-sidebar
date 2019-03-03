<template>
  <div class="select-component-container">
    <div class="select-pagination-editor">
      <div class="select-container">
        <div :class="{'selected-box': true, 'noButton': !visibleButton}" @click="showDialog">
          <el-tooltip v-for="item in tags" :key="item.id" class="item" effect="dark" :content="item[tag]" placement="top-start">
            <el-tag closable @close="handleClose(item)">{{item[tag]}}</el-tag>
          </el-tooltip>
        </div>
        <el-button v-if="visibleButton" size="mini" class="select-btn" type="primary" @click="showDialog">选择</el-button>
        <el-input v-model="hiddenValue" type="hidden" v-show="false"></el-input>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :modal="modal"
        :visible.sync="dialogVisible"
        top="11vh"
        width="65%">
        <div class="select-pagination-body">
          <div class="query-container">
            <el-form :model="listQuery" class="dialog-form" :label-width="labelWidth" :inline="true">
              <slot name="search"></slot>
              <el-button style="float:right;margin-bottom: 10px;" size="mini" type="primary" @click="getData">查询</el-button>
            </el-form>
          </div>
          <el-table
            id="activityList"
            ref="paginationSelectTable"
            class="utable-container"
            @row-dblclick="getSingleVal"
            @selection-change="getMultipleVal"
            :key='tableKey'
            :data="data"
            v-loading="listLoading"
            border fit highlight-current-row
            height="370"
            align="center"
            style="width: 100%">
            <div v-if="visibleOptButton && !multiple">
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <span class="btns-item" @click="getSingleVal(scope.row)">选择</span>
                </template>
              </el-table-column>
            </div>
            <slot name="tableData"></slot>
          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo"
                           :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"></el-pagination>
          </div>
          <span slot="footer" class="dialog-footer" v-show="multiple">
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
import { Utopa } from '@/common/utopa'
import { error } from '@/utils/dialog'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
export default {
  name: 'pagination-select',
  data () {
    return {
      total: 0,
      data: [],
      tableKey: 0,
      dialogVisible: false,
      multipleVal: [],
      hiddenValue: '',
      tags: [],
      listLoading: true,
      listQuery: {
        pageNo: PAGINATION_PAGENO, // 页码
        pageSize: PAGINATION_PAGESIZE // 页数
      }
    }
  },
  props: {
    value: {},
    tag: {
      type: String,
      default: 'name'
    },
    modal: {
      type: Boolean,
      default: true
    },
    visibleOptButton: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    title: {
      type: String
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
        data: 'data.records',
        total: 'data.total'
      })
    },
    valueName: {
      type: Array,
      default: () => []
    },
    isQuery: {
      type: Boolean,
      default: true
    },
    unique: {
      type: String,
      default: 'id'
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.showTags()
      }
    },
    tags (val) {
      // 多选
      if (this.valueName.length === 0) {
        if (!this.multiple && val instanceof Array) {
          this.$emit('input', val[0])
        } else {
          this.$emit('input', val)
        }
      } else if (this.valueName.length === 1) {
        if (!this.multiple && val instanceof Array) {
          this.$emit('input', val[0][this.valueName[0]])
        } else {
          const values = val.map(item => item[this.valueName[0]])
          this.$emit('input', values)
        }
      } else if (!this.multiple && val instanceof Array) {
        this.$emit('input', val[0])
      } else {
        const inputVal = val.map(items => {
          const values = {}
          this.valueName.forEach((item, i) => {
            values[item] = items[item]
          })
          return values
        })
        this.$emit('input', inputVal)
      }
    }
  },
  created () {

  },
  mounted () {
    if (this.isQuery) {
      this.getData(this.getTags)
    } else {
      this.$nextTick(this.showTags)
      //        this.showTags()
    }
  },
  methods: {
    showTags () {
      if (!this.value.length) {
        return false
      }
      if (typeof this.value === 'string') { // code 单选
        const obj = {}
        obj[this.tag] = this.value
        this.tags.push(obj)
      } else if (typeof this.value === 'object') {
        if (this.value instanceof Array && this.value.length !== 0) { // 数组
          const obj = {}
          this.value.forEach((item, index) => {
            obj[this.tag] = item
            this.tags.push(obj)
          })
        }
      }
      let data = []
      if (this.valueName.length === 0) {
        if (this.value instanceof Array) { // 多选
          data = this.value
        } else { // 单选
          data = [this.value]
        }
      } else if (this.valueName.length === 1) {
        if (typeof this.value === 'string' || typeof this.value === 'number') { // 单选
          const obj = {}
          obj[this.tag] = this.value
          data.push(obj)
        } else { // 多选 [xxx, xxxx, xxx]
          this.value.forEach((item, index) => {
            const obj = {}
            obj[this.tag] = item
            data.push(obj)
          })
        }
      } else if (this.value instanceof Array) { // 多选[{name: '', id: ''}]
        this.value.forEach(items => {
          data = data.concat(items)
        })
      } else { // 单选{name: ''}
        if (typeof this.value !== 'string') {
          data.push(this.value)
        }
      }
      if (data.length > 0) {
        this.tags = data
        this.multipleVal = data
      }
    },
    getTags () {
      if (typeof this.value === 'object') {
        if (this.value instanceof Array && this.value.length === 0) { // 数组
          return false
        }
        const arr = Object.keys(this.value)
        if (arr.length === 0) {
          return false
        }
      } else if (typeof this.value === 'string') {
        if (this.value.replace(/(^s*)|(s*$)/g, '').length === 0) {
          return false
        }
      }
      let data = []
      if (this.valueName.length === 0) {
        if (this.value instanceof Array) { // 多选
          data = this.value
        } else { // 单选
          data = [this.value]
        }
      } else if (this.valueName.length === 1) {
        if (typeof this.value === 'string' || typeof this.value === 'number') { // 单选
          this.data.forEach(items => {
            if (items[this.valueName[0]] === this.value) {
              data.push(items)
            }
          })
        } else { // 多选 [xxx, xxxx, xxx]
          this.data.forEach(items => {
            this.value.forEach(item => {
              if (items[this.valueName[0]] === item) {
                data.push(items)
              }
            })
          })
        }
      } else if (this.value instanceof Array) { // 多选[{name: '', id: ''}]
        this.value.forEach(items => {
          data = data.concat(this.where(this.data, items))
        })
      } else { // 单选{name: ''}
        data = this.where(this.data, this.value)
      }
      this.tags = data
    },
    // 判断一个对象是否另一个对象子集
    where (array, obj) {
      const keys = Object.keys(obj)
      return array.filter(m => keys.every(key => m.hasOwnProperty(key) && m[key] === obj[key]))
    },
    // 获取列表
    getData (callback) {
      const _this = this
      const data = Object.assign(this.queryData, this.listQuery)
      this.apiService(data).then(response => {
        if (Utopa.isValidRequest(response)) {
          _this.data = response
          _this.total = response
          _this.tableDataStru.data.split('.').forEach(item => {
            _this.data = _this.data[item]
          })
          _this.tableDataStru.total.split('.').forEach(item => {
            _this.total = _this.total[item]
          })
          _this.total = _this.total || PAGINATION_PAGETOTAL
          // 获取到之前选中的tag里对应的对象 以及选中还未选入tags中的对象
          const tagsSelectedList = []
          const currentSelectList = []
          _this.data.map((item, index) => {
            _this.tags.forEach(val => {
              if (val[this.unique] === item[this.unique]) {
                tagsSelectedList.push(item)
              }
            })
            _this.multipleVal.forEach(v => {
              if (v[this.unique] === item[this.unique]) {
                currentSelectList.push(item)
              }
            })
          })
          _this.$nextTick(() => {
            _this.toggleSelection(tagsSelectedList)
            _this.toggleSelection(currentSelectList)
          })
          callback && callback()
        } else {
          error('获取失败')
        }
        _this.listLoading = false
      }).catch(err => {
        console.warn(err.message || '获取数据失败')
        _this.listLoading = false
      })
    },
    showDialog () {
      this.getData(this.getTags)
      this.dialogVisible = true
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.paginationSelectTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.paginationSelectTable.clearSelection()
      }
    },
    // pagination change current page
    handleCurrentChange (pageNo) {
      this.listQuery.pageNo = pageNo
      this.getData()
    },
    // pagination change page size
    handleSizeChange (pageSize) {
      this.listQuery.pageSize = pageSize
      this.getData()
    },
    // 获取单个值
    getSingleVal (row, event) {
      if (!this.multiple) {
        this.tags[0] = row
        if (this.valueName.length === 0) {
          this.$emit('input', this.tags[0])
        } else if (this.valueName.length === 1) {
          this.$emit('input', this.tags[0][this.valueName[0]])
        } else {
          const values = {}
          this.valueName.forEach((item, i) => {
            values[item] = this.tags[0][item]
          })
          this.$emit('input', values)
        }
      } else {
        this.tags.forEach((item, index) => {
          if (item.id === row.id) {
            this.tags.splice(index, 1)
          }
        })
        this.tags.push(row)
      }
      this.dialogVisible = false
    },
    // 获取多选值
    getMultipleVal (val) {
      this.multipleVal = JSON.parse(JSON.stringify(val))
    },
    // 处理关闭标签
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    onSubmit () {
      // 去重
      // this.tags.forEach((item) => {
      //   this.multipleVal.forEach((val, index) => {
      //     if (item[this.tag] === val[this.tag]) {
      //       this.multipleVal.splice(index, 1)
      //     }
      //   })
      // })
      // console.log(this.tags)
      // this.tags.push.apply(this.tags, this.multipleVal)
      // console.log(this.tags)
      this.tags = this.multipleVal
      this.dialogVisible = false
    }
  }
}
</script>
