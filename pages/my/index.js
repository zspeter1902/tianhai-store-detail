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
    loading: false,
    userData: wx.getStorageSync('userData'),
    token: wx.getStorageSync('token'),
    type: 'dot-gray', //dot-gray circle
    userInfo: {},
    dialogShow: false,
    buttons: [
      {
        type: 'primary',
        className: '',
        text: '立即支付',
        value: 0
      }
    ],
    tabs: [],
    activeTab: 0,
    // 店铺列表
    lists: [],
    types: {
      '美团': 1,
      '饿了么': 2
    },
    typesMobile: {
      '1': 'mt_phone',
      '2': 'elem_phone'
    },
    typesId: {
      '1': 'mt_account_id',
      '2': 'elem_account_id'
    },
    type: null,
    platformShow: false,
    isSubmit: false,
    formData: {},
    rules: [{
      name: 'mobile',
      rules: [{required: true, message: '请输入手机号！'}, {mobile: true, message: '手机号格式有误！'}]
    }, {
      name: 'code',
      rules: [{required: true, message: '请输入验证码！'}]
    }],
    typeData: {},
    // 选中待支付会员
    vipItem: {},
    // 天数
    useRatio: null,
    useDay: null,
    // 倒计时
    countDown: '',
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        loading: true
      })
      this.getUserInfo()

      this.getVip()
    }
  },
  getUserInfo() {
    user.getUserInfo().then(res => {
      wx.setStorageSync('userData', res.user_info)
      this.setData({
        userData: res.user_info
      })
      this.calcDay()
    }).catch(err => {
      this.calcDay()
    })
  },
  getUserProfile() {
    const that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        // wx.setStorageSync('userInfo', res.userInfo)
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
          success: (result)=>{
            that.setData({
              loading: true,
              type: 'circle'
            })
            Login.wxLogin(() => {
              that.setData({
                loading: false,
                type: 'dot-gray',
                userData: wx.getStorageSync('userData'),
                token: wx.getStorageSync('token')
              })
              if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                that.getTabBar().setData({
                  isPower: this.data.userData.is_single_store != 1
                })
              }
              that.onLoad()
            });
          },
        });
      }
    })
  },
  calcDay() {
    const {expire_date, create_time} = this.data.userData
    const time = new Date().getTime()
    const startTime = new Date(create_time).getTime()
    const endTime = new Date(expire_date).getTime()
    // 计算总天数
    const totalDay = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24))
    // 计算使用天数
    const useDay = Math.ceil((time - startTime) / (1000 * 60 * 60 * 24))
    // 计算使用比率
    const ratio = Math.ceil((useDay * 100) / totalDay)
    // 更新数据
    this.setData({
      useRatio: ratio >= 100 ? 100 : ratio,
      useDay: useDay
    })
  },
  getList() {
    user.getShopAccount().then(res => {
      this.setData({
        loading: false,
        lists: res.data
      })
    }).catch(() => {
      this.setData({
        loading: false
      })
    })
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
  onTabClick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },
  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },
  getVip() {
    user.getVipList().then(res => {
      const tabs = []
      const types = {
        'more': '多店',
        'single': '单店'
      }
      for (const key in res) {
        tabs.push({
          title: types[key],
          lists: res[key]
        })
      }
      this.setData({
        tabs
      })
    })
  },
  vipCheck(e) {
    const {list} = e.currentTarget.dataset
    this.setData({
      vipItem: list,
      [`buttons[0].text`]: '立即支付' + list.amount + '元'
    })
  },
  onPay(e) {
    // const {index, item} = e.detail
    const id = this.data.vipItem.id
    // console.log(index, item)
    // let timestamp = Date.parse(new Date());
    // timestamp = timestamp / 1000;
    if (!id) {
      wx.showToast({
        icon: 'none',
        title: '请选择套餐！',
        mask: true
      })
      return
    }
    const that = this
    user.onBuy(id).then(res => {
      wx.requestPayment({
        timeStamp: res.timeStamp.toString(),
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: res.signType,
        paySign: res.paySign,
        success(res) {
          wx.showToast({
            title: '购买成功！',
            icon: 'success',
            success: (result)=>{
              that.getUserInfo()
              that.getList()
              that.onClose()
            },
          });
        },
        fail(err) {
          console.log(err)
        }
      });
    })
  },
  onSuccess() {
    this.getList()
  },
  // 重新绑定
  selectStore(e) {
    const {type, item} = e.currentTarget.dataset
    const formData = {
      shop_id: item.shop_id,
      mobile: item[this.data.typesMobile[type]]
    }
    this.setData({
      type,
      formData: formData,
      countDown: '',
      platformShow: true
    })
  },
  // 取消授权
  cancelStore(e) {
    const that = this
    const {type, item} = e.currentTarget.dataset
    const data = {
      shop_id: item.shop_id,
      [this.data.typesId[type]]: item[[this.data.typesId[type]]]
    }
    user.cancelAuthorize(data).then(res => {
      wx.showToast({
        title: '取消成功！',
        icon: 'none',
        duration: 2000,
        success: () => {
          that.onLoad()
        }
      });
    })
  },
  onClosePlatform() {
    this.setData({
      platformShow: false
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
  },
  getCode() {
    this.selectComponent('#form').validateField('mobile',(valid, errors) => {
      if (valid) {
        user.getCode(this.data.formData.mobile, this.data.type).then(res => {
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
  onHttpSubmit() {
    this.setData({
      isSubmit: true
    })
    const user_id = wx.getStorageSync('userId');
    user.onAuthorize({
      ...this.data.formData,
      type: this.data.type,
      user_id,
      ...this.data.typeData[this.data.type]
    }).then(() => {
      const that = this
      this.setData({
        isSubmit: false
      })
      wx.showToast({
        title: '提交成功!',
        icon: 'success',
        duration: 2000,
        success: () => {
          that.onLoad()
          setTimeout(() => {
            that.onClosePlatform()
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.setTabBar(this, 2)
    this.getList()
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
    clearTimeout(this.data.timer)
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