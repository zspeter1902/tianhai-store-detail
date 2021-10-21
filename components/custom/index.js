// pages/list/components/custom/index.js
const app =  getApp();
Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
    multipleSlots: true
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    darkMode: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    back: true,
    statusBarHeight: app.globalData.navTop,
    capsuleHeight: app.globalData.capsuleHeight,
    capsuleWidth: app.globalData.capsuleWidth
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const pages = getCurrentPages()
      console.log(pages)
      this.setData({
        back: pages.length <= 1
      })
    },
    detached: function() {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goBack() {
      wx.navigateBack()
    },
    changeMode(bool) {
      this.setData({
        darkMode: bool
      })
    }
  }
})
