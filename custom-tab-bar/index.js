// custom-tab-bar/index.js
const app = getApp()
import {login} from '../utils/login.js';
const Login = new login();
Component({

  /**
   * 组件的属性列表
   */

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isPower: false,
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false,
    show: true,
    selected: 0,
    color: "#89979E",
    selectedColor: "#3441FF",
    list: [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "/images/tabbar/index.png",
        "selectedIconPath": "/images/tabbar/index_checked.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/my/index",
        "text": "我的",
        "iconPath": "/images/tabbar/my.png",
        "selectedIconPath": "/images/tabbar/my_checked.png"
      }
    ]
  },
  lifetimes: {
      attached: function () {
        // 在组件实例进入页面节点树时执行
        const userData = wx.getStorageSync('userData');
        // is_single_store 1 单店 2 多店
        this.setData({
          isPower: userData ? userData.is_single_store != 1 : false
        })
      },
      detached: function () {
          // 在组件实例被从页面节点树移除时执行
      },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  },
})
