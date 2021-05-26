// pages/pay/pay.js
const app =  getApp();
import {login} from '../../utils/login.js';
const Login = new login();
import {userModel} from '../../models/user.js';
const user = new userModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    loading: true,
    token: wx.getStorageSync('token'),
    type: 'dot-gray', //dot-gray circle
    userInfo: {},
    firstId: null,
    isFirstBind: false,
    secondId: null,
    isSecondBind: false,
    dialogShow: false,
    dialogShowMessage: false,
    formData: {},
    rules: [{
      name: 'name',
      rules: [{required: true, message: '请输入店铺名称'}]
    }, {
      name: 'code',
      rules: [{required: true, message: '请输入邀请码！'}]
    }],
    phone: '13865970587',
    message: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBindInfo()
    this.getMessage()
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
    setTimeout(() => {
      this.setData({
        loading: false
      })
    }, 1500)
  },
  getMessage() {
    const token = wx.getStorageSync('token');
    if (!token) {
      return
    }
    user.getNotice().then(res => {
      const message = res.data[0]
      this.setData({
        message: message
      })
      if (!!message.status) {
        this.setData({
          loading: false
        })
        this.onOpenMessage()
      }
    })
  },
  getBindInfo() {
    const token = wx.getStorageSync('token');
    if (!token) {
      return
    }
    user.getShopAccount().then(res => {
      const result = res.data
      this.setData({
        firstId: result.mt_account_id,
        isFirstBind: !!result.mt_account_id,
        secondId: result.eleme_account_id,
        isSecondBind: !!result.eleme_account_id
      })
    })
  },
  inputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },
  onEdit(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [field]: false
    })
  },
  onBind() {
    user.bindShopAccountId(this.data.firstId, this.data.secondId).then(() => {
      wx.showToast({
        title: '绑定成功',
        icon: 'success'
      })
      this.setData({
        'isFirstBind': !!this.data.firstId,
        'isSecondBind': !!this.data.secondId
      })
    }).catch(err => {
      wx.showToast({
        title: '绑定失败',
        icon: 'error'
      })
    })
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          loading: true,
          type: 'circle'
        })
        Login.wxLogin(() => {
          this.getBindInfo()
          this.setData({
            userInfo: res.userInfo,
            token: wx.getStorageSync('token'),
            loading: false,
            type: 'dot-gray'
          })
        });
      }
    })
  },
  isLogin() {
    const token = wx.getStorageSync('token');
    return !!token
  },
  onOpen() {
    this.setData({
      dialogShow: true
    })
  },
  onClose() {
    this.setData({
      dialogShow: false
    })
  },
  onOpenMessage() {
    this.setData({
      dialogShowMessage: true
    })
  },
  onCloseMessage() {
    this.setData({
      dialogShowMessage: false
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },
  formSubmit(e) {
    const {mtId, elemeId} = this.data.formData
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid || (!mtId && !elemeId)) {
        if (!errors) {
          wx.showToast({
            icon: 'error',
            title: '请填写店铺ID'
          })
        }
        const firstError = Object.keys(errors)
        if (firstError.length) {
          wx.showToast({
            icon: 'error',
            title: errors[firstError[0]].message
          })
        }
      } else {
        this.onHttpSubmit()
      }
    })
  },
  onHttpSubmit() {
    const {name, code, mtId, elemeId} = this.data.formData
    user.applyTest({
      shop_name: name,
      code,
      mt_account_id: mtId,
      eleme_account_id: elemeId
    }).then(() => {
      const that = this
      wx.showToast({
        title: '已成功提交申请',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            that.onClose()
          }, 2000)
        }
      });
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'error',
        mask: true
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isFirstBind: !!this.data.firstId,
      isSecondBind: !!this.data.secondId
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})