var mock = require('../../utils/mock')
var storeUtil = require('../../utils/store')

var storeFilters = storeUtil.getStoreOptions()
var categoryFilters = storeUtil.getCategoryOptions()

Page({
  data: {
    loading: true,
    skeletonCards: [1, 2, 3, 4],
    stores: storeFilters,
    categories: categoryFilters,
    activeStoreId: 'all',
    activeStoreName: '全部商家',
    activeCategory: 'all',
    activeCategoryName: '全部商品',
    list: []
  },

  onLoad: function () {
    this.buildGoods()
    this.applyFilters('all', 'all')
    this.showSkeleton()
  },

  onShow: function () {
    var app = getApp()
    var storeId = this.data.activeStoreId
    var categoryId = this.data.activeCategory

    if (app && app.globalData) {
      if (app.globalData.pendingStoreId) {
        storeId = app.globalData.pendingStoreId
        app.globalData.pendingStoreId = null
      }
      if (app.globalData.pendingCategoryId) {
        categoryId = app.globalData.pendingCategoryId
        app.globalData.pendingCategoryId = null
      }
    }

    this.applyFilters(storeId, categoryId)
  },

  onUnload: function () {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
  },

  buildGoods: function () {
    this.allGoods = storeUtil.interleaveGoods(storeUtil.decorateGoodsList(mock.goods))
  },

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

  onPullDownRefresh: function () {
    this.buildGoods()
    this.applyFilters(this.data.activeStoreId, this.data.activeCategory)
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 260)
  },

  onStoreTap: function (event) {
    var storeId = event.currentTarget.dataset.id
    var app = getApp()

    if (app && app.globalData && storeId !== 'all') {
      app.globalData.selectedStoreId = storeId
    }
    this.applyFilters(storeId, this.data.activeCategory)
  },

  onCategoryTap: function (event) {
    this.applyFilters(this.data.activeStoreId, event.currentTarget.dataset.id)
  },

  applyFilters: function (storeId, categoryId) {
    var matchedStore = this.findOption(this.data.stores, storeId)
    var matchedCategory = this.findOption(this.data.categories, categoryId)
    var nextStoreId = matchedStore ? matchedStore.id : 'all'
    var nextCategoryId = matchedCategory ? matchedCategory.id : 'all'
    var allGoods = this.allGoods || []
    var list = []

    for (var i = 0; i < allGoods.length; i++) {
      var matchStore = nextStoreId === 'all' || allGoods[i].storeId === nextStoreId
      var matchCategory = nextCategoryId === 'all' || allGoods[i].categoryId === nextCategoryId
      if (matchStore && matchCategory) {
        list.push(allGoods[i])
      }
    }

    this.setData({
      activeStoreId: nextStoreId,
      activeStoreName: nextStoreId === 'all' ? '全部商家' : matchedStore.name,
      activeCategory: nextCategoryId,
      activeCategoryName: nextCategoryId === 'all' ? '全部商品' : matchedCategory.name,
      list: list
    })
  },

  findOption: function (options, id) {
    for (var i = 0; i < options.length; i++) {
      if (options[i].id === id) {
        return options[i]
      }
    }
    return null
  },

  resetFilters: function () {
    this.applyFilters('all', 'all')
  },

  goDetail: function (event) {
    var goodsId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + encodeURIComponent(goodsId)
    })
  }
})
