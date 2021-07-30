import { config } from "../config.js"
class login {
  checkLogin(callback, isMsg = true) {
    const that = this
    const token = wx.getStorageSync('token');
    const pages = getCurrentPages()
    if (token) {
      callback && callback()
    } else if (isMsg) {
      // 登录
      wx.showModal({
        title: '提示',
        content: '您尚未登录！',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#333333',
        confirmText: '确定',
        confirmColor: '#4037CF',
        success: (result) => {
          if (result.confirm) {
            wx.removeStorageSync('userId');
            if (pages[pages.length - 1].route == 'pages/my/index') {
              that.wxLogin()
            } else {
              wx.switchTab({
                url: '/pages/my/index'
              });
            }
          }
        },
      });
    }
  }

  async wxLogin(callback) {
    const wxa = wx.async(['login'])
    const userInfo = wx.getStorageSync('userInfo')
    // const accountInfo = wx.getAccountInfoSync();
    // const appid = accountInfo.miniProgram.appId;
    try {
      const res1 = await wxa.login()
      // console.log(res1)
      wx.request({
        url: config.api_base_url + 'login/wxLogin',
        method: 'post',
        data: {
          code: res1.code,
          nick_name: userInfo.nickName
        },
        success: (res) => {
          const result = res.data.result
          if (res.data.code == 200) {
            wx.removeStorageSync('token')
            wx.removeStorageSync('userId')
            if (result.token) {
              wx.setStorageSync('token', result.token)
            }
            wx.setStorageSync('userId', result.user_info.id)
            wx.setStorageSync('userData', result.user_info)
            if (callback) {
              callback()
              return
            }
            if (getCurrentPages().length != 0) {
              getCurrentPages()[getCurrentPages().length - 1].onLoad()
            }
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export { login }