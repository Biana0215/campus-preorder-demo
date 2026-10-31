var mock = require('./utils/mock')
var orderUtil = require('./utils/order')

// 数据版本升级时重置演示种子；普通重开不会覆盖已有订单。
var DATA_VERSION = 'round1-2026-11-01-final'

App({
  globalData: {
    currentUserId: mock.currentUser.id,
    selectedStoreId: mock.stores[0].id,
    pendingStoreId: null,
    pendingCategoryId: null,
    pendingMerchantStoreId: null
  },

  onLaunch: function () {
    try {
      var savedVersion = wx.getStorageSync('demoOrderVersion')
      var storedOrders = wx.getStorageSync('orders')

      if (savedVersion !== DATA_VERSION) {
        wx.setStorageSync('orders', mock.orders)
        wx.setStorageSync('demoOrderVersion', DATA_VERSION)
      } else {
        this.mergeSeedOrders(storedOrders)
      }

      orderUtil.syncExpiredOrders()
    } catch (err) {
      console.error('订单 Storage 初始化失败：', err)
    }
  },

  // 新增种子订单时补齐，不覆盖已经产生的取消 / 核销状态。
  mergeSeedOrders: function (storedOrders) {
    var orders = Array.isArray(storedOrders) ? storedOrders.slice() : []
    var known = {}
    var changed = !Array.isArray(storedOrders)
    var i

    for (i = 0; i < orders.length; i++) {
      if (orders[i] && orders[i].id) {
        known[orders[i].id] = true
      }
    }

    for (i = 0; i < mock.orders.length; i++) {
      if (!known[mock.orders[i].id]) {
        orders.push(mock.orders[i])
        changed = true
      }
    }

    if (changed) {
      wx.setStorageSync('orders', orders)
    }
  }
})
