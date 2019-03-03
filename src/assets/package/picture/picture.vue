<template>
  <div class="app-container">

    <el-button icon='picture'  @click=" dialogVisible=true" type="primary">
        <span v-if="buttonTitle !== ''">{{buttonTitle}}</span>
        <span v-else>图库管理</span>
    </el-button>

    <el-dialog style="margin:10px"
        v-model="dialogVisible"
        :visible.sync="dialogVisible"
        title= "图库管理"
        :close-on-click-modal= "false"
        :modal= "false"
        :show-close= "!isRefence"
        :center= "true"
        size= "large"
        >
        <div class="filter-container">
            <el-form autoComplete="on" :model="listQuery" label-position="left" :inline="true">
                <el-form-item label="文件名称">
                    <el-input style="width: 200px;" class="filter-item" placeholder="分类名称" v-model="listQuery.picName"></el-input>
                </el-form-item>

                <el-form-item label="分类">
                    <el-select clearable class="filter-item" placeholder="选择分类" v-model="listQuery.dirId" @visible-change="fetchPicDirList">
                        <el-option label='全部' value=''></el-option>
                        <el-option v-for="item in picDirList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="上传时间">
                    <el-date-picker
                        v-model="listQuery.uploadTime"
                        type="datetimerange"
                        placeholder="选择上传时间范围">
                    </el-date-picker>
                </el-form-item>

                <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
            </el-form>
        </div>

        <p>
            <!--本地上传 start-->
            <commonUpload  @successCBK="imageSuccessCBK"></commonUpload>
            <!--本地上传 end-->
            <el-checkbox-button  v-model="checked" border size="mini" type="info" @change="checkAll" style="margin-left:20px;">批量选择</el-checkbox-button>
            <el-button style="margin-left:400px;width:100px"  size="small" type="success" :disabled="!handleListAbled" @click="handleListAbled=false">宫格展示</el-button>
            <el-button style="width:100px;margin-left:20px;" size="small"  type="success" :disabled="handleListAbled"  @click="handleListAbled=true">列表展示</el-button>
            <el-button style="width:100px;margin-left:20px;" size="small"  type="warning" @click="handleBatchMove">批量移动</el-button>
            <el-button style="width:100px;margin-left:20px;" size="small"  type="danger" @click="handleBatchDelete">批量删除</el-button>
        </p>
        <el-table v-show="handleListAbled"
            ref="mytable"
            class="utable-container"
            :key='tableKey'
            :data="list"
            v-loading="listLoading"
            border fit highlight-current-row
            @select-all="selectAll"
            @select="selectRow"
            align="center"
            height="500"
            style="width: 100%">


            <el-table-column v-show="false"
                type="selection"
                :selectable="checkSelectable"
                width="0">
            </el-table-column>

            <el-table-column align="center" label="图片/图片名称">
                <template slot-scope="scope">
                <div><img :src="scope.row.picLink" style="height:70px;width:70px"></div>
                <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="图片大小">
                <template slot-scope="scope">
                <span>{{scope.row.sizeStr}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="格式">
                <template slot-scope="scope">
                <span>{{scope.row.format}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="上传时间">
                <template slot-scope="scope">
                <span>{{scope.row.uploadTime | dateTimeFormat}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" min-width="150px">
                <template slot-scope="scope">
                <el-button type="warning" size="small" round @click="movePic(scope.row.id)">移动</el-button>
                <el-button type="info" size="small" round @click="updatePic(scope.row)">重命名</el-button>
                <el-button type="danger" size="small" round @click="deletePic(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row v-show="!handleListAbled" class="text-center">
            <el-checkbox-group v-model="checkedData">
                <div style="border:1px solid #D8DCE5;padding:5px; margin:10px auto">
                    <el-checkbox  v-for="item in list" :disabled="!checked" :label="item.id" :key="item.id" border >{{item.name}}
                            <div style="border:1px solid #DFE4ED;padding:5px;width:200px;height:200px;overflow:hidden;">
                                <img :src="item.picLink" class="image">
                            </div>
                            <div class="text-center" style="margin-top:5px">
                                <el-button type="warning" size="mini" round @click="movePic(item.id)">移动</el-button>
                                <el-button type="info" size="mini" round @click="updatePic(item)">重命名</el-button>
                                <el-button type="danger" size="mini" round @click="deletePic(item.id)">删除</el-button>
                            </div>
                    </el-checkbox>
                </div>
            </el-checkbox-group>


            <!-- <el-col :span="5" v-for=" item in list" :key="item.id" class="text-center">
                <img :src="item.picLink" class="image">
                <div>
                    <el-checkbox  v-model="checkedData" :disabled="!checked" :value="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </div>
                <div class="text-center">
                    <el-button type="danger" size="mini" round @click="movePic(item.id)">移动</el-button>
                    <el-button type="danger" size="mini" round @click="updatePic(item)">重命名</el-button>
                    <el-button type="danger" size="mini" round @click="deletePic(item.id)">删除</el-button>
                </div>
            </el-col> -->
        </el-row>

        <!-- pagination start -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 100]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!-- pagination end -->

        <el-dialog
            :title="picture.title"
            size="tiny" append-to-body
            :visible.sync="dialogFormVisible"
            :modal= "false">
            <el-form class="small-space" autoComplete="on" :rules="pictureRules" :model="picture" ref="userOrderModelForm" label-position="left" label-width="85px">
                <el-form-item label="图片名称" prop="picName" style="display:inline">
                    <el-input v-model="picture.name" autoComplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer text-center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="updatePicName">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            :title="picture.title"
            size="tiny" append-to-body
            :visible.sync="dialogMoveFormVisible"
            :modal= "false">
            <el-form class="small-space" autoComplete="on" :model="picture" label-position="left" label-width="85px" >
                <el-form-item label="移动至分类">
                    <el-select clearable class="filter-item" placeholder="选择分类" v-model="picture.dirId" @visible-change="fetchPicDirList">
                        <el-option label='默认分类' value=''></el-option>
                        <el-option v-for="item in picDirList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer text-center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="savePic('2')">确 定</el-button>
            </div>
        </el-dialog>

        <div slot="footer" class="dialog-footer text-center" v-show="!isRefence">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="submit">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .app-container{
    padding: 10px;

    .filter-container{
      .el-button{
        margin-left: 10px;
      }
    }
    .utable-container{
      width: 100%;
      margin-top: 10px;
    }
    .pagination-container{
      margin-top: 5px;
    }
    .image {
        width: 150px;
        height: 140px;
        display: block;
        margin: 20px
    }
  }
</style>

<script>
import Upload from '@/components/Upload/singleImage3'
import * as pictureService from '@/api/system/picture'
import { error } from '@/utils/dialog'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
import { Helper } from '@/common/helper'
import { Utopa } from '@/common/utopa'
import commonUpload from '@/components/picture/commonUpload'

export default {
  name: 'userList',
  components: { Upload, commonUpload },
  props: ['buttonTitle'],
  data () {
    return {
      dialogVisible: false,
      listLoading: true,
      total: PAGINATION_PAGETOTAL, // 列表总记录数
      listQuery: { // 查询条件
        picName: '', // 误解
        beginTime: '', // 注册范围开始时间
        endTime: '', // 注册范围结束时间
        uploadTime: '',
        pageNo: PAGINATION_PAGENO, // 页码
        pageSize: PAGINATION_PAGESIZE // 页数
      },
      dialogFormVisible: false,
      dialogMoveFormVisible: false,
      handleListAbled: true,
      tableKey: 0,
      checkFlag: false,
      utopaTableHeight: 0, // 表格高度
      list: [], // 表格数据信息
      picture: {
        id: '',
        name: '',
        optType: '',
        dirId: '',
        title: '图片重命名'
      },
      picDirList: [],
      checked: false,
      isIndeterminate: true,
      checkedData: [],
      pictureRules: {
        picName: [
          { required: true, message: '名称不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    dateTimeFormat (datetime) {
      return datetime && Helper.parseTime(datetime)
    }
  },
  computed: {
    isRefence () { // 引用状态
      return this.$route.query.isRefence
    }
  },
  created () {
    this.getList()
  },
  watch: {
    'listQuery.uploadTime': function (val) {
      if (val !== undefined) {
        const beginTime = val[0]
        const endTime = val[1]
        this.listQuery.beginTime = beginTime && Helper.parseTime(beginTime)
        this.listQuery.endTime = endTime && Helper.parseTime(endTime)
      }
    },
    'dialogVisible': function (val) {
      if (val) {
        this.getList()
        this.checkedData = []
      }
    },
    'dialogFormVisible': function (val) {
      if (!val) {
        this.resetForm()
      }
    },
    'dialogMoveFormVisible': function (val) {
      if (!val) {
        this.resetForm()
      }
    },
    'handleListAbled': function (val) {
      this.checkedData = []
      this.doCheck()
    }
  },
  mounted () {
    this.fixLayout()
    window.onresize = () => (() => {
      this.fixLayout()
    })()
  },
  methods: {
    fixLayout () {
      const body = document.body
      const mainHeader = document.querySelector('.main-header')
      const crumbNav = document.querySelector('.breadcrumb-nav')
      const filterContainer = document.querySelector('.filter-container')
      const pagination = document.querySelector('.pagination-container')
      this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight * 2 - pagination.clientHeight - 50
    },
    updateList () {
      this.getList()
      this.doCheck()
    },
    // 获取列表
    getList () {
      this.listLoading = true
      this.listLoading = true
      const beginTime = this.listQuery.beginTime
      const endTime = this.listQuery.endTime
      const uploadTime = this.listQuery.uploadTime
      this.listQuery.uploadTime = ''
      this.listQuery.beginTime = beginTime
      this.listQuery.endTime = endTime
      pictureService.getPicturePage(this.listQuery).then(response => {
        const result = response.data
        this.listQuery.uploadTime = uploadTime
        if (Utopa.isValidRequest(response)) {
          this.list = result.data.records
          this.total = result.data.total || PAGINATION_PAGETOTAL
        } else {
          error(result.msg || '获取失败')
        }
        this.listLoading = false
      }).catch(err => {
        error(err.message || '获取数据失败')
        this.listLoading = false
      })
    },
    // 获取来源列表
    fetchPicDirList () {
      if (!this.picDirList.length) {
        pictureService.fetchPicDirList().then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.picDirList = result.data.picDirList || []
          } else {
            error(result.msg || '获取文件夹列表失败')
          }
        })
      }
    },
    resetForm () {
      this.picture.name = ''
      this.picture.id = ''
      this.picture.optType = ''
      this.picture.dirId = ''
    },
    handleFilter () {
      this.listQuery.pageNo = PAGINATION_PAGENO
      this.updateList()
    },
    handleAddDir () {
      this.dialogFormVisible = true
    },
    updatePic (row) {
      this.dialogFormVisible = true
      this.picture.name = row.name
      this.picture.id = row.id
    },
    movePic (picIds) {
      this.picture.id = picIds
      this.dialogMoveFormVisible = true
    },
    deletePic (picIds) {
      this.$confirm('确定要执行该删除操作吗？删除后将不可以恢复！', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(picIds)
        this.picture.id = picIds
        this.savePic('1')
      }).catch(() => {
        console.log('取消删除')
      })
    },
    savePic (optType) {
      const _this = this
      this.picture.optType = optType
      pictureService.optPic(_this.picture).then(response => {
        if (Utopa.isValidRequest(response)) {
          this.$message('操作成功')
          _this.updateList()
          _this.dialogFormVisible = false
          _this.dialogMoveFormVisible = false
        } else {
          error(response.data.msg)
        }
      }).catch(err => {
        error('服务器异常，请稍后重试')
        console.log('createUser fail: ', err)
        _this.dialogFormVisible = false
        _this.dialogMoveFormVisible = false
      })
    },
    updatePicName () {
      const _this = this
      pictureService.updatePic(_this.picture).then(response => {
        if (Utopa.isValidRequest(response)) {
          this.$message('更新成功')
          _this.updateList()
          _this.dialogFormVisible = false
        } else {
          error(response.data.msg)
        }
      }).catch(err => {
        error('服务器异常，请稍后重试')
        console.log('createUser fail: ', err)
        _this.dialogFormVisible = false
      })
    },
    handleCurrentChange (pageNo) {
      this.listQuery.pageNo = pageNo
      this.updateList()
    },
    handleSizeChange (pageSize) {
      this.listQuery.pageSize = pageSize
      this.updateList()
    },
    checkSelectable () {
      return this.checked
    },
    submit () {
      this.dialogVisible = false
      const ids = this.checkedData.join(',')
      this.$emit('successCBK', ids)
    },
    imageSuccessCBK (arr) {
      this.updateList()
    },
    checkAll (ele) {
      this.checkedData = []
    },
    selectRow (selection, row) {
      this.checkedData = []
      selection.forEach(e => {
        this.checkedData.push(e.id)
      })
    },
    selectAll (selection) {
      this.checkedData = []
      selection.forEach(e => {
        this.checkedData.push(e.id)
      })
    },
    doCheck () {
      this.checkedData.forEach(data => {
        this.list.forEach(ele => {
          if (ele.id === data) {
            this.$refs.mytable.toggleRowSelection(ele, true)
          }
        })
      })
      console.log(this.checkedData)
    },
    handleBatchMove () {
      const ids = this.checkedData.join(',')
      if (ids === '') {
        error('请勾选需要移动的选项')
        return
      }
      this.movePic(ids)
    },
    handleBatchDelete () {
      const ids = this.checkedData.join(',')
      if (ids === '') {
        error('请勾选需要删除的选项')
        return
      }
      this.deletePic(ids)
    }
  }
}
</script>

