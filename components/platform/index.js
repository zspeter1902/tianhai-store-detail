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
    shopId: Number,
    list: Object
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
    loginTab: [{title: '手机号授权'}, {title: 'ID授权'}, {title: '密码授权'}],
    loginActiveTab: 0,
    formDataOther: {},
    rulesOther: [{
      name: 'account_id',
      rules: [{required: true, message: '请输入ID号！'}]
    }],
    formDataPassword: {},
    rulesPassword: [{
      name: 'account',
      rules: [{required: true, message: '请输入帐号！'}]
    }, {
      name: 'password',
      rules: [{required: true, message: '请输入密码！'}]
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
      const {type, status} = e.currentTarget.dataset
      // 在线状态 请求中止
      if (status == 1) {
        return
      }
      // 清除定时器(验证码)
      clearTimeout(this.data.timer)
      this.setData({
        type,
        'formData.code': null,
        countDown: '',
        dialogShow: true
      })
    },
    onClose() {
      this.setData({
        dialogShow: false
      })
    },
    onTabClickLogin(e) {
      const index = e.detail.index
      this.setData({
        loginActiveTab: index
      })
    },
    onChangeLogin(e) {
      const index = e.detail.index
      this.setData({
        loginActiveTab: index
      })
    },
    formInputChangeOther(e) {
      const {field} = e.currentTarget.dataset
      this.setData({
          [`formDataOther.${field}`]: e.detail.value
      })
    },
    formInputChangePassword(e) {
      const {field} = e.currentTarget.dataset
      this.setData({
          [`formDataPassword.${field}`]: e.detail.value
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
        console.log(valid)
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
        isSubmit: true
      })
      const shopIds = {}
      if (this.data.shopId) {
        shopIds['shop_id'] = this.data.shopId
      }
      const user_id = wx.getStorageSync('userId');
      user.onAuthorize({
        ...this.data.formData,
        ...shopIds,
        type: this.data.type,
        user_id,
        ...this.data.typeData[this.data.type]
      }).then(() => {
        const that = this
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: '授权提交成功!',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              that.triggerEvent('success')
              that.onClose()
            }, 2000)
          }
        });
      }).catch(err => {
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: err,
          icon: 'error',
          mask: true
        });
      })
    },
    formSubmitOther(e) {
      this.selectComponent('#formOther').validate((valid, errors) => {
        if (valid) {
          this.onLoginOther()
        } else {
          // console.log(errors[0].message)
          wx.showToast({
            title: errors[0].message,
            icon: errors[0].message.length > 7 ? 'none' : 'error',
            duration: 3000,
            mask: true
          });
        }
      })
    },
    onLoginOther() {
      this.setData({
        isSubmit: true
      })
      const shopIds = {}
      if (this.data.shopId) {
        shopIds['shop_id'] = this.data.shopId
      }
      const user_id = wx.getStorageSync('userId');
      user.onAuthorizeId({
        ...this.data.formDataOther,
        type: this.data.type,
        ...shopIds,
        user_id
      }).then(() => {
        const that = this
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: '授权提交成功!',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              that.triggerEvent('success')
              that.onClose()
            }, 2000)
          }
        });
      }).catch(err => {
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: err,
          icon: 'error',
          mask: true
        });
      })
    },
    formSubmitPassword(e) {
      this.selectComponent('#formPassword').validate((valid, errors) => {
        if (valid) {
          this.onLoginPassword()
        } else {
          // console.log(errors[0].message)
          wx.showToast({
            title: errors[0].message,
            icon: errors[0].message.length > 7 ? 'none' : 'error',
            duration: 3000,
            mask: true
          });
        }
      })
    },
    onLoginPassword() {
      this.setData({
        isSubmit: true
      })
      const shopIds = {}
      if (this.data.shopId) {
        shopIds['shop_id'] = this.data.shopId
      }
      const user_id = wx.getStorageSync('userId');
      user.onAuthorizePassword({
        ...this.data.formDataOther,
        type: this.data.type,
        ...shopIds,
        user_id
      }).then(() => {
        const that = this
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: '授权提交成功!',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              that.triggerEvent('success')
              that.onClose()
            }, 2000)
          }
        });
      }).catch(err => {
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: err,
          icon: 'error',
          mask: true
        });
      })
    }
  }
})
