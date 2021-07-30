import { config } from '../config.js'
import { login } from './login.js'
const Login = new login();
// # 解构
class HTTP {
  request({ url, data = {}, method = 'GET' }) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this._request(url, resolve, reject, data, method)
    });
  }
  _request(url, resolve, reject, data = {}, method = 'GET') {
    const token = wx.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60' //60秒
    }
    if (token) header['Authorization'] = token
    const pages = getCurrentPages()
    if (!token && pages[pages.length - 1].route !== 'pages/my/index') {
      wx.showToast({
        icon: 'none',
        title: '您尚未登录！',
        duration: 3000
      })
      return
    }
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          if (res.data.code == '200') {
            resolve(res.data.result)
          } else if (res.data.code == '10001') {
            // token过期
            wx.removeStorageSync('token');
            wx.removeStorageSync('userId');
            Login.wxLogin(() => {
              this._request(url, resolve, reject, data, method)
            })
          } else if (res.data.code == '303') {
            // 当前店铺掉线
            reject(res.data)
          }  else if (res.data.code == '10005') {
            // 店铺到期， 请充值
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 6000,
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/my/index'
                  });
                }, 6000)
              }
            })
          } else {
            reject(res.data.msg)
          }
        } else {
          reject(res.data.msg)
        }
      },
      fail: (err) => {
        reject(err.errMsg)
      }
    })
  }
}

export { HTTP }
