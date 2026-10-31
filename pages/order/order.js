var mock = require('../../utils/mock')
var format = require('../../utils/format')
var storeUtil = require('../../utils/store')
var orderUtil = require('../../utils/order')

Page({
  data: {
    store: null,
    goods: null,
    specOptions: [],
    selectedSpecIndex: 0,
    selectedSpec: null,
    selectedPriceText: '0.00',
    pickupSlots: mock.pickupSlots,
    selectedSlotIndex: 0,
    pickupPerson: '',
    note: ''
  },

  onLoad: function (options) {
    var goodsId = options && options.goodsId ? decodeURIComponent(options.goodsId) : ''
    var goods = storeUtil.getGoodsById(goodsId)

    if (!goods) {
      wx.showToast({
        title: '商品信息已失效',
        icon: 'none'
      })
      setTimeout(function () {
        wx.switchTab({ url: '/pages/goods/goods' })
      }, 800)
      return
    }

    var store = storeUtil.getStoreByGoods(goods) || mock.stores[0]
    var specOptions = this.buildSpecOptions(goods)
    var specIndex = parseInt(options.specIndex, 10)

    if (isNaN(specIndex) || specIndex < 0 || specIndex >= specOptions.length) {
      specIndex = 0
    }

    this.setData({
      store: store,
      goods: storeUtil.decorateGoods(goods),
      specOptions: specOptions,
      selectedSpecIndex: specIndex,
      selectedSpec: specOptions[specIndex],
      selectedPriceText: specOptions[specIndex].priceText,
      selectedSlotIndex: 0
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

  onSlotChange: function (event) {
    this.setData({
      selectedSlotIndex: Number(event.detail.value)
    })
  },

  onPersonInput: function (event) {
    this.setData({
      pickupPerson: event.detail.value
    })
  },

  onNoteInput: function (event) {
    this.setData({
      note: event.detail.value
    })
  },

  onSubmit: function () {
    if (this.isSubmitting) {
      return
    }

    var data = this.data
    if (!data.goods || !data.selectedSpec) {
      return
    }

    var pickupPerson = data.pickupPerson.trim()
    if (!pickupPerson) {
      wx.showToast({ title: '请填写取货人', icon: 'none' })
      return
    }

    var pickupSlot = data.pickupSlots[data.selectedSlotIndex]
    if (!pickupSlot) {
      wx.showToast({ title: '请选择取货时段', icon: 'none' })
      return
    }

    this.isSubmitting = true
    this.saveOrder(pickupPerson, pickupSlot)
  },

  saveOrder: function (pickupPerson, pickupSlot) {
    var data = this.data
    var orders = orderUtil.getOrders()
    var now = new Date()
    var orderId = orderUtil.createOrderId(now.getTime())
    var page = this
    var app = getApp()

    if (app && app.globalData) {
      app.globalData.selectedStoreId = data.store.id
      app.globalData.pendingMerchantStoreId = data.store.id
    }

    var order = {
      id: orderId,
      customerId: mock.currentUser.id,
      storeId: data.store.id,
      storeName: data.store.name,
      storeAddress: data.store.address,
      goodsId: data.goods.id,
      goodsName: data.goods.name,
      goodsEmoji: data.goods.emoji,
      goodsTone: data.goods.tone,
      specName: data.selectedSpec.name,
      unitPrice: data.selectedSpec.price,
      quantity: 1,
      total: Number(data.selectedSpec.price.toFixed(2)),
      pickupSlot: pickupSlot,
      pickupSlotIndex: data.selectedSlotIndex,
      pickupAt: orderUtil.getPickupAt(data.selectedSlotIndex, now.getTime()),
      pickupPerson: pickupPerson,
      note: data.note.trim(),
      pickupCode: orderUtil.createPickupCode(orders),
      status: orderUtil.STATUS.PENDING,
      createdAt: now.getTime(),
      createdAtText: format.formatDateTime(now.getTime())
    }

    if (!orderUtil.appendOrder(order)) {
      this.isSubmitting = false
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
      return
    }

    wx.redirectTo({
      url: '/pages/success/success?orderId=' + encodeURIComponent(orderId),
      fail: function () {
        page.isSubmitting = false
        wx.showToast({ title: '订单已保存，跳转失败', icon: 'none' })
      }
    })
  }
})
