const utils = require('./utils')

// 在 Worker 线程执行上下文会全局暴露一个 worker 对象，直接调用 worker.onMessage/postMessage 即可
worker.onMessage(function (res) {
  const {openId, pickedUp, cost, orderTime} = res
  const isOvertime = utils.isOvertime(orderTime)
  let msg = ''
  if (!openId) {
    msg = '您需要先登录'
  } else if (!pickedUp && !(cost && cost.match(/\d+\.\d+|\d+/g)[0])) {
    msg = '配送信息不全！'
  }
  worker.postMessage({
    msg: msg,
    overtime: isOvertime
  })
})