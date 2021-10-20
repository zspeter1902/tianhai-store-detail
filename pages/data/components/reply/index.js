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
    switch: true,
    switchObj: {},
    switchArr: ['good_is_reply', 'mid_is_reply', 'bad_is_reply'],
    lists: {},
    lists2: {},
    dialogShow: false,
    formData: [],
    rules: [],
    isDelete: false,
    isSearchShow: false,
    resultData: [],
    showIndex: 0,
    mtSearch: [],
    elemSearch: [],
    tabs: [{title: '好评'}, {title: '中评'}, {title: '差评'}],
    activeTab: 0
  },
  observers: {
    'shopId': function(newVal) {
      if (newVal) {
        this.getInfo()
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      Login.checkLogin(() => {
        user.getShopReply(this.data.shopId).then(res => {
          const key = this.data.switchArr[this.data.activeTab]
          this.setData({
            formData: res.data,
            switch: !!Number(res.status[key]),
            switchObj: res.status
          })
        })
        user.getReplyStatistics(this.data.shopId).then(res => {
          this.setData({
            lists: res.mt,
            lists2: res.elem
          })
        })
      }, false)
    },
    setReply(shopId, num, reply, type) {
      Login.checkLogin(() => {
        user.setShopReply(shopId, num, reply, type).then(res => {
          wx.showToast({
            title: '保存成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          });
        }).catch(err => {
          wx.showToast({
            title: '保存失败！',
            icon: 'error',
            duration: 1500,
            mask: true
          });
        })
      })
    },

    onSwitch(e) {
      const {key} = e.currentTarget.dataset
      const msg = e.detail ? '打开' : '关闭'
      wx.showModal({
        title: `您确定${msg}自动回评功能吗？`,
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#4037CF',
        success: (result) => {
          if(result.confirm){
            this.setAutoReply(e.detail, key)
          } else {
            this.setData({
              switch: !e.detail,
              [`switchObj.${key + '_is_reply'}`]:  (+!e.detail).toString()
            })
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
    // 查询差评开始
    openSearch() {
      this.setData({
        isSearchShow: true
      })
    },
    onCloseSearch() {
      this.setData({
        isSearchShow: false
      })
    },
    onSearch(e) {
      const { type } = e.currentTarget.dataset
      const types = {
        'mt': {
          data: 'mtSearch',
          name: 'lists'
        },
        'elem': {
          data: 'elemSearch',
          name: 'lists2'
        }
      }
      if (this.data[types[type].data].length) {
        this.setData({
          resultData: this.data[types[type].data]
        })
        this.openSearch() // 打开弹窗
        return
      }
      user.getBadReplyList(this.data[types[type].name].account_id).then(res => {
        this.setData({
          [types[type].data]: res.bad_review,
          resultData: res.bad_review
        })
        this.openSearch() // 打开弹窗
      })
    },
    onFold(e) {
      const { index } = e.currentTarget.dataset
      if (this.data.resultData.length > 1) {
        this.setData({
          showIndex: index != this.data.showIndex ? index : null
        })
      }
    },
    setSwitch() {
      const data = this.data.switchObj
      const key = this.data.switchArr[this.data.activeTab]
      this.setData({
        switch: !!Number(data[key])
      })
    },
    // 查询差评结束
    setAutoReply(status, key) {
      Login.checkLogin(() => {
        user.bindShopReview(this.data.shopId, +status, key).then(res => {
          this.setData({
            switch: status,
            [`switchObj.${key + '_is_reply'}`]: (+status).toString()
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'success'
          })
        }).catch(err => {
          this.setData({
            switch: !status,
            [`switchObj.${key + '_is_reply'}`]: (+!status).toString()
          })
          wx.showToast({
            title: '设置失败！',
            icon: 'error'
          })
        })
      })
    },
    onTabClick(e) {
      const index = e.detail.index
      this.setSwitch()
      this.setData({
        activeTab: index
      })
    },
    onTabChange(e) {
      const index = e.detail.index
      this.setSwitch()
      this.setData({
        activeTab: index
      })
    },
    openReply() {
      this.getInfo()
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
      const {field, key, index} = e.currentTarget.dataset
      this.setData({
        [`formData.${key}.${index}`]: e.detail.value.trim()
      })
    },
    onAdd() {
      const len = this.data.formData.length
      const types = ['good', 'mid', 'bad']
      const currentType = types[this.data.activeTab]
      if (len < 10) {
        this.setData({
          [`formData[${len}]`]: {}
        })
      }
    },
    switchDelete() {
      this.setData({
        isDelete: !this.data.isDelete
      })
    },
    formDelete(e) {
      const {index, key} = e.currentTarget.dataset
      Login.checkLogin(() => {
        user.deleteReply(this.data.shopId, index, key).then(() => {
          this.getInfo()
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          });
        }).catch(err => {
          wx.showToast({
            title: '删除失败！',
            icon: 'error',
            duration: 1500,
            mask: true
          });
        })
      })
    },
    formSubmit(e) {
      const {form, index, key} = e.currentTarget.dataset
      const content = this.data.formData[key][index]
      console.log(content)
      this.selectComponent('#' + form).validate((valid, errors) => {
        if (!content) {
          wx.showToast({
            icon: 'error',
            title: '请输入内容！'
          })
        } else if (content.length < 10) {
          wx.showToast({
            icon: 'none',
            title: '内容不为小于10个字！'
          })
        } else {
          this.setReply(this.data.shopId, index, content, key)
          // this.setData({
          //   dialogShow: false
          // })
        }
      })
    }
  }
})
