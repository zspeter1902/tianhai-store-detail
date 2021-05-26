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
        confirmColor: '#CA6FFF',
        success: (result) => {
          if (result.confirm) {
            wx.removeStorageSync('openId');
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
    const accountInfo = wx.getAccountInfoSync();
    const appid = accountInfo.miniProgram.appId;
    try {
      const res1 = await wxa.login()
      wx.request({
        url: config.api_base_url + 'login/wxLogin',
        method: 'GET',
        data: {
          code: res1.code,
          appid: appid
        },
        success: (res) => {
          const result = res.data.result
          if (res.data.code == 200) {
            wx.removeStorageSync('token')
            wx.removeStorageSync('openId')
            if (result.token) {
              wx.setStorageSync('token', result.token)
            }
            wx.setStorageSync('openId', result.openid)
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