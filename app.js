// app.js
import {config} from './config.js'
import {toAsync} from './utils/async.js'
App({
  onLaunch() {
    // 私有方法
    wx.async = toAsync
    // 获取设备信息
    this.getSystemInfo();
    // 隐藏系统tabbar
    // wx.hideTabBar();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    if (logs.length >= 3) {
      logs.splice(2)
    }
    wx.setStorageSync('logs', logs)

    // const token = wx.getStorageSync('token');
    // if (!!token) {
    //   wx.switchTab({
    //     url: 'pages/data/index'
    //   })
    // }
    // 版本更新
    this.update();
  },
  update: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              confirmColor: '#4037CF',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              confirmColor: '#4037CF',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        confirmColor: '#4037CF',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  setTabBar(that, index) {
    if (typeof that.getTabBar === 'function' && that.getTabBar()) {
      that.getTabBar().setData({
        selected: index
      })
    }
  },
  globalData: {
    current: 0,
    shopId: null,
    picUrl: config.picUrl,
    copyright: config.copyright
  }
})
