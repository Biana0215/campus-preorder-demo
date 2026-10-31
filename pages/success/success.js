var orderUtil = require('../../utils/order')

Page({
  data: {
    order: null,
    loaded: false
  },

  onLoad: function (options) {
    var orderId = options && options.orderId
      ? decodeURIComponent(options.orderId)
      : ''
    var order = orderId
      ? orderUtil.getOrderById(orderId)
      : orderUtil.getMyLatestOrder()

    this.setData({
      order: order,
      loaded: true
    })
  },

  goOrders: function () {
    wx.switchTab({
      url: '/pages/orders/orders'
    })
  }
})
