var orderUtil = require('../../utils/order')

Page({
  data: {
    loading: true,
    skeletonCards: [1, 2],
    groups: [],
    totalCount: 0,
    pendingCount: 0
  },

  onShow: function () {
    var page = this
    this.loadOrders()

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

  loadOrders: function () {
    orderUtil.syncExpiredOrders()
    var groups = orderUtil.getMyOrderGroups()
    var totalCount = 0
    var pendingCount = 0

    for (var i = 0; i < groups.length; i++) {
      totalCount += groups[i].count
      if (groups[i].key === 'pending') {
        pendingCount = groups[i].count
      }
    }

    this.setData({
      groups: groups,
      totalCount: totalCount,
      pendingCount: pendingCount
    })
  },

  onPullDownRefresh: function () {
    this.loadOrders()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 260)
  },

  onCancel: function (event) {
    var orderId = event.currentTarget.dataset.id
    var page = this

    wx.showModal({
      title: '取消预订',
      content: '取消后取货码会立即失效，确定取消这单吗？',
      confirmText: '确认取消',
      confirmColor: '#E8552D',
      success: function (res) {
        if (!res.confirm) {
          return
        }

        var result = orderUtil.cancelOrder(orderId)
        page.loadOrders()

        if (result.ok) {
          wx.showToast({ title: '已取消预订', icon: 'success' })
        } else if (result.reason === 'expired') {
          wx.showToast({ title: '订单已过期', icon: 'none' })
        } else {
          wx.showToast({ title: '订单状态已变化', icon: 'none' })
        }
      }
    })
  },

  goGoods: function () {
    wx.switchTab({
      url: '/pages/goods/goods'
    })
  }
})
