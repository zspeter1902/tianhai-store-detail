/**
 * 是否超时
 * @param {Date} time 起始时间
 * 15分钟后超时
 */
const isOvertime = (time) => {
    if (!time) {
      return true
    }
    const _startDate = new Date(time)
    const _currentDate = new Date()
    const total = _currentDate - _startDate
    if (total < 15 * 60 * 1000) {
     return true
    }
    return false
}
module.exports = {
  isOvertime
}
