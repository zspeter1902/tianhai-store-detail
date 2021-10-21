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
    url: String,
    color: {
      type: String,
      value: '#666666'
    },
    borderColor: {
      type: String,
      value: '#60667E'
    },
    backgroundColor: {
      type: String,
      value: 'transparent'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
