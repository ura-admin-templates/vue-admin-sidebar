<template>
  <section class="ura-login">
    <div class="ura-login-container">
      <h3 class="ura-login-header">管理平台登陆</h3>
      <el-form class="ura-login-body" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <el-form-item prop="account">
          <el-input name="account" type="text" v-model="loginForm.account" placeholder="账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item prop="capcha">
          <el-input
            class="capcha-input"
            name="capcha"
            type="text"
            v-model="loginForm.capcha"
            placeholder="验证码" />
          <span class='capcha-code'><img @click="refreshCapcha()" :src="capchaCodeImage" /></span>
        </el-form-item>
      </el-form>
      <el-button class="ura-login-footer" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </div>

  </section>
</template>

<style lang="scss" scoped>
  .ura-login{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ura-login-container{
    border: 1px solid #eee;
    border-radius: 6px;
    background: #fff;
    width: 50%;
    max-width: 400px;
    padding: 10px 20px 20px 20px;
    box-shadow: 1px 1px 3px #ddd;
  }
  .ura-login-header{
    margin: 10px 0 30px 0;
    text-align: center;
  }
  .el-input.capcha-input{
    width: 75%;
  }
  .capcha-code{
    display: inline-block;
    width: 25%;
    height: 40px;
    line-height: 40px;
    padding-left: 2px;
    vertical-align: bottom;
    > img{
      width: 100%;
      height: 100%;
    }
  }
  .ura-login-body{

  }
  .ura-login-footer{
    padding: 12px 15px;
    width: 100%;
  }
</style>

<script>
export default {
  name: 'login',
  data () {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        capcha: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        capcha: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      loading: false
    }
  },
  computed: {
    capchaCodeImage () {
      return this.refreshCapcha()
    }
  },
  methods: {
    refreshCapcha () {
      return 'http://dummyimage.com/90x54/50B347/FFF&text=8 f2 a'
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('loginByAccount', this.loginForm).then(response => {
            this.loading = false
            if (response.code !== 0) {
              this.$message({
                message: response.msg || '登录失败',
                type: 'error'
              })
              this.$router.push({path: '/login'})
            } else {
              this.$router.push({path: '/'})
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

