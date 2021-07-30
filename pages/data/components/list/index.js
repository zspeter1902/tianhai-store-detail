// pages/data/components/base/index.js
import {userModel} from '../../../../models/user.js';
const user = new userModel()
import {login} from '../../../../utils/login.js';
const Login = new login();
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
    shopId: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    switch: false,
    lists: [],
    lists2: [],
    dialogShow: false,
    formData: {
      time: null,
      mealTime: null
    },
    rules: [{
      name: 'time',
      rules: [{required: true, message: '请输入时间'}, {range: [1, 20], message: '值在1-20之间'}],
    }, {
      name: 'mealTime',
      rules: [{required: true, message: '请输入时间'}, {range: [40, 60], message: '值在40-60之间'}],
    }],
    realTime: null //实时数据对象
  },
  /**
   * 组件的生命周期
   */
   lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
    }
  },
  observers: {
    'shopId': function(newVal) {
      if (newVal) {
        clearInterval(this.data.realTime)
        this.getInfo()
      }
    }
  },
  pageLifetimes: {
    show: function () {
      this.data.realTime = setInterval(() => {
        // 请求服务器数据
        this.getInfo()
        // 反馈提示
        // wx.showToast({
        //   title: '数据已更新！'
        // })
      }, 4 * 60000)//间隔时间
      // 更新数据
      // this.setData({
      //   realTime: this.data.realTime
      // })
    },
    hide: function () {
      clearInterval(this.data.realTime)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      Login.checkLogin(() => {
        user.getOrders(this.data.shopId).then(res => {
          this.setData({
            lists: res.data.mt,
            lists2: res.data.elem,
            switch: !!Number(res.status),
            'formData.time': res.meal_time,
            'formData.mealTime': res.meal_time_ad
          })
        }).catch(err => {
          if (err.code == 303) {
            this.triggerEvent('tip', {tip: true})
          }
        })
      }, false)
    },
    onSwitch(e) {
      const msg = e.detail ? '打开' : '关闭'
      wx.showModal({
        title: `您确定${msg}自动出单功能吗？`,
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#4037CF',
        success: (result) => {
          if(result.confirm){
            this.setAutoList(e.detail)
          } else {
            this.setData({
              switch: !e.detail
            })
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
    setAutoList(status, time, mealTime) {
      Login.checkLogin(res => {
        user.setShopTime(this.data.shopId, +status, time, mealTime).then(res => {
          this.setData({
            switch: status
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'success'
          })
        }).catch((err) => {
          this.setData({
            switch: !status
          })
          wx.showToast({
            title: '设置失败',
            icon: 'error'
          })
        })
      })
    },
    openTime() {
      this.setData({
        dialogShow: true
      })
    },
    onClose() {
      this.setData({
        dialogShow: false
      })
    },
    formInputChange(e) {
      const {field} = e.currentTarget.dataset
      this.setData({
          [`formData.${field}`]: e.detail.value
      })
    },
    formSubmit() {
      this.selectComponent('#form').validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            wx.showToast({
              icon: 'error',
              title: errors[firstError[0]].message
            })
          }
        } else {
          const formData = this.data.formData
          this.setAutoList(+this.data.switch, formData.time, formData.mealTime)
          this.setData({
            dialogShow: false
          })
        }
      })
    }
  }
})
