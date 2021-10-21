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
    title: String,
    url: String
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
