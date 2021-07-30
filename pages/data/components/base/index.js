// pages/data/components/base/index.js
Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    index: 0,
    time: null
  },
  /**
   * 组件的生命周期
  */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      //获取年份
      var Y =date.getFullYear();
      //获取月份
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      this.setData({
        time: Y + '-' + M + '-' + D
      })
    },
    detached: function() {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange(e) {
      const index = e.detail.value
      this.setData({
        index: index
      })
      this.triggerEvent('select', { index })
    }
  }
})
