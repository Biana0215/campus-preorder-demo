var mock = require('../../utils/mock')
var storeUtil = require('../../utils/store')
var orderUtil = require('../../utils/order')

Page({
  data: {
    loading: true,
    skeletonStores: [1, 2, 3],
    stores: [],
    categories: [],
    featuredGoods: [],
    pickupSlotCount: mock.pickupSlots.length,
    myPendingCount: 0,
    myOrdersHint: '查看取货码与历史订单'
  },

  onLoad: function () {
    this.loadData()
    this.showSkeleton()
  },

  onShow: function () {
    this.refreshMyOrders()
  },

  onUnload: function () {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
  },

  loadData: function () {
    this.setData({
      stores: storeUtil.getStoreSummaries(),
      categories: storeUtil.getCategorySummaries(),
      featuredGoods: storeUtil.getFeaturedGoods(4)
    })
    this.refreshMyOrders()
  },

  refreshMyOrders: function () {
    orderUtil.syncExpiredOrders()
    var count = orderUtil.getMyPendingCount()
    this.setData({
      myPendingCount: count,
      myOrdersHint: count > 0
        ? count + ' 笔待取货 · 点击查看取货码'
        : '取货码与历史订单都在这里'
    })
  },

  // 本地数据加载极快，短暂骨架屏用于演示完整加载态。
  showSkeleton: function () {
    var page = this
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
    }
    this.setData({ loading: true })
    this.loadingTimer = setTimeout(function () {
      page.setData({ loading: false })
      page.loadingTimer = null
    }, 220)
  },

  onRetry: function () {
    this.loadData()
    this.showSkeleton()
  },

  onPullDownRefresh: function () {
    this.loadData()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 260)
  },

  onStoreTap: function (event) {
    var storeId = event.currentTarget.dataset.id
    var app = getApp()
    if (app && app.globalData) {
      app.globalData.selectedStoreId = storeId
      app.globalData.pendingStoreId = storeId
      app.globalData.pendingCategoryId = 'all'
    }
    wx.switchTab({
      url: '/pages/goods/goods'
    })
  },

  onCategoryTap: function (event) {
    var categoryId = event.currentTarget.dataset.id
    var app = getApp()
    if (app && app.globalData) {
      app.globalData.pendingStoreId = 'all'
      app.globalData.pendingCategoryId = categoryId
    }
    wx.switchTab({
      url: '/pages/goods/goods'
    })
  },

  goGoods: function () {
    var app = getApp()
    if (app && app.globalData) {
      app.globalData.pendingStoreId = 'all'
      app.globalData.pendingCategoryId = 'all'
    }
    wx.switchTab({
      url: '/pages/goods/goods'
    })
  },

  goOrders: function () {
    wx.switchTab({
      url: '/pages/orders/orders'
    })
  },

  goDetail: function (event) {
    var goodsId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + encodeURIComponent(goodsId)
    })
  }
})
