/**
 * 本地演示数据
 * 3 家校园商家 · 24 款商品 · 全程无网络请求、无云开发、无第三方图片。
 */

var stores = [
  {
    id: 'store_001',
    name: '麦香里烘焙',
    shortName: '麦香里',
    mark: '麦',
    tagline: '校园里的现烤面包房',
    specialty: '现烤面包',
    businessHours: '每日 07:00 — 21:00',
    address: '青禾大学东区生活广场 1F-08',
    notice: '提前预订，明日按所选时段到店自取。',
    pickupTip: '请按预约时段到店，向店员出示 4 位取货码。',
    tone: 'butter'
  },
  {
    id: 'store_002',
    name: '青禾轻食',
    shortName: '青禾轻食',
    mark: '禾',
    tagline: '少油少负担的元气餐',
    specialty: '轻食沙拉',
    businessHours: '每日 09:00 — 20:30',
    address: '青禾大学西区食堂二层 2-12',
    notice: '前一晚预订，明早到店即取，不用等位。',
    pickupTip: '到店后请前往轻食取餐口，出示取货码。',
    tone: 'sage'
  },
  {
    id: 'store_003',
    name: '甜屿蛋糕',
    shortName: '甜屿',
    mark: '甜',
    tagline: '为每个重要日子做蛋糕',
    specialty: '生日蛋糕',
    businessHours: '每日 10:00 — 21:00',
    address: '青禾大学北门创意街区 A-06',
    notice: '生日蛋糕请至少提前 1 天下单，按预约时间取货。',
    pickupTip: '生日蛋糕请当面检查，确认无误后再离店。',
    tone: 'berry'
  }
]

var currentUser = {
  id: 'student_demo',
  name: '林同学'
}

var categories = [
  {
    id: 'breakfast',
    name: '早餐',
    icon: '🥐',
    tone: 'butter'
  },
  {
    id: 'bread',
    name: '面包',
    icon: '🍞',
    tone: 'peach'
  },
  {
    id: 'teatime',
    name: '下午茶',
    icon: '🍰',
    tone: 'sage'
  },
  {
    id: 'cake',
    name: '生日蛋糕',
    icon: '🎂',
    tone: 'berry'
  }
]

var goods = [
  {
    id: 'g01',
    storeId: 'store_001',
    categoryId: 'breakfast',
    name: '黄油可颂',
    emoji: '🥐',
    tone: 'butter',
    tag: '店长推荐',
    desc: '法国发酵黄油层层开酥，外脆内软。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '单个', price: 9.9 },
      { name: '3个装', price: 27.9 }
    ]
  },
  {
    id: 'g02',
    storeId: 'store_001',
    categoryId: 'breakfast',
    name: '火腿芝士恰巴塔',
    emoji: '🥪',
    tone: 'peach',
    tag: '现烤出炉',
    desc: '火腿、芝士与现烤面包，一份就很满足。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '标准份', price: 16.8 },
      { name: '加芝士', price: 19.8 }
    ]
  },
  {
    id: 'g03',
    storeId: 'store_001',
    categoryId: 'breakfast',
    name: '厚蛋培根贝果',
    emoji: '🥯',
    tone: 'cream',
    tag: '高蛋白早餐',
    desc: '厚蛋、培根与爽脆生菜，早八人的能量补给。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '原味贝果', price: 18.8 },
      { name: '全麦贝果', price: 19.8 }
    ]
  },
  {
    id: 'g04',
    storeId: 'store_001',
    categoryId: 'bread',
    name: '北海道生吐司',
    emoji: '🍞',
    tone: 'cream',
    tag: '本店招牌',
    desc: '汤种工艺，奶香绵密，撕着吃更柔软。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '半条', price: 12.8 },
      { name: '整条', price: 22.8 }
    ]
  },
  {
    id: 'g05',
    storeId: 'store_001',
    categoryId: 'bread',
    name: '海盐碱水结',
    emoji: '🥨',
    tone: 'cocoa',
    tag: '低糖耐嚼',
    desc: '天然海盐与麦香，越嚼越有回甘。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '单个', price: 9.8 },
      { name: '2个装', price: 18.8 }
    ]
  },
  {
    id: 'g06',
    storeId: 'store_001',
    categoryId: 'bread',
    name: '蔓越莓乳酪欧包',
    emoji: '🥖',
    tone: 'berry',
    tag: '酸甜果香',
    desc: '蔓越莓干与乳酪丁，酸甜和奶香刚刚好。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '单个', price: 18.8 }
    ]
  },
  {
    id: 'g07',
    storeId: 'store_001',
    categoryId: 'teatime',
    name: '巴斯克芝士蛋糕',
    emoji: '🍰',
    tone: 'cocoa',
    tag: '下午茶必点',
    desc: '高温烘烤的焦香表皮，内里是流心芝士。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '单块', price: 19.9 },
      { name: '4寸整模', price: 68.0 }
    ]
  },
  {
    id: 'g08',
    storeId: 'store_001',
    categoryId: 'teatime',
    name: '提拉米苏杯',
    emoji: '🍮',
    tone: 'cream',
    tag: '入口即化',
    desc: '咖啡酒香与马斯卡彭，轻盈不腻。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '经典杯', price: 16.8 }
    ]
  },
  {
    id: 'g09',
    storeId: 'store_001',
    categoryId: 'teatime',
    name: '草莓奶油杯',
    emoji: '🍓',
    tone: 'peach',
    tag: '当季草莓',
    desc: '当季草莓、鲜奶油和松软蛋糕胚。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '小杯', price: 18.8 },
      { name: '大杯', price: 25.8 }
    ]
  },
  {
    id: 'g10',
    storeId: 'store_001',
    categoryId: 'cake',
    name: '经典草莓生日蛋糕',
    emoji: '🎂',
    tone: 'berry',
    tag: '提前 1 天预订',
    desc: '新鲜草莓与动物奶油，生日仪式感拉满。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '6寸', price: 128.0 },
      { name: '8寸', price: 188.0 }
    ]
  },
  {
    id: 'g11',
    storeId: 'store_001',
    categoryId: 'cake',
    name: '巧克力梦境蛋糕',
    emoji: '🍫',
    tone: 'cocoa',
    tag: '浓郁可可',
    desc: '70% 黑巧与可可戚风，浓郁但不过甜。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '6寸', price: 148.0 },
      { name: '8寸', price: 208.0 }
    ]
  },
  {
    id: 'g12',
    storeId: 'store_001',
    categoryId: 'cake',
    name: '莓果森林蛋糕',
    emoji: '🫐',
    tone: 'sage',
    tag: '清新莓果',
    desc: '蓝莓、树莓与轻乳酪，酸甜清爽。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '6寸', price: 158.0 },
      { name: '8寸', price: 228.0 }
    ]
  },
  {
    id: 'g13',
    storeId: 'store_002',
    categoryId: 'breakfast',
    name: '香煎鸡胸能量碗',
    emoji: '🥗',
    tone: 'sage',
    tag: '高蛋白',
    desc: '香煎鸡胸、糙米与时蔬，饱腹但不油腻。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '标准碗', price: 22.8 },
      { name: '加量碗', price: 27.8 }
    ]
  },
  {
    id: 'g14',
    storeId: 'store_002',
    categoryId: 'breakfast',
    name: '牛油果厚蛋贝果',
    emoji: '🥑',
    tone: 'butter',
    tag: '轻负担',
    desc: '牛油果、厚蛋与全麦贝果，早八也能吃得清爽。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '原味贝果', price: 19.8 },
      { name: '全麦贝果', price: 21.8 }
    ]
  },
  {
    id: 'g15',
    storeId: 'store_002',
    categoryId: 'bread',
    name: '全麦乡村餐包',
    emoji: '🍞',
    tone: 'cream',
    tag: '低糖主食',
    desc: '全麦粉慢发酵，麦香扎实，适合做宿舍早餐。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '2个装', price: 12.8 },
      { name: '4个装', price: 24.8 }
    ]
  },
  {
    id: 'g16',
    storeId: 'store_002',
    categoryId: 'teatime',
    name: '低卡巴斯克',
    emoji: '🍰',
    tone: 'cocoa',
    tag: '下午茶新宠',
    desc: '减糖配方，保留焦香表层和细腻芝士心。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '单块', price: 18.8 }
    ]
  },
  {
    id: 'g17',
    storeId: 'store_002',
    categoryId: 'teatime',
    name: '希腊酸奶莓果杯',
    emoji: '🫐',
    tone: 'berry',
    tag: '清爽无负担',
    desc: '浓稠酸奶、当季莓果与坚果燕麦脆。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '小杯', price: 16.8 },
      { name: '大杯', price: 24.8 }
    ]
  },
  {
    id: 'g18',
    storeId: 'store_002',
    categoryId: 'cake',
    name: '抹茶轻乳酪蛋糕',
    emoji: '🍵',
    tone: 'sage',
    tag: '轻甜生日款',
    desc: '宇治抹茶与轻乳酪，茶香清亮，甜度克制。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '6寸', price: 118.0 },
      { name: '8寸', price: 168.0 }
    ]
  },
  {
    id: 'g19',
    storeId: 'store_003',
    categoryId: 'breakfast',
    name: '可颂早餐盒',
    emoji: '🥐',
    tone: 'butter',
    tag: '甜屿早鸟款',
    desc: '两只迷你可颂配当季果酱，开启甜甜的一天。',
    isPresale: true,
    featured: true,
    specs: [
      { name: '单人份', price: 15.8 },
      { name: '双人份', price: 28.8 }
    ]
  },
  {
    id: 'g20',
    storeId: 'store_003',
    categoryId: 'bread',
    name: '生椰拿铁贝果',
    emoji: '🥯',
    tone: 'cream',
    tag: '咖啡香',
    desc: '生椰乳与咖啡揉进面团，越嚼越香。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '单个', price: 18.8 }
    ]
  },
  {
    id: 'g21',
    storeId: 'store_003',
    categoryId: 'teatime',
    name: '白桃乌龙千层',
    emoji: '🍑',
    tone: 'peach',
    tag: '季节限定',
    desc: '白桃果肉与乌龙奶油，轻盈不腻。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '单块', price: 22.8 },
      { name: '整盒', price: 42.8 }
    ]
  },
  {
    id: 'g22',
    storeId: 'store_003',
    categoryId: 'teatime',
    name: '提拉米苏方盒',
    emoji: '🍫',
    tone: 'cocoa',
    tag: '经典回归',
    desc: '手指饼干浸润咖啡液，马斯卡彭层层叠加。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '方盒', price: 19.8 }
    ]
  },
  {
    id: 'g23',
    storeId: 'store_003',
    categoryId: 'cake',
    name: '郁金香奶油蛋糕',
    emoji: '🎂',
    tone: 'berry',
    tag: '高颜值',
    desc: '香草戚风与动物奶油，手工裱出郁金香花束。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '6寸', price: 168.0 },
      { name: '8寸', price: 238.0 }
    ]
  },
  {
    id: 'g24',
    storeId: 'store_003',
    categoryId: 'cake',
    name: '小熊巧克力蛋糕',
    emoji: '🐻',
    tone: 'cocoa',
    tag: '生日惊喜',
    desc: '巧克力戚风与小熊造型，给生日多一点可爱。',
    isPresale: true,
    featured: false,
    specs: [
      { name: '6寸', price: 188.0 },
      { name: '8寸', price: 258.0 }
    ]
  }
]

var pickupSlots = [
  '明日 7:20',
  '明日 9:40',
  '明日 12:00',
  '明日 15:30',
  '明日 17:40',
  '明日 20:30'
]

var seedNow = Date.now()

/**
 * 商家端演示用的初始订单。
 * 首次启动时由 app.js 写入 Storage，后续新订单会继续追加。
 */
var orders = [
  {
    id: 'DEMO-ORDER-001',
    customerId: 'student_demo',
    storeId: 'store_001',
    storeName: '麦香里烘焙',
    storeAddress: '青禾大学东区生活广场 1F-08',
    goodsId: 'g01',
    goodsName: '黄油可颂',
    goodsEmoji: '🥐',
    goodsTone: 'butter',
    specName: '3个装',
    unitPrice: 27.9,
    quantity: 1,
    total: 27.9,
    pickupSlot: '明日 9:40',
    pickupSlotIndex: 1,
    pickupPerson: '林同学',
    note: '请帮忙切半',
    pickupCode: '3628',
    status: '待取货',
    createdAt: seedNow - 45 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-002',
    customerId: 'student_002',
    storeId: 'store_001',
    storeName: '麦香里烘焙',
    storeAddress: '青禾大学东区生活广场 1F-08',
    goodsId: 'g07',
    goodsName: '巴斯克芝士蛋糕',
    goodsEmoji: '🍰',
    goodsTone: 'cocoa',
    specName: '单块',
    unitPrice: 19.9,
    quantity: 1,
    total: 19.9,
    pickupSlot: '明日 12:00',
    pickupSlotIndex: 2,
    pickupPerson: '周同学',
    note: '',
    pickupCode: '4192',
    status: '待取货',
    createdAt: seedNow - 32 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-003',
    customerId: 'student_003',
    storeId: 'store_001',
    storeName: '麦香里烘焙',
    storeAddress: '青禾大学东区生活广场 1F-08',
    goodsId: 'g04',
    goodsName: '北海道生吐司',
    goodsEmoji: '🍞',
    goodsTone: 'cream',
    specName: '整条',
    unitPrice: 22.8,
    quantity: 1,
    total: 22.8,
    pickupSlot: '明日 9:40',
    pickupSlotIndex: 1,
    pickupPerson: '王同学',
    note: '',
    pickupCode: '5064',
    status: '待取货',
    createdAt: seedNow - 22 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-004',
    customerId: 'student_004',
    storeId: 'store_001',
    storeName: '麦香里烘焙',
    storeAddress: '青禾大学东区生活广场 1F-08',
    goodsId: 'g10',
    goodsName: '经典草莓生日蛋糕',
    goodsEmoji: '🎂',
    goodsTone: 'berry',
    specName: '6寸',
    unitPrice: 128.0,
    quantity: 1,
    total: 128.0,
    pickupSlot: '明日 17:40',
    pickupSlotIndex: 4,
    pickupPerson: '陈老师',
    note: '生日牌写：小满快乐',
    pickupCode: '7351',
    status: '待取货',
    createdAt: seedNow - 10 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-005',
    customerId: 'student_005',
    storeId: 'store_002',
    storeName: '青禾轻食',
    storeAddress: '青禾大学西区食堂二层 2-12',
    goodsId: 'g13',
    goodsName: '香煎鸡胸能量碗',
    goodsEmoji: '🥗',
    goodsTone: 'sage',
    specName: '标准碗',
    unitPrice: 22.8,
    quantity: 1,
    total: 22.8,
    pickupSlot: '明日 7:20',
    pickupSlotIndex: 0,
    pickupPerson: '苏同学',
    note: '不要香菜',
    pickupCode: '2846',
    status: '待取货',
    createdAt: seedNow - 55 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-006',
    customerId: 'student_demo',
    storeId: 'store_002',
    storeName: '青禾轻食',
    storeAddress: '青禾大学西区食堂二层 2-12',
    goodsId: 'g17',
    goodsName: '希腊酸奶莓果杯',
    goodsEmoji: '🫐',
    goodsTone: 'berry',
    specName: '大杯',
    unitPrice: 24.8,
    quantity: 1,
    total: 24.8,
    pickupSlot: '明日 15:30',
    pickupSlotIndex: 3,
    pickupPerson: '何同学',
    note: '',
    pickupCode: '9173',
    status: '已取消',
    cancelledAt: seedNow - 90 * 60 * 1000,
    createdAt: seedNow - 36 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-007',
    customerId: 'student_007',
    storeId: 'store_002',
    storeName: '青禾轻食',
    storeAddress: '青禾大学西区食堂二层 2-12',
    goodsId: 'g15',
    goodsName: '全麦乡村餐包',
    goodsEmoji: '🍞',
    goodsTone: 'cream',
    specName: '4个装',
    unitPrice: 24.8,
    quantity: 1,
    total: 24.8,
    pickupSlot: '明日 9:40',
    pickupSlotIndex: 1,
    pickupPerson: '罗同学',
    note: '',
    pickupCode: '6402',
    status: '待取货',
    createdAt: seedNow - 18 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-008',
    customerId: 'student_008',
    storeId: 'store_003',
    storeName: '甜屿蛋糕',
    storeAddress: '青禾大学北门创意街区 A-06',
    goodsId: 'g23',
    goodsName: '郁金香奶油蛋糕',
    goodsEmoji: '🎂',
    goodsTone: 'berry',
    specName: '6寸',
    unitPrice: 168.0,
    quantity: 1,
    total: 168.0,
    pickupSlot: '明日 17:40',
    pickupSlotIndex: 4,
    pickupPerson: '方同学',
    note: '生日牌：万事顺意',
    pickupCode: '8305',
    status: '待取货',
    createdAt: seedNow - 28 * 60 * 1000
  },
  {
    id: 'DEMO-ORDER-009',
    customerId: 'student_demo',
    storeId: 'store_003',
    storeName: '甜屿蛋糕',
    storeAddress: '青禾大学北门创意街区 A-06',
    goodsId: 'g21',
    goodsName: '白桃乌龙千层',
    goodsEmoji: '🍑',
    goodsTone: 'peach',
    specName: '单块',
    unitPrice: 22.8,
    quantity: 1,
    total: 22.8,
    pickupSlot: '昨日 12:00',
    pickupSlotIndex: 2,
    pickupPerson: '许同学',
    note: '',
    pickupCode: '1574',
    status: '已过期',
    expiredAt: seedNow - 25 * 60 * 60 * 1000,
    createdAt: seedNow - 8 * 60 * 1000
  }
]

// 给种子订单补上可计算的时间戳，便于统一判断过期。
function buildSeedPickupAt(slotText, baseTime) {
  var matched = String(slotText || '').match(/(\d{1,2}):(\d{2})/)
  var base = new Date(baseTime)

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

for (var orderIndex = 0; orderIndex < orders.length; orderIndex++) {
  if (!orders[orderIndex].pickupAt) {
    orders[orderIndex].pickupAt = orders[orderIndex].status === '已过期'
      ? seedNow - 25 * 60 * 60 * 1000
      : buildSeedPickupAt(orders[orderIndex].pickupSlot, seedNow)
  }
}

module.exports = {
  currentUser: currentUser,
  stores: stores,
  categories: categories,
  goods: goods,
  pickupSlots: pickupSlots,
  orders: orders
}
