//index.js
//获取应用实例
const app = getApp()
import {login} from '../../utils/login.js';
import util from '../../utils/util.js';
import {userModel} from '../../models/user.js';

const Login = new login();
const user = new userModel()
//Page Object
Page({
  data: {
    // 骨架屏相关
    base: app.globalData.picUrl,
    loading: true,
    lists: [],
    shopId: null,
    tabs: [
      {
        title: '出单详情'
      },
      {
        title: '评价回复'
      },
      {
        title: '智能推广'
      }
    ],
    tabsData: [],
    active: 0,
    // 顶部条
    isBar: false,
    viewHeight: 0,
    isRefresh: false,
    isTip: false,
  },
  //options(Object)
  onLoad: function(options){
    // 获取信息
    this.getHeight()
    this.getList()
  },
  getHeight() {
    let query = wx.createSelectorQuery()
    query.select('.view-base').boundingClientRect(rect => {
      let height = rect.height
      this.setData({
        viewHeight: height
      })
    }).exec()
  },
  getList() {
    user.getShopAccount().then(res => {
      this.setData({
        loading: false,
      })
      if (!res.data.length) {
        wx.showToast({
          title: '请先绑定店铺',
          icon: 'none',
          duration: 3000,
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/authorization/index',
              })
            }, 3000)
          }
        });
        return
      }
      this.setData({
        lists: res.data,
        shopId: res.data[0].shop_id
      })
    })
  },
  getBase(e) {
    Login.checkLogin(() => {
      this.setData({
        shopId: this.data.lists[e.detail.index].shop_id
      })
    })
  },
  onLink() {
    // 单店铺跳转重新登录
    this.setData({
      isTip: false
    })
    wx.switchTab({
      url: '/pages/my/index',
      success: (result)=>{

      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onTip(e) {
    this.setData({
      isTip: e.detail.tip
    })
  },
  onChangeActive(e) {
    this.setData({
      active: e.detail
    })
  },

  onReady: function() {
  },
  onShow: function() {
    app.setTabBar(this, 0)
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({
        isRefresh: true
      })
    } else if (this.data.isRefresh) {
      this.setData({
        isRefresh: false
      })
      this.onLoad()
    }
  },
  onHide: function() {
  },
  onPageScroll(e) {
    util.throttle(() => {
      this.setData({
        isBar: e.scrollTop > this.data.viewHeight - 60
      })
    })()
  },
  onUnload: function() {
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function(){
  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){
  }
});
