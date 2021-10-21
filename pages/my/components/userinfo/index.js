import {login} from '../../../../utils/login.js';
const Login = new login();
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
              Login.wxLogin(() => {

              });
            },
          });
        }
      })
    }
  }
})
