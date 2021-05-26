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
    shopName: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    types: ['first', 'second', 'third'],
    listArr: {
      promote_balance: '资金总额',
      promote_consume: '今日消耗',
      promote_sugbid: '推荐出价',
      promote_clickCost: '点击成本',
      promote_exposure: '推广曝光',
      promote_clickRate: '推广进店率',
      buyerConvRate: '下单转化率',
      pro_order_cost: '推广每单成本',
    },
    // 美团
    lists: {},
    mtSetting: {},
    // 饿了么
    lists2: {},
    elemeSetting: {},
    dialogShow: false,
    formData: {
    },
    rules: [{
      name: 'promote_budget',
      rules: [
        {required: true, message: '请输入今日预算'},
        {min: 50, message: '值不能小于50元'},
        {
          validator(rule, value, param, models) {
            if (!/^\+?[1-9][0-9]*$/.test(Number(value))) {
              return rule.message
            }
          },
          message: '值不能有小数'
        }
      ],
    }, {
      name: 'first_bid',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[0]) {
            if (!value) {
              return '请输入基础出价'
            }
            if (value > 3) {
              return '值不能高于3元'
            }
            if (value <= 0) {
              return '值不能小于0元'
            }
            if (!/^[0-9]+(.[0-9]{1})?$/.test(Number(value))) {
              return rule.message
            }
          }
        },
        message: '只能一位小数点'
      }],
    }, {
      name: 'second_bid',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[1]) {
            if (!value) {
              return '请输入基础出价'
            }
            if (value > 3) {
              return '值不能高于3元'
            }
            if (value <= 0) {
              return '值不能小于0元'
            }
            if (!/^[0-9]+(.[0-9]{1})?$/.test(Number(value))) {
              return rule.message
            }
          }
        },
        message: '只能一位小数点'
      }],
    }, {
      name: 'third_bid',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[2]) {
            if (!value) {
              return '请输入基础出价'
            }
            if (value > 3) {
              return '值不能高于3元'
            }
            if (value <= 0) {
              return '值不能小于0元'
            }
            if (!/^[0-9]+(.[0-9]{1})?$/.test(Number(value))) {
              return rule.message
            }
          }
        },
        message: '只能一位小数点'
      }],
    }, {
      name: 'first_startTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[0]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择开始时间'
      }],
    }, {
      name: 'second_startTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[1]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择开始时间'
      }],
    }, {
      name: 'third_startTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[2]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择开始时间'
      }],
    }, {
      name: 'first_endTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[0]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择结束时间'
      }],
    }, {
      name: 'second_endTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[1]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择结束时间'
      }],
    }, {
      name: 'third_endTime',
      rules: [{
        validator(rule, value, param, models) {
          if (models.customList[2]) {
            if (!value) {
              return rule.message
            }
          }
        },
        message: '请选择结束时间'
      }],
    }],
    realTime: null, //实时数据对象
    isPicker: false,
    showIndex: null
  },
  observers: {
    'shopName': function(newVal) {
      if (newVal) {
        this.getInfo()
      }
    }
  },
  pageLifetimes: {
    show: function () {
      this.data.realTime = setInterval(() => {
        // 请求服务器数据
        this.getInfo()
      }, 4 * 60000)//间隔时间
    },
    hide: function () {
      clearInterval(this.data.realTime)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      Login.checkLogin(() => {
        user.getExtensionDetail().then(res => {
          this.setData({
            lists: res.mt,
            lists2: res.eleme
          })
        })
      }, false)
    },
    onSwitch(e) {
      this.setData({
        'formData.promote_monitor': +e.detail
      })
    },
    onOpen(e) {
      const {type} = e.currentTarget.dataset
      const id = this.data[type].shop_id
      const attr = type === 'lists' ? 'mtSetting' : 'elemeSetting'
      if (this.data[attr].shop_id) {
        this.setData({
          formData: this.data[attr],
          dialogShow: true
        })
        return
      }
      user.getExtensionSetting(id).then(res => {
        const list = Object.assign({
          account_id: id
        }, res.data, {
          customList: [
            res.data && !!res.data['first_bid'] || true,
            res.data && !!res.data['second_startTime'] || false,
            res.data && !!res.data['third_startTime'] || false
          ]
        })
        this.setData({
          [attr]: list,
          formData: list,
          dialogShow: true
        })
      }).catch(err => {
        wx.showToast({
          title: '请求异常',
          icon: 'none',
          duration: 3000
        });
      })
    },
    onClose(e) {
      this.setData({
        dialogShow: false
      })
      if (!!e) {
        this.clearFormData()
      }
    },
    onCloseCallback(e) {
      this.clearFormData()
    },
    clearFormData() {
      const formData = this.data.formData
      this.setData({
        [`formData.customList`]: [
          !!formData['first_bid'] || true,
          !!formData['second_startTime'] || false,
          !!formData['third_startTime'] || false
        ]
      })
    },
    formInputChange(e) {
      const {field} = e.currentTarget.dataset
      this.setData({
        [`formData.${field}`]: e.detail.value
      })
    },
    onTogglePicker(e) {
      const {index} = e.currentTarget.dataset
      const showIndex = this.data.showIndex
      this.setData({
        isPicker: !this.data.isPicker,
        showIndex: index == showIndex ? null : index
      })
    },
    onPicker(e) {
      const {start, end} = e.detail
      const {index} = e.currentTarget.dataset
      const types = this.data.types
      this.setData({
        isPicker: false,
        showIndex: null,
        [`formData.${types[index]}_startTime`]: start,
        [`formData.${types[index]}_endTime`]: end
      })
    },
    onAdd() {
      const list = this.data.formData.customList
      const index = list.findIndex(value => !value)
      this.setData({
        [`formData.customList[${index}]`]: true
      })
    },
    onDelete(e) {
      const {index} = e.currentTarget.dataset
      const types = this.data.types
      this.setData({
        [`formData.customList[${index}]`]: false
      })
    },
    formSubmit() {
      this.selectComponent('#form').validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            wx.showToast({
              icon: 'error',
              title: errors[firstError[0]].message
            })
          }
        } else {
          this.setExtension()
        }
      })
    },
    setExtension() {
      const formData = this.data.formData
      const types = this.data.types
      const data = Object.assign({}, formData)
      if (this.data.mtSetting.account_id === formData.account_id) {
        this.setData({
          mtSetting: formData
        })
      } else if (this.data.elemeSetting.account_id === formData.account_id) {
        this.setData({
          elemeSetting: formData
        })
      }
      for (let i = 0; i < formData.customList.length; i++) {
        if (!formData.customList[i]) {
          delete data[`${types[i]}_startTime`]
          delete data[`${types[i]}_endTime`]
          delete data[`${types[i]}_bid`]
        }
      }
      delete data.customList

      Login.checkLogin(res => {
        user.setExtension(data).then(res => {
          this.onClose()
          wx.showToast({
            title: '设置成功！',
            icon: 'success'
          })
        }).catch((err) => {
          wx.showToast({
            title: '设置失败',
            icon: 'error'
          })
        })
      })
    }
  }
})
