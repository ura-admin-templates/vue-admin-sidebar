<template>
  <div class="upload-container" style="display:inline">
    <el-button icon='upload' size="small" :style="{background:color,borderColor:color}" @click=" dialogUploadVisible=true" type="primary">
      本地上传
    </el-button>
    <el-dialog
        v-model="dialogUploadVisible"
        v-loading="loading"
        element-loading-text="正在上传中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :modal= "false"
        :close-on-click-modal= "false"
        size="large"
        title="图片上传">

        <el-input
            type="textarea"
            readonly="readonly"
            :rows="3"
            :col="10"
            :placeholder="introduction">
        </el-input>
        <hr></hr>
            <el-form>
                <el-form-item label="上传至分类">
                    <el-select clearable class="filter-item" placeholder="选择分类" v-model="dirId"  @visible-change="fetchPicDirList">
                        <el-option label='默认分类' value=''></el-option>
                        <el-option v-for="item in picDirList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        <hr></hr>

        <el-upload
            class="editor-slide-upload"
            :action="action"
            :multiple="true"
            :data="data"
            ref="upload"
            :file-list="fileList"
            :show-file-list="true"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :before-upload="beforeUpload">

            <i class="el-icon-plus"></i>
            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
        </el-upload>
        <hr></hr>
        <span>即将上传 {{amount}} 张照片至 {{dirName}}</span>
        <el-dialog
            :visible.sync="dialogVisible"
            size="small"
            :modal= "false"
            :close-on-click-modal= "false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <div slot="footer" class="dialog-footer text-center">
            <el-button type="primary" @click="handleSubmit">确定上传</el-button>
            <el-button type="primary" @click="dialogUploadVisible = false">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>

import { getQiNiuToken, getImageUrlByQiniuKey } from '@/api/common/qiniu'
import * as pictureService from '@/api/system/picture'
import { Utopa } from '@/common/utopa'
import { error } from '@/utils/dialog'
import { QINIU_UPLOAD_URL } from '@/common/constants'

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#20a0ff'
    }
  },
  data () {
    return {
      dialogUploadVisible: false,
      action: QINIU_UPLOAD_URL,
      data: {token: ''},
      dirId: '',
      listObj: {},
      fileList: [],
      picDirList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      loading: false,
      amount: 0,
      dirName: '默认分类',
      introduction: '1.每次最多可以上传10张图片。\r\n2.请勿重复选择同一个图片文件。\r\n3.图片文件的大小建议控制在500KB以内，图片太大会影响上传速度与网站打开速度。'
    }
  },
  watch: {
    'dirId': function (val) {
      this.picDirList.forEach(element => {
        if (element.id === val) {
          this.dirName = element.name
        }
      })
      if (val === '') {
        this.dirName = '默认分类'
      }
    },
    'fileList': function (val) {
      this.amount = val.length
    },
    'dialogUploadVisible': function (val) {
      if (!val) {
        this.fileList = []
        this.dirId = ''
      }
    }
  },
  methods: {
    checkAllSuccess () {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    // 获取来源列表
    fetchPicDirList () {
      if (!this.picDirList.length) {
        pictureService.fetchPicDirList().then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.picDirList = result.data.picDirList || []
          } else {
            error('获取文件夹列表失败')
          }
        })
      }
    },
    saveFiles (arr) {
      let links = ''
      arr.forEach(ele => {
        links += ele.url + ','
      })
      links = links.substring(0, links.length - 1)
      pictureService.uploadFiles({'links': links, 'dirId': this.dirId}).then(response => {
        this.loading = false
        if (Utopa.isValidRequest(response)) {
          this.$emit('successCBK', arr)
          this.listObj = {}
          this.fileList = []
          this.$message('上传成功')
        } else {
          error('上传失败')
        }
      })
    },
    handleSubmit () {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      if (arr.length < 1) {
        error('请选择图片')
        return
      }
      this.loading = true
      this.saveFiles(arr)
    },
    /* handleSuccess (response, file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        const qiniuServer = 'http://ox2m2b48s.bkt.clouddn.com/'
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = qiniuServer + response.key
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      }, */
    handleSuccess (response, file) {
      const _this = this
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          (function (i) {
            getImageUrlByQiniuKey(response.key).then(res => {
              _this.listObj[objKeyArr[i]].url = res.data.data.url
            })
          })(i)
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG & PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      const _this = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      _this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        getQiNiuToken().then(response => {
          _this.data.token = response.data.data.upToken
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            _this.listObj[fileName] = { uid: file.uid, hasSuccess: false }
          }
          resolve(true)
        }).catch(() => {
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .upload-container {
    .editor-slide-upload {
      margin-bottom: 20px;
      .el-upload--picture-card {
        width: 100%;
      }
    }
  }
</style>
