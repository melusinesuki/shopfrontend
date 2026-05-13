Page({
  data: {
    products: [],
    loading: true,
    banners: [
      { title: '新品首发', desc: '限时特惠 全场低至5折', bg: '#ff6b81' },
      { title: '每日精选', desc: '品质好物 天天低价', bg: '#ffa502' },
      { title: '会员专享', desc: '开通会员享更多优惠', bg: '#3742fa' }
    ],
    categories: [
      { name: '食品饮料', icon: '🍜' },
      { name: '日用百货', icon: '🧴' },
      { name: '新鲜水果', icon: '🍎' },
      { name: '酒水饮品', icon: '🍷' },
      { name: '休闲零食', icon: '🍪' }
    ]
  },

  onLoad() {
    this.listProduct()
  },

  onShow() {
    // 每次显示时刷新
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.listProduct()
  },

  listProduct() {
    this.setData({ loading: true })
    wx.request({
      url: "http://localhost:8080/product/list",
      success: (resp) => {
        const resultBean = resp.data
        this.setData({ products: resultBean.objData, loading: false })
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'error' })
        this.setData({ loading: false })
      }
    })
  },

  toDetail(e) {
    const no = e.currentTarget.dataset.no
    wx.navigateTo({
      url: '/pages/index/product-detail/index?no=' + no
    })
  },

  addToCart(e) {
    const no = e.currentTarget.dataset.no
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})
