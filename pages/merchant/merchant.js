var mock = require('../../utils/mock')
var format = require('../../utils/format')
var storeUtil = require('../../utils/store')
var orderUtil = require('../../utils/order')

function enrichOrder(order) {
  var decorated = orderUtil.decorateOrder(order)
  var note = order.note ? String(order.note).trim() : ''
  decorated.noteText = note || '无'
  decorated.hasNote = note.length > 0
  decorated.quantity = order.quantity || 1
  return decorated
}

function makeGroup(slot, orders) {
  orders.sort(function (a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0)
  })
  return {
    slot: slot,
    count: orders.length,
    orders: orders
  }
}

function buildGroups(pendingOrders) {
  var grouped = {}
  var i

  for (i = 0; i < pendingOrders.length; i++) {
    var slot = pendingOrders[i].pickupSlot || '待确认时段'
    if (!grouped[slot]) {
      grouped[slot] = []
    }
    grouped[slot].push(pendingOrders[i])
  }

  var groups = []
  for (i = 0; i < mock.pickupSlots.length; i++) {
    var fixedSlot = mock.pickupSlots[i]
    if (grouped[fixedSlot] && grouped[fixedSlot].length) {
      groups.push(makeGroup(fixedSlot, grouped[fixedSlot]))
      delete grouped[fixedSlot]
    }
  }

  var rest = Object.keys(grouped)
  for (i = 0; i < rest.length; i++) {
    groups.push(makeGroup(rest[i], grouped[rest[i]]))
  }
  return groups
}

function buildSlotBars(pendingOrders) {
  var bars = []
  var counts = []
  var maxCount = 0
  var i
  var j

  for (i = 0; i < mock.pickupSlots.length; i++) {
    counts.push(0)
  }

  for (i = 0; i < pendingOrders.length; i++) {
    var index = Number(pendingOrders[i].pickupSlotIndex)
    if (!isNaN(index) && index >= 0 && index < counts.length) {
      counts[index]++
    }
  }

  for (i = 0; i < counts.length; i++) {
    if (counts[i] > maxCount) {
      maxCount = counts[i]
    }
  }

  for (j = 0; j < mock.pickupSlots.length; j++) {
    bars.push({
      slot: mock.pickupSlots[j],
      time: format.formatSlotShort(mock.pickupSlots[j]),
      count: counts[j],
      percent: counts[j] ? format.formatPercent(counts[j], maxCount) : 0
    })
  }
  return bars
}

Page({
  data: {
    stores: mock.stores,
    activeStoreId: '',
    activeStore: mock.stores[0],
    loading: true,
    skeletonCards: [1, 2],
    totalCount: 0,
    pendingCount: 0,
    verifiedCount: 0,
    inactiveCount: 0,
    groups: [],
    slotBars: [],
    verifiedOrders: [],
    inactiveOrders: [],
    showInactive: false
  },

  onShow: function () {
    var app = getApp()
    var storeId = this.data.activeStoreId
    var page = this

    if (app && app.globalData) {
      if (app.globalData.pendingMerchantStoreId) {
        storeId = app.globalData.pendingMerchantStoreId
        app.globalData.pendingMerchantStoreId = null
      } else if (!storeId) {
        storeId = app.globalData.selectedStoreId
      }
    }

    var store = storeUtil.getStoreById(storeId) || mock.stores[0]
    this.setData({
      activeStoreId: store.id,
      activeStore: store
    })
    this.loadOrders(store.id)

    if (this.hasShown) {
      this.setData({ loading: false })
      return
    }

    this.hasShown = true
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
    }
    this.loadingTimer = setTimeout(function () {
      page.setData({ loading: false })
      page.loadingTimer = null
    }, 220)
  },

  onUnload: function () {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
  },

  onStoreSwitch: function (event) {
    var storeId = event.currentTarget.dataset.id
    var store = storeUtil.getStoreById(storeId)

    if (!store || storeId === this.data.activeStoreId) {
      return
    }

    this.setData({
      activeStoreId: store.id,
      activeStore: store,
      showInactive: false
    })
    this.loadOrders(store.id)
  },

  loadOrders: function (storeId) {
    orderUtil.syncExpiredOrders()
    var targetStoreId = storeId || this.data.activeStoreId
    var allOrders = orderUtil.getOrders()
    var pendingOrders = []
    var verifiedOrders = []
    var inactiveOrders = []
    var i

    for (i = 0; i < allOrders.length; i++) {
      if (allOrders[i].storeId !== targetStoreId) {
        continue
      }

      var decorated = enrichOrder(allOrders[i])
      if (decorated.status === orderUtil.STATUS.PENDING) {
        pendingOrders.push(decorated)
      } else if (decorated.status === orderUtil.STATUS.PICKED) {
        verifiedOrders.push(decorated)
      } else if (orderUtil.isInactive(decorated)) {
        inactiveOrders.push(decorated)
      }
    }

    verifiedOrders.sort(function (a, b) {
      return (b.verifiedAt || b.createdAt || 0) - (a.verifiedAt || a.createdAt || 0)
    })
    inactiveOrders.sort(function (a, b) {
      return (b.statusUpdatedAt || b.cancelledAt || b.expiredAt || b.createdAt || 0) -
        (a.statusUpdatedAt || a.cancelledAt || a.expiredAt || a.createdAt || 0)
    })

    this.setData({
      totalCount: pendingOrders.length + verifiedOrders.length + inactiveOrders.length,
      pendingCount: pendingOrders.length,
      verifiedCount: verifiedOrders.length,
      inactiveCount: inactiveOrders.length,
      groups: buildGroups(pendingOrders),
      slotBars: buildSlotBars(pendingOrders),
      verifiedOrders: verifiedOrders,
      inactiveOrders: inactiveOrders
    })
  },

  onPullDownRefresh: function () {
    this.loadOrders(this.data.activeStoreId)
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 260)
  },

  onVerify: function (event) {
    var orderId = event.currentTarget.dataset.id
    var target = orderUtil.getOrderById(orderId)

    if (!orderId || !target || target.storeId !== this.data.activeStoreId) {
      return
    }

    var result = orderUtil.verifyOrder(orderId)
    this.loadOrders(this.data.activeStoreId)

    if (result.ok) {
      wx.showToast({ title: '核销成功', icon: 'success' })
    } else if (result.reason === 'expired') {
      wx.showToast({ title: '订单已过期', icon: 'none' })
    } else {
      wx.showToast({ title: '订单状态已变化', icon: 'none' })
    }
  },

  onUndo: function (event) {
    var orderId = event.currentTarget.dataset.id
    var target = orderUtil.getOrderById(orderId)

    if (!orderId || !target || target.storeId !== this.data.activeStoreId) {
      return
    }

    var result = orderUtil.undoVerify(orderId)
    this.loadOrders(this.data.activeStoreId)

    if (result.ok) {
      wx.showToast({ title: '已撤销核销', icon: 'success' })
    } else {
      wx.showToast({ title: '该订单无法撤销', icon: 'none' })
    }
  },

  onToggleInactive: function () {
    this.setData({
      showInactive: !this.data.showInactive
    })
  }
})
