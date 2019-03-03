<template>
    <div class="form-container">
        <h4 v-if="title">{{title}}<span class="help-des"><i class="el-icon-info"></i> 必填，根据标签元数据类型，填写值类型不一样</span></h4>
        <el-form :model="form" :inline="true" label-width="105px"  ref='kvForm'>
            <div v-for="(item, index) in form.values" :key="index">
                <el-form-item :label="'标签值'+(index +1)+'名称'" :prop="'values.' + index + '.name'" :rules="rules.name">
                    <el-input v-model="item.name" placeholder="标签值名称"></el-input>
                </el-form-item>
                <el-form-item v-if="type == 2" label="标签值" :prop="'values.' + index + '.value1'"  :rules="rules.string">
                    <el-input  v-model="item.value1" placeholder="标签值"></el-input>
                </el-form-item>
                <el-form-item v-if="type == 3" label="范围"  :prop="'values.' + index + '.value1'"  :rules="rules.date">
                    <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="date" placeholder="起始日期" v-model="item.value1"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="type == 3"  :prop="'values.' + index + '.value2'"  :rules="rules.date">
                    <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="date" placeholder="结束日期" v-model="item.value2"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="type == 1" label="范围"  :prop="'values.' + index + '.value1'"  :rules="rules.number">
                    <el-input  v-model="item.value1" placeholder="起始数字"></el-input>
                </el-form-item>
                <el-form-item v-if="type == 1"  :prop="'values.' + index + '.value2'"  :rules="rules.number">
                    <el-input  v-model="item.value2" placeholder="结束数字"></el-input>
                </el-form-item>
                <el-form-item v-if="isShowButton">
                    <el-button  icon="el-icon-plus" :plain="plain" circle @click="$emit('add', index)"></el-button>
                    <el-button  icon="el-icon-minus" :plain="plain" circle @click="$emit('remove', index)"></el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'KVSetting',
  data () {
    return {
      plain: true
    }
  },
  created () {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isShowButton: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Number | String,
      default: '' // 2:string, 1:number, 3:date
    }
  }
}
</script>

<style lang="scss" scoped>
    .form-container {
        padding: 10px;
        border-radius: 10px;
        h4 {
            font-size: 16px;
            font-weight: 700;
            line-height: 30px;
        }
        .el-input,
        .el-select {
            width: 260px !important;
        }
    }
</style>

