const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const timeDiff = (cur, prev) => {
  const time = cur - prev
  const days = Math.floor(time / (24 * 3600 * 1000))
   /*计算天数后剩*/
  const other =  time % (24 * 3600 * 1000);
  /*计算天数后剩余的小时数*/
  const hours = Math.floor(other / (3600 * 1000));
  return {days: days, hours: hours}
}

const equal = (a, b) => {
  // 判断数组的长度
  if (a.length !== b.length) {
    return false
  } else {
    // 循环遍历数组的值进行比较
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }
    return true
  }
}
/**
 * 函数精确求和
 * @param {number} num1
 * @param {number} num1
 * @returns {number}
 */
const add = (num1, num2) => {
  let p1 = 0, p2 = 0, p
  if (num1.toString().split('.').length > 1) {
    p1 = num1.toString().split('.')[1].length
  }
  if (num2.toString().split('.').length > 1) {
    p2 = num2.toString().split('.')[1].length
  }
  p = p1 > p2 ? p1 : p2
  const n1 = num1 * Math.pow(10, p)
  const n2 = num2 * Math.pow(10, p)
  return (n1 + n2) / Math.pow(10, p)
}
/**
 * 函数防抖
 * @param {Function} func
 * @param {number} wait
 * @return {*}
 */
 const debounce = (func, wait = 100) => {
  let timer;
  return (arg) => {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      func.call(context, arg)
    }, wait)
  }
}
/**
 * 函数节流
 * @param {Function} func
 * @param {number} wait 默认为300ms
 * @return {*}
 */
const throttle = (func, wait = 300) => {
  let lastTime = 0;
  return (args) => {
    const context = this;
    const currentTime = +new Date();
    if(currentTime - lastTime > wait) {
      func.call(context, args);
      lastTime = +new Date();
    }
  };
}
module.exports = {
  debounce,
  throttle,
  formatTime: formatTime,
  equal: equal,
  timeDiff: timeDiff
}
