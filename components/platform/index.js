// components/platform/index.js
import {userModel} from '../../models/user.js';
const user = new userModel()
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
    shopId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    token: wx.getStorageSync('token'),
    dialogShow: false,
    loading: false,
    formData: {},
    rules: [{
      name: 'mobile',
      rules: [{required: true, message: '请输入手机号！'}, {mobile: true, message: '手机号格式有误！'}]
    }, {
      name: 'code',
      rules: [{required: true, message: '请输入验证码！'}]
    }],
    type: null,
    types: {
      '美团': 1,
      '饿了么': 2
    },
    typeData: {},
    // 倒计时
    countDown: '',
    timer: null
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      clearTimeout(this.data.timer)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onOpen(e) {
      const {type} = e.currentTarget.dataset
      this.setData({
        type,
        formData: {},
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
    getCode() {
      wx.showLoading({
        title: '获取中...',
        mask: true,
      });
      this.selectComponent('#form').validateField('mobile',(valid, errors) => {
        if (valid) {
          user.getCode(this.data.formData.mobile, this.data.type).then(res => {
            wx.hideLoading();
            // 设置1分钟倒计时
            this.data.countDown = 60
            this.countdown()
            this.data.typeData[this.data.type] = res
          }).catch(err => {
            wx.showToast({
              title: err,
              icon: err.length > 7 ? 'none' : 'error',
              duration: 3000,
              mask: true
            });
          })
        } else {
          wx.showToast({
            title: errors.message,
            icon: errors.message.length > 7 ? 'none' : 'error',
            duration: 3000,
            mask: true
          });
        }
      })
    },
    /* 1分钟倒计时 */
    countdown() {
      clearTimeout(this.data.timer)
      // 渲染倒计时时钟
      this.setData({
        countDown: this.data.countDown
      });
      if (this.data.countDown <= 0) {
        this.setData({
          countDown: ''
        });
        // timeout则跳出递归
        return;
      }
      this.data.timer = setTimeout(() => {
        // 放在最后--
        this.data.countDown -= 1;
        this.countdown();
      }, 1000)
    },
    formSubmit(e) {
      this.selectComponent('#form').validate((valid, errors) => {
        if (valid) {
          this.onHttpSubmit()
        }
      })
    },
    onHttpSubmit() {
      this.setData({
        loading: true
      })
      const shopIds = {}
      if (this.data.shopId) {
        shopIds['shop_id'] = this.data.shopId
      }
      user.onAuthorize({
        ...this.data.formData,
        ...shopIds,
        ...this.data.typeData[this.data.type]
      }).then(() => {
        const that = this
        this.setData({
          loading: false
        })
        wx.showToast({
          title: '授权提交成功!',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              that.onClose()
            }, 2000)
          }
        });
      }).catch(err => {
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err,
          icon: 'error',
          mask: true
        });
      })
    },
  }
})
