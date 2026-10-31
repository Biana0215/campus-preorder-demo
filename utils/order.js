/**
 * 订单状态机与 Storage 工具（ES5）
 * 状态流转：待取货 -> 已取货 / 已取消 / 已过期；已取货可撤销回待取货。
 */

var mock = require('./mock')
var format = require('./format')

var STATUS = {
  PENDING: '待取货',
  PICKED: '已取货',
  CANCELLED: '已取消',
  EXPIRED: '已过期'
}

var STATUS_META = {
  '待取货': { key: 'pending', label: '待取货' },
  '已取货': { key: 'picked', label: '已取货' },
  '已取消': { key: 'cancelled', label: '已取消' },
  '已过期': { key: 'expired', label: '已过期' }
}

var STATUS_GROUPS = [
  { status: STATUS.PENDING, key: 'pending', label: '待取货', hint: '到店后出示取货码' },
  { status: STATUS.PICKED, key: 'picked', label: '已取货', hint: '这次的美味已经带走' },
  { status: STATUS.CANCELLED, key: 'cancelled', label: '已取消', hint: '取货码已失效' },
  { status: STATUS.EXPIRED, key: 'expired', label: '已过期', hint: '未在预约时段取货' }
]

var PICKUP_GRACE_MS = 30 * 60 * 1000

function getOrders() {
  try {
    var orders = wx.getStorageSync('orders')
    return Array.isArray(orders) ? orders : []
  } catch (err) {
    console.error('读取订单失败：', err)
    return []
  }
}

function saveOrders(orders) {
  try {
    wx.setStorageSync('orders', orders)
    return true
  } catch (err) {
    console.error('保存订单失败：', err)
    return false
  }
}

function getCurrentUserId() {
  return mock.currentUser ? mock.currentUser.id : ''
}

function findInList(list, orderId) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === orderId) {
      return list[i]
    }
  }
  return null
}

function getOrderById(orderId) {
  return findInList(getOrders(), orderId)
}

function getStatusMeta(status) {
  return STATUS_META[status] || { key: 'unknown', label: status || '未知状态' }
}

function isPending(order) {
  return !!order && order.status === STATUS.PENDING
}

function isPicked(order) {
  return !!order && order.status === STATUS.PICKED
}

function isInactive(order) {
  return !!order && (order.status === STATUS.CANCELLED || order.status === STATUS.EXPIRED)
}

function isExpiredByTime(order, now) {
  return !!(order && order.pickupAt &&
    now > Number(order.pickupAt) + PICKUP_GRACE_MS)
}

// 自动把超过取货时段（含 30 分钟宽限）的待取货订单置为已过期。
function syncExpiredOrders() {
  var orders = getOrders()
  var now = Date.now()
  var changed = false

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status === STATUS.PENDING && isExpiredByTime(orders[i], now)) {
      orders[i].status = STATUS.EXPIRED
      orders[i].expiredAt = now
      orders[i].statusUpdatedAt = now
      changed = true
    }
  }

  if (changed) {
    saveOrders(orders)
  }
  return changed
}

function decorateOrder(order) {
  var meta = getStatusMeta(order.status)
  var decorated = {}
  for (var key in order) {
    if (Object.prototype.hasOwnProperty.call(order, key)) {
      decorated[key] = order[key]
    }
  }

  decorated.priceText = format.formatPrice(order.total)
  decorated.unitPriceText = format.formatPrice(order.unitPrice)
  decorated.statusMeta = meta
  decorated.statusClass = meta.key
  decorated.canCancel = order.status === STATUS.PENDING
  decorated.canVerify = order.status === STATUS.PENDING
  decorated.canUndo = order.status === STATUS.PICKED
  decorated.codeValid = order.status === STATUS.PENDING || order.status === STATUS.PICKED
  decorated.codeHint = order.status === STATUS.PENDING
    ? '到店出示'
    : (order.status === STATUS.PICKED ? '已核销' : '已失效')
  decorated.createdText = format.formatDateTime(order.createdAt)
  return decorated
}

// 按状态分组，只返回有订单的分组；组内按下单时间倒序。
function getMyOrderGroups() {
  var orders = getOrders()
  var result = []

  for (var i = 0; i < STATUS_GROUPS.length; i++) {
    var config = STATUS_GROUPS[i]
    var groupOrders = []

    for (var j = 0; j < orders.length; j++) {
      var order = orders[j]
      if (order.customerId !== getCurrentUserId()) {
        continue
      }
      if (order.status === config.status) {
        groupOrders.push(decorateOrder(order))
      }
    }

    groupOrders.sort(function (a, b) {
      return (b.createdAt || 0) - (a.createdAt || 0)
    })

    if (groupOrders.length) {
      result.push({
        status: config.status,
        key: config.key,
        label: config.label,
        hint: config.hint,
        count: groupOrders.length,
        orders: groupOrders
      })
    }
  }

  return result
}

function getMyPendingCount() {
  var orders = getOrders()
  var count = 0
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].customerId === getCurrentUserId() && orders[i].status === STATUS.PENDING) {
      count++
    }
  }
  return count
}

function getMyLatestOrder() {
  var orders = getOrders()
  var latestPending = null
  var latestAny = null
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].customerId !== getCurrentUserId()) {
      continue
    }
    if (!latestAny || (orders[i].createdAt || 0) > (latestAny.createdAt || 0)) {
      latestAny = orders[i]
    }
    if (orders[i].status === STATUS.PENDING &&
      (!latestPending || (orders[i].createdAt || 0) > (latestPending.createdAt || 0))) {
      latestPending = orders[i]
    }
  }
  return latestPending || latestAny
}

function createPickupCode(orders) {
  var used = {}
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].pickupCode) {
      used[String(orders[i].pickupCode)] = true
    }
  }

  for (var attempt = 0; attempt < 30; attempt++) {
    var code = String(1000 + Math.floor(Math.random() * 9000))
    if (!used[code]) {
      return code
    }
  }
  return String(1000 + Math.floor(Math.random() * 9000))
}

function createOrderId(now) {
  var stamp = now || Date.now()
  return 'ORD' + stamp + String(Math.floor(Math.random() * 900) + 100)
}

function appendOrder(order) {
  var orders = getOrders()
  orders.unshift(order)
  return saveOrders(orders)
}

// 所有可用时段都按“明日”计算，返回预约时刻的毫秒时间戳。
function getPickupAt(slotIndex, baseTime) {
  var slot = mock.pickupSlots[slotIndex] || ''
  var matched = slot.match(/(\d{1,2}):(\d{2})/)
  var base = baseTime ? new Date(baseTime) : new Date()

  if (!matched) {
    return base.getTime() + 24 * 60 * 60 * 1000
  }

  var pickup = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + 1,
    Number(matched[1]),
    Number(matched[2]),
    0,
    0
  )
  return pickup.getTime()
}

function cancelOrder(orderId) {
  var orders = getOrders()
  var now = Date.now()

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id !== orderId) {
      continue
    }

    if (orders[i].customerId !== getCurrentUserId()) {
      return { ok: false, reason: 'owner' }
    }
    if (orders[i].status !== STATUS.PENDING) {
      return { ok: false, reason: 'status' }
    }
    if (isExpiredByTime(orders[i], now)) {
      orders[i].status = STATUS.EXPIRED
      orders[i].expiredAt = now
      orders[i].statusUpdatedAt = now
      saveOrders(orders)
      return { ok: false, reason: 'expired' }
    }

    orders[i].status = STATUS.CANCELLED
    orders[i].cancelledAt = now
    orders[i].statusUpdatedAt = now
    saveOrders(orders)
    return { ok: true, order: orders[i] }
  }

  return { ok: false, reason: 'not_found' }
}

function verifyOrder(orderId) {
  var orders = getOrders()
  var now = Date.now()

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id !== orderId) {
      continue
    }

    if (orders[i].status !== STATUS.PENDING) {
      return { ok: false, reason: 'status' }
    }
    if (isExpiredByTime(orders[i], now)) {
      orders[i].status = STATUS.EXPIRED
      orders[i].expiredAt = now
      orders[i].statusUpdatedAt = now
      saveOrders(orders)
      return { ok: false, reason: 'expired' }
    }

    orders[i].status = STATUS.PICKED
    orders[i].verifiedAt = now
    orders[i].statusUpdatedAt = now
    saveOrders(orders)
    return { ok: true, order: orders[i] }
  }

  return { ok: false, reason: 'not_found' }
}

function undoVerify(orderId) {
  var orders = getOrders()

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id !== orderId) {
      continue
    }
    if (orders[i].status !== STATUS.PICKED) {
      return { ok: false, reason: 'status' }
    }

    orders[i].status = STATUS.PENDING
    orders[i].unverifiedAt = Date.now()
    orders[i].statusUpdatedAt = orders[i].unverifiedAt
    saveOrders(orders)
    return { ok: true, order: orders[i] }
  }

  return { ok: false, reason: 'not_found' }
}

module.exports = {
  STATUS: STATUS,
  STATUS_META: STATUS_META,
  STATUS_GROUPS: STATUS_GROUPS,
  PICKUP_GRACE_MS: PICKUP_GRACE_MS,
  getOrders: getOrders,
  saveOrders: saveOrders,
  getOrderById: getOrderById,
  getCurrentUserId: getCurrentUserId,
  getStatusMeta: getStatusMeta,
  isPending: isPending,
  isPicked: isPicked,
  isInactive: isInactive,
  syncExpiredOrders: syncExpiredOrders,
  decorateOrder: decorateOrder,
  getMyOrderGroups: getMyOrderGroups,
  getMyPendingCount: getMyPendingCount,
  getMyLatestOrder: getMyLatestOrder,
  createPickupCode: createPickupCode,
  createOrderId: createOrderId,
  appendOrder: appendOrder,
  getPickupAt: getPickupAt,
  cancelOrder: cancelOrder,
  verifyOrder: verifyOrder,
  undoVerify: undoVerify
}
