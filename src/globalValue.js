const userInfo = {}

// 用export default 暴露出去,供其他vue文件使用
export default {
  userInfo: {},

  // 设置属性方法
  setUserInfo (userInfo) {
    this.userInfo = userInfo
  }
}
