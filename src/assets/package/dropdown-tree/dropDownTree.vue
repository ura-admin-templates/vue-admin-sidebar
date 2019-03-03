<template>
  <div class="dropdown-tree-container">
    <div class="selected-box" :class="{'is-disabled': disabled}" @click="handleShow">
      <el-tag v-for="(item, key) in checkedNode" :key="key" closable @close="handleClose(item)">{{item.label}}</el-tag>
    </div>
    <el-collapse-transition>
      <div v-show="dropDownVisible" class="drop-container select-dropdown" :style="'max-height: ' + maxHeight + 'px;'">
        <!--:filter-node-method="filterNode"-->
        <el-tree
          ref="tree2"
          :data="data"
          node-key="id"
          :expand-on-click-node="false"
          :accordion="accordion"
          :show-checkbox="showCheckBox"
          @load="load"
          :check-strictly="true"
          :empty-text="emptyText"
          @node-contextmenu="nodeContextmenu"
          :default-expand-all="expandAll"
          @check-change="checkChange"
          :props="defaultProps"
          @check="handleCheck"
          @current-change="currentChange"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="node.icon"></span>
            <span class="tree-label">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'dropdown-tree',
  data () {
    return {
      dropDownVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedNode: []
    }
  },
  watch: {
    data (val) {
      if (val.length) {
        this.$nextTick(() => {
          this.showData()
        })
      }
    },
    value (v) {
      if (v) {
        this.$nextTick(() => {
          this.showData()
        })
      }
    }
  },
  mounted () {
    const _this = this
    document.addEventListener('click', e => {
      if (!_this.$el.contains(e.target)) {
        _this.dropDownVisible = false
      }
    })
  },
  props: {
    value: {},
    data: {
      type: Array
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    load: {
      type: Function,
      default: () => {}
    },
    emptyText: {
      type: String,
      default: '无数据'
    },
    lazy: {
      type: Boolean
    },
    expandAll: {
      type: Boolean,
      default: true
    },
    accordion: {
      type: Boolean,
      default: true
    },
    nodeContextmenu: {
      type: Function,
      default: () => {}
    },
    checkChange: {
      type: Function,
      default: () => {}
    },
    currentChange: {
      type: Function,
      default: () => {}
    },
    nodeExpand: {
      type: Function,
      default: () => {}
    },
    nodeCollapse: {
      type: Function,
      default: () => {}
    },
    showCheckBox: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showData () {
      // this.checkedNode = JSON.parse(JSON.stringify(this.value))
      this.$refs.tree2.setCheckedNodes(this.value)
      this.checkedNode = this.$refs.tree2.getCheckedNodes()
    },
    handleNodeClick (data) {
      if (this.showCheckBox) return false
      this.checkedNode.length = 0
      this.checkedNode.push(data)
      // this.$set(this.checkedNode, 0, data)
      this.$refs.tree2.setCheckedNodes(this.checkedNode)
      this.dropDownVisible = false
      this.$emit('input', this.checkedNode)
    },
    handleShow () {
      if (!this.disabled) {
        this.dropDownVisible = true
      }
    },
    // 处理关闭标签
    handleClose (tag) {
      this.checkedNode.splice(this.checkedNode.indexOf(tag), 1)
      this.$refs.tree2.setCheckedNodes(this.checkedNode)
      this.$emit('input', this.checkedNode)
    },
    handleCheck (val) {
      const _this = this
      const checkedData = _this.$refs.tree2.getCheckedNodes()
      this.checkedNode = checkedData
      this.$emit('input', this.checkedNode)
    }
  }
}
</script>
