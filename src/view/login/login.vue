<style lang="less">
  @import "./login.less";
</style>
<template>
  <div class="login">
    <div class="login-con">
      <Card :bordered="false" icon="log-in" title="欢迎登录">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { setToken } from '../../libs/util'
// import globalVariable from '../../api/globalVariable'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['setAccess']),
    // handleSubmit ({ userName, password }) {
    //   this.handleLogin({ userName, password }).then(res => {
    //     this.getUserInfo().then(res => {
    //       this.$router.push({
    //         name: this.$config.homeName
    //       })
    //     })
    //   })
    // },
    // 我自己写的登录
    handleSubmit (obj) {
      this.$axios
        .post('/sysusers/login', {
          web_account: obj.userName,
          web_password: obj.password
        })
        .then(response => {
          if (response.data.state === 200) {
            setToken(1)
            //  globalVariable.setUserInfo(response.content);
            this.globalVariable.setUserInfo(response.data.content)
            let access = []
            if (response.data.content.web_account && response.data.content.web_account.length > 0) {
              access = response.data.content.web_account.split()
            }
            console.log(access)
            this.setAccess(access)
            console.log(this.globalVariable.getUserInfo())
            this.$router.push({
              name: this.$config.homeName
            })
          }
          // console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style>
</style>
