const app =  getApp();
import { config } from '../../config.js';
import {login} from '../../utils/login.js';
const Login = new login();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: config.title,
    loading: false,
    type: 'dot-gray' //dot-gray circle
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
                type: 'dot-gray'
              })
              wx.redirectTo({
                url: '/pages/authorization/index'
              });
            });
          },
        });

      }
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