/**
 * 通用格式化工具（ES5）
 * 所有页面统一从这里取格式化方法，避免重复实现。
 */

function formatPrice(value) {
  var num = Number(value)
  if (!isFinite(num)) {
    num = 0
  }
  return num.toFixed(2)
}

function getMinPrice(specs) {
  if (!specs || !specs.length) {
    return 0
  }

  var min = Number(specs[0].price)
  if (!isFinite(min)) {
    min = 0
  }

  for (var i = 1; i < specs.length; i++) {
    var price = Number(specs[i].price)
    if (isFinite(price) && price < min) {
      min = price
    }
  }
  return min
}

function padTwo(value) {
  return value < 10 ? '0' + value : '' + value
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return ''
  }

  var date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return ''
  }

  return date.getFullYear() + '-' +
    padTwo(date.getMonth() + 1) + '-' +
    padTwo(date.getDate()) + ' ' +
    padTwo(date.getHours()) + ':' +
    padTwo(date.getMinutes())
}

function formatSlotShort(slotText) {
  var text = String(slotText || '')
  var matched = text.match(/(\d{1,2}:\d{2})/)
  if (matched) {
    return matched[1]
  }
  return text.replace(/^明日\s*/, '')
}

function formatPercent(value, maxValue) {
  if (!maxValue || !value) {
    return 0
  }
  var percent = Math.round((value / maxValue) * 100)
  if (percent < 8) {
    percent = 8
  }
  return percent > 100 ? 100 : percent
}

module.exports = {
  formatPrice: formatPrice,
  getMinPrice: getMinPrice,
  formatDateTime: formatDateTime,
  formatSlotShort: formatSlotShort,
  formatPercent: formatPercent
}
