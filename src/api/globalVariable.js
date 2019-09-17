export default {
  setUserInfo (userInfo) {
    window.localStorage.userInfo = JSON.stringify(userInfo)
  },

  getUserInfo () {
    if (window.localStorage.userInfo) {
      return JSON.parse(window.localStorage.userInfo)
    }
    return null
  }
}
