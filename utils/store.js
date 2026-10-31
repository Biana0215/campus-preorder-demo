/**
 * 商家 / 商品数据工具（ES5）
 * 首页、商品页、详情页、下单页、商家端共用。
 */

var mock = require('./mock')
var format = require('./format')

function extend(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    if (!source) {
      continue
    }
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

function findById(list, id) {
  if (!list || !id) {
    return null
  }
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i]
    }
  }
  return null
}

function getStoreById(storeId) {
  return findById(mock.stores, storeId)
}

function getCategoryById(categoryId) {
  return findById(mock.categories, categoryId)
}

function getGoodsById(goodsId) {
  return findById(mock.goods, goodsId)
}

function getStoreByGoods(goods) {
  if (!goods) {
    return null
  }
  return getStoreById(goods.storeId)
}

function getStoreName(storeId) {
  var store = getStoreById(storeId)
  return store ? store.name : ''
}

function getCategoryName(categoryId) {
  var category = getCategoryById(categoryId)
  return category ? category.name : ''
}

function decorateGoods(goods) {
  var store = getStoreByGoods(goods)
  var specs = goods.specs || []
  var decorated = extend({}, goods)
  decorated.price = format.getMinPrice(specs)
  decorated.priceText = format.formatPrice(decorated.price)
  decorated.hasSpecs = specs.length > 1
  decorated.storeName = store ? store.name : ''
  decorated.storeShortName = store ? store.shortName : ''
  decorated.storeTone = store ? store.tone : 'cream'
  return decorated
}

function decorateGoodsList(goodsList) {
  var result = []
  var list = goodsList || []
  for (var i = 0; i < list.length; i++) {
    result.push(decorateGoods(list[i]))
  }
  return result
}

function getStoreOptions() {
  var options = [{ id: 'all', name: '全部商家', shortName: '全部商家' }]
  for (var i = 0; i < mock.stores.length; i++) {
    options.push({
      id: mock.stores[i].id,
      name: mock.stores[i].name,
      shortName: mock.stores[i].shortName
    })
  }
  return options
}

function getCategoryOptions() {
  var options = [{ id: 'all', name: '全部' }]
  for (var i = 0; i < mock.categories.length; i++) {
    options.push({
      id: mock.categories[i].id,
      name: mock.categories[i].name
    })
  }
  return options
}

function getStoreGoodsCount(storeId) {
  var count = 0
  for (var i = 0; i < mock.goods.length; i++) {
    if (mock.goods[i].storeId === storeId) {
      count++
    }
  }
  return count
}

function getCategoryGoodsCount(categoryId) {
  var count = 0
  for (var i = 0; i < mock.goods.length; i++) {
    if (mock.goods[i].categoryId === categoryId) {
      count++
    }
  }
  return count
}

function getStoreSummaries() {
  var result = []
  for (var i = 0; i < mock.stores.length; i++) {
    result.push(extend({}, mock.stores[i], {
      goodsCount: getStoreGoodsCount(mock.stores[i].id)
    }))
  }
  return result
}

function getCategorySummaries() {
  var result = []
  for (var i = 0; i < mock.categories.length; i++) {
    result.push(extend({}, mock.categories[i], {
      count: getCategoryGoodsCount(mock.categories[i].id)
    }))
  }
  return result
}

// 按商家轮流交错，保证“全部商品”首屏能看到多家店。
function interleaveGoods(goodsList) {
  var buckets = {}
  var storeOrder = []

  for (var i = 0; i < mock.stores.length; i++) {
    buckets[mock.stores[i].id] = []
    storeOrder.push(mock.stores[i].id)
  }

  var list = goodsList || []
  for (var j = 0; j < list.length; j++) {
    if (!buckets[list[j].storeId]) {
      buckets[list[j].storeId] = []
      storeOrder.push(list[j].storeId)
    }
    buckets[list[j].storeId].push(list[j])
  }

  var maxLength = 0
  for (var k = 0; k < storeOrder.length; k++) {
    if (buckets[storeOrder[k]].length > maxLength) {
      maxLength = buckets[storeOrder[k]].length
    }
  }

  var result = []
  for (var row = 0; row < maxLength; row++) {
    for (var s = 0; s < storeOrder.length; s++) {
      var bucket = buckets[storeOrder[s]]
      if (bucket[row]) {
        result.push(bucket[row])
      }
    }
  }
  return result
}

function getFeaturedGoods(limit) {
  var max = limit || 4
  var featured = []
  var selectedIds = {}

  for (var i = 0; i < mock.goods.length; i++) {
    if (mock.goods[i].featured) {
      featured.push(mock.goods[i])
    }
  }

  var result = []
  // 每家店至少有一款推荐
  for (var s = 0; s < mock.stores.length; s++) {
    for (var j = 0; j < featured.length; j++) {
      if (featured[j].storeId === mock.stores[s].id) {
        result.push(featured[j])
        selectedIds[featured[j].id] = true
        break
      }
    }
  }

  for (var k = 0; k < featured.length && result.length < max; k++) {
    if (!selectedIds[featured[k].id]) {
      result.push(featured[k])
      selectedIds[featured[k].id] = true
    }
  }

  return decorateGoodsList(result.slice(0, max))
}

module.exports = {
  extend: extend,
  findById: findById,
  getStoreById: getStoreById,
  getCategoryById: getCategoryById,
  getGoodsById: getGoodsById,
  getStoreByGoods: getStoreByGoods,
  getStoreName: getStoreName,
  getCategoryName: getCategoryName,
  decorateGoods: decorateGoods,
  decorateGoodsList: decorateGoodsList,
  getStoreOptions: getStoreOptions,
  getCategoryOptions: getCategoryOptions,
  getStoreGoodsCount: getStoreGoodsCount,
  getCategoryGoodsCount: getCategoryGoodsCount,
  getStoreSummaries: getStoreSummaries,
  getCategorySummaries: getCategorySummaries,
  interleaveGoods: interleaveGoods,
  getFeaturedGoods: getFeaturedGoods
}
