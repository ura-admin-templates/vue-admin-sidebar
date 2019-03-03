<template>
    <div class="form-container">
        <h4 v-if="title">{{title}}</h4>
        <el-form :model="form"
                 :inline="true"
                 ref='timeRule'
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
                          v-if="form.cyclicType === 8"
                          :label-width="labelWidth"
                          :rules="rules.MD"
                          label="时间"
                          class="item">
                <el-input placeholder="MM-dd,例如：09-01"
                          v-model="form.cyclicValue">
                </el-input>

            </el-form-item>
            <el-form-item prop="cyclicValue"
                          v-if="form.cyclicType === 7"
                          :label-width="labelWidth"
                          label="时间"
                          :rules="rules.date"
                          class="item">
                <el-input placeholder="填写数值"
                          v-model="form.cyclicValue">
                    <template slot="append">日</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="cyclicValue"
                          v-if="form.cyclicType === 6"
                          :label-width="labelWidth"
                          :rules="rules.day"
                          label="时间"
                          class="item">
                <el-select placeholder="星期"
                           v-model="form.cyclicValue">
                    <el-option v-for="(item, index) in days"
                               :key="'value'+index"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="cyclicValue"
                          v-if="form.cyclicType === 5"
                          :label-width="labelWidth"
                          :rules="rules.hour"
                          label="时间"
                          class="item">
                <el-input placeholder="填写数值"
                          v-model="form.cyclicValue">
                    <template slot="append">时</template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const TIMERULE = [
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
const DAY = [
  {
    label: '星期一',
    value: 'MON'
  },
  {
    label: '星期二',
    value: 'TUE'
  },
  {
    label: '星期三',
    value: 'WEB'
  },
  {
    label: '星期四',
    value: 'THU'
  },
  {
    label: '星期五',
    value: 'FRI'
  },
  {
    label: '星期六',
    value: 'SAT'
  },
  {
    label: '星期日',
    value: 'SUN'
  }
]
export default {
  name: 'timeRuleSetting',
  data () {
    return {
      cyclicDes: '',
      days: DAY,
      rules: {
        cyclicType: [
          {
            required: true,
            trigger: 'change',
            validator: this.validatecyclicType
          }
        ],
        MD: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateMD
          }
        ],
        date: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateDate
          }
        ],
        day: [
          {
            required: true,
            trigger: 'change',
            validator: this.validateDay
          }
        ],
        hour: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateHour
          }
        ]
      }
    }
  },
  created () {},
  methods: {
    validateForm () {
      let flag = true
      this.$refs.timeRule.validate(res => {
        flag = res
      })
      return flag
    },
    validatecyclicType (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请选择规则类型'))
        return
      }
      callback()
    },
    validateMD (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请填写刷新的时间'))
        return
      }
      if (!/^(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
        callback(new Error('请填写MM-dd格式的月份和日期'))
        return
      }
      callback()
    },
    validateDate (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请填写刷新的时间'))
        return
      }
      if (!/^(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
        callback(new Error('请填写代表日期的数值'))
        return
      }
      callback()
    },
    validateDay (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请选择刷新的时间'))
        return
      }
      callback()
    },
    validateHour (rule, value, callback) {
      if (/^\s*$/.test(value) || (!value && value !== 0)) {
        callback(new Error('请选择刷新的时间'))
        return
      }
      const h = Number(value)
      if (h < 0 || h > 24) {
        callback(new Error('请填写合法时间'))
        return
      }
      callback()
    }
  },
  watch: {
    'form.cyclicType': function (value, valueOld) {
      if (valueOld && value) this.form.cyclicValue = ''
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
      default: () => TIMERULE
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

