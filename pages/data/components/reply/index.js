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
    lists: {},
    lists2: {},
    dialogShow: false,
    formData: [],
    rules: [{
      name: 'reply',
      rules: [{required: true, message: '请输入内容'}]
    }],
    isDelete: false,
    isSearchShow: false,
    resultData: [],
    showIndex: 0,
    mtSearch: [],
    elemSearch: []
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
          this.setData({
            formData: res.data,
            switch: !!Number(res.status)
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
    setReply(shopId, num, reply) {
      Login.checkLogin(() => {
        user.setShopReply(shopId, num, reply).then(res => {
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
            this.setAutoReply(e.detail)
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
    // 查询差评结束
    setAutoReply(status) {
      Login.checkLogin(() => {
        user.bindShopReview(this.data.shopId, +status).then(res => {
          this.setData({
            switch: status
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'success'
          })
        }).catch(err => {
          this.setData({
            switch: !status
          })
          wx.showToast({
            title: '设置失败！',
            icon: 'error'
          })
        })
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
      const {field, index} = e.currentTarget.dataset
      this.setData({
          [`formData[${index}].${field}`]: e.detail.value
      })
    },
    onAdd() {
      const len = this.data.formData.length
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
      const {index} = e.currentTarget.dataset
      const arr = this.data.formData
      const currentData = arr.splice(index, 1)[0]
      Login.checkLogin(() => {
        user.deleteReply(this.data.shopId, currentData.num).then(() => {
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          });
          this.setData({
            formData: arr
          })
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
      const {form, index} = e.currentTarget.dataset
      this.selectComponent('#' + form).validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            wx.showToast({
              icon: 'error',
              title: errors[firstError[0]].message
            })
          }
        } else {
          const currentData = this.data.formData[index]
          this.setReply(this.data.shopId, currentData.num || this.data.formData.length, currentData.reply)
          // this.setData({
          //   dialogShow: false
          // })
        }
      })
    }
  }
})
