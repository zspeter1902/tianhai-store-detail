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
    checked: Boolean,
    color: {
      type: String,
      value: '#4037CF'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSwitch: false
  },
  observers: {
    'checked': function(newVal) {
      if (this.data.isSwitch !== newVal) {
        this.setData({
          isSwitch: newVal
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSwitch() {
      this.setData({
        isSwitch: !this.data.isSwitch
      })
      this.triggerEvent('switch', this.data.isSwitch)
    }
  }
})
