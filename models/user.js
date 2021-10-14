import { HTTP } from '../utils/http.js'
class userModel extends HTTP {
  // 获取用户信息
  constructor() {
    super()
    this.userId = wx.getStorageSync('userId')
  }
  // 获取用户信息
  getUserInfo() {
    const id = this.userId || wx.getStorageSync('userId');
    return this.request({
      url: 'user/getUserInfo',
      method: 'post',
      data: {
        id
      }
    })
  }
  // 平台帐号授权
  getCode(mobile, type) {
    return this.request({
      url: 'author/getVerificationCode',
      method: 'post',
      data: {
        mobile,
        type
      }
    })
  }
  onAuthorize(data) {
    return this.request({
      url: 'author/authorization',
      method: 'post',
      data
    })
  }
  onAuthorizeId(data) {
    return this.request({
      url: 'author/shopIdAuthorization',
      method: 'post',
      data
    })
  }
  // 取消授权
  cancelAuthorize(data) {
    return this.request({
      url: 'author/cancelAuthorization',
      method: 'post',
      data
    })
  }
  // 店铺基础数据
  // getBase() {
  //   const userId = wx.getStorageSync('userId')
  //   return this.request({
  //     url: 'shop/customerInfo',
  //     data: {
  //       userId: userId
  //     }
  //   })
  // }
  // 获取默认评价回复列表
  getShopReply(shop_id) {
    return this.request({
      url: 'shop/getOperationReply',
      method: 'post',
      data: {
        shop_id: shop_id
      }
    })
  }
  // 设置默认评价回复内容
  setShopReply(shop_id, num, reply) {
    return this.request({
      url: 'shop/setOperationReply',
      method: 'post',
      data: {
        shop_id: shop_id,
        num,
        reply
      }
    })
  }
  // 删除自动回复内容
  deleteReply(shop_id, num) {
    return this.request({
      url: 'shop/delOperationReply',
      method: 'POST',
      data: {
        shop_id: shop_id,
        num
      }
    })
  }
  // 获取店铺出单列表
  getOrders(shop_id) {
    return this.request({
      url: 'shop/getRealTimeOrders',
      method: 'post',
      data: {
        shop_id: shop_id
      }
    })
  }
  // 设置店铺出单时间
  setShopTime(shop_id, status, time = 5, mealTime = 60) {
    return this.request({
      url: 'shop/setOutOrderTime',
      method: 'post',
      data: {
        shop_id: shop_id,
        meal_time: time,
        meal_time_ad: mealTime,
        status
      }
    })
  }
  // 获取当前客户绑定的店铺信息
  getShopAccount() {
    const userId = wx.getStorageSync('userId')
    return this.request({
      url: 'shop/getCustomerShopInfo',
      method: 'POST',
      data: {
        user_id: userId
      }
    })
  }
  // 店铺自动回复开启关闭设置
  bindShopReview(shop_id, status) {
    return this.request({
      url: 'shop/setShopReview',
      method: 'post',
      data: {
        shop_id: shop_id,
        is_reply: status
      }
    })
  }
  // 获取统计店铺自动回复数量
  getReplyStatistics(shop_id) {
    return this.request({
      url: 'shop/autoReviewCount',
      method: 'post',
      data: {
        shop_id: shop_id
      }
    })
  }
  // 获取店铺差评列表
  getBadReplyList(account_id) {
    return this.request({
      url: 'shop/badReviewSearch',
      method: 'post',
      data: {
        account_id
      }
    })
  }
  // 智能推广-->详情
  getExtensionDetail(shop_id) {
    return this.request({
      url: 'shop/promoteInfo',
      method: 'POST',
      data: {
        shop_id
      }
    })
  }
  // 智能推广-->设置
  getExtensionSetting(accountId) {
    return this.request({
      url: 'shop/setPromoteJob',
      data: {
        account_id: accountId
      }
    })
  }
  setExtension(data) {
    return this.request({
      url: 'shop/setPromoteJob',
      method: 'POST',
      data
    })
  }
  // 会员
  getVipList() {
    return this.request({
      url: 'order/productList',
    })
  }
  onBuy(id) {
    const userId = wx.getStorageSync('userId')
    return this.request({
      url: 'order/buyMembers',
      method: 'POST',
      data: {
        user_id: userId,
        id
      }
    })
  }
}
export {
  userModel
}