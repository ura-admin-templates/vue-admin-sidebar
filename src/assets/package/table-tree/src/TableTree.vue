<template>
  <section>
    <el-table
      class="table-tree"
      :data="data"
      border
      v-loading="listLoading"
      border highlight-current-row
      style="width: 100%"
      :row-style="showRow">
      <el-table-column v-for="(column, index) in columns"
                       :key="column.dataIndex"
                       :label="column.text"
                       :width="column.width"
                       :align="column.align || 'center'"
                       v-if="column.display !== 'hide'"
                       header-align="center">
        <template slot-scope="scope">
          <!-- add space -->
          <span v-if="spaceIconShow(index)" class="space" ref="space" :style="{width: 12*scope.row.level + 'px'}"></span>
          <!-- toggle icon -->
          <button class="button icon-toggle" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row.open" class="el-icon-arrow-right" aria-hidden="true"></i>
            <i v-if="scope.row.open" class="el-icon-arrow-down" aria-hidden="true"></i>
          </button>
          <span v-else-if="index===0" class="space"></span>

          <div v-if="column.mode === 'switcher'">
            <el-switch v-model="scope.row[column.dataIndex]" :on-value="1" :off-value="0" on-text="" off-text="" @click.native="emitChange(scope.row[column.dataIndex], scope.row)"> </el-switch>
            <!--<multiSwitch :extra="scope.row" :model="scope.row[column.dataIndex]" :onValue="1" :offValue="0" :onText="" :offText="" @onChange="emitChange"></multiSwitch>-->
          </div>
          <div v-else-if="column.mode === 'icon'">
            <icon style="font-size: 16px;" :name="scope.row[column.dataIndex] ? scope.row[column.dataIndex] : ''"></icon>
          </div>
          <span :class="column.style" v-else>{{scope.row[column.dataIndex]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" header-align="center" v-if="treeType === 'normal'" width="200px">
        <template slot-scope="scope">
          <slot>
            <el-button type="default" size="small" @click="emitCreate(scope.row)">新增</el-button>
            <el-button type="success" size="small" @click="emitUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="small"  @click="emitDelete(scope.row)">删除</el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { transferToTreeArray } from '@/utils'
export default {
  name: 'table-tree',
  props: {
    treeStructure: {// 确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      type: Boolean,
      default () {
        return false
      }
    },
    columns: {// 字段展示
      type: Array,
      default () {
        return []
      }
    },
    dataSource: {// 数据源
      type: Array,
      default () {
        return []
      }
    },
    requestUrl: {// 根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      type: String,
      default () {
        return ''
      }
    },
    treeType: {// 是否展示操作列
      type: String,
      default () {
        return 'normal'
      }
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {// 是否默认展开所有树
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      mode: ''
    }
  },
  computed: {
    data () { // 格式化数据源
      if (this.treeStructure) {
        return transferToTreeArray(this.dataSource, null, null, this.defaultExpandAll)
      }
      return this.dataSource
    }
  },
  methods: {
    transferToTreeArray (data, parent, level, isOpen) {
      let tmp = []
      Array.from(data).forEach(function (node) {
        if (!node.open) {
          this.$set(node, 'open', isOpen)
        }
        if (parent) {
          this.$set(node, 'parent', parent)
          this.$set(node, 'pId', parent.id)
        }
        let _level = 0
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        this.$set(node, 'level', _level)
        this.$set(node, 'isParent', node.children && node.children.length > 0)
        tmp.push(node)
        if (node.children && node.children.length > 0) {
          const children = transferToTreeArray(node.children, node, _level, isOpen)
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    // 显示行
    showRow (row, index) {
      const show = (row.parent ? (row.parent.open && row.parent.show) : true)
      row.show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle (trIndex) {
      const record = this.data[trIndex]
      record.open = !record.open
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      return !!(this.treeStructure && index === 0)
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      return !!(this.treeStructure && index === 0 && record.children && record.children.length > 0)
    },
    emitCreate (row) {
      this.$emit('create', row)
    },
    emitUpdate (row) {
      this.$emit('update', row)
    },
    emitDelete (row) {
      this.$emit('delete', row)
    },
    emitChange (val, row) {
      this.$emit('switchChange', val, row)
    }
  }
}
</script>
<style lang="scss">
  .table-tree{
    .space{
      position: relative;
      top: 1px;
      display: inline-block;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 18px;
      height: 14px;

      ::before{
        content: ""
      }
    }

    .icon-toggle{
      border: none;
      background-color: transparent;

      &:focus,
      &:hover{
        outline: none;
        border-color: transparent;
      }
    }
  }
</style>
