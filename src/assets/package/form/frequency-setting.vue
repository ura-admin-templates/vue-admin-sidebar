<template>
    <div class="form-container">
        <h4 v-if="title">{{title}}</h4>
        <el-form :model="form"
                 :inline="true"
                 ref='kvForm'
                 :rules="rules">
            <el-form-item prop="cyclicType"
                          :label-width="labelWidth"
                          label="刷新规则"
                          class="item">
                <el-select placeholder="请选择刷新规则"
                           v-model.number="form.cyclicType">
                    <el-option v-for="(item, index) in cyclicType"
                               :key="index"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="cyclicValue"
                          :label-width="labelWidth"
                          label="日期"
                          class="item">
                <el-input :placeholder="cyclicValuePlaceholder"
                          v-model="form.cyclicValue"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'frequencySetting',
  data () {
    return {
      cyclicDes: '',
      rules: {
        cyclicType: [
          {
            required: true,
            trigger: 'change',
            validator: this.validatecyclicType
          }
        ],
        cyclicValue: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateclicValue
          }
        ]
      }
    }
  },
  created () {},
  computed: {
    cyclicValuePlaceholder () {
      const placeholderMap = {
        8: 'MM-dd',
        7: 'xx日',
        6: '输入MON代表星期1',
        5: '输入0代表0点'
      }
      return placeholderMap[this.form.cyclicType] || ''
    }
  },
  methods: {
    validatecyclicType (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请填写时间节点'))
        return
      }
      callback()
    },
    validateMD (rule, value, callback, source, options) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请填写刷新的时间'))
        return
      }
      // let re = /^0?[1-9]|1[0-2]月0?[1-9]|1[0-9]|2[0-9]|3[0-1]日&/
      // if (!re.test(value)) {
      //     callback(new Error('请填写正确格式的时间'))
      //     return
      // }
      callback()
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => ({})
    },
    cyclicType: {
      type: Array,
      default: () => [
        {
          label: '每年',
          value: 8
        },
        {
          label: '每月',
          value: 7
        },
        {
          label: '每周',
          value: 6
        },
        {
          label: '每日',
          value: 5
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
    h4 {
        font-size: 16px;
        font-weight: 700;
        line-height: 30px;
    }
    .el-input,
    .el-select {
        width: 260px;
        padding: 0 10px;
    }
}
</style>

