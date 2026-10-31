var mock = require('../../utils/mock')
var format = require('../../utils/format')
var storeUtil = require('../../utils/store')

Page({
  data: {
    store: null,
    goods: null,
    categoryName: '',
    specOptions: [],
    selectedSpecIndex: 0,
    selectedSpec: null,
    selectedPriceText: '0.00'
  },

  onLoad: function (options) {
    var goodsId = options && options.id ? decodeURIComponent(options.id) : ''
    var goods = storeUtil.getGoodsById(goodsId) || mock.goods[0]
    var store = storeUtil.getStoreByGoods(goods) || mock.stores[0]
    var specOptions = this.buildSpecOptions(goods)

    this.setData({
      store: store,
      goods: storeUtil.decorateGoods(goods),
      categoryName: storeUtil.getCategoryName(goods.categoryId),
      specOptions: specOptions,
      selectedSpecIndex: 0,
      selectedSpec: specOptions[0],
      selectedPriceText: specOptions[0].priceText
    })

    wx.setNavigationBarTitle({
      title: goods.name
    })
  },

  buildSpecOptions: function (goods) {
    var result = []
    for (var i = 0; i < goods.specs.length; i++) {
      result.push({
        name: goods.specs[i].name,
        price: goods.specs[i].price,
        priceText: format.formatPrice(goods.specs[i].price)
      })
    }
    return result
  },

  onSpecTap: function (event) {
    var index = Number(event.currentTarget.dataset.index)
    var spec = this.data.specOptions[index]
    if (!spec) {
      return
    }

    this.setData({
      selectedSpecIndex: index,
      selectedSpec: spec,
      selectedPriceText: spec.priceText
    })
  },

  onBook: function () {
    var goods = this.data.goods
    if (!goods || !this.data.selectedSpec) {
      return
    }

    wx.navigateTo({
      url: '/pages/order/order?goodsId=' + encodeURIComponent(goods.id) +
        '&specIndex=' + this.data.selectedSpecIndex
    })
  }
})
