const { httpClient } = require('../../../utils/util.js');
const app = getApp();

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
    this.loadProducts();
  },

  onShow() {
    // refresh products each time tab is shown
    this.loadProducts();
  },

  loadProducts() {
    this.setData({ loading: true });
    httpClient('/product/list', {
      pageNum: 1,
      pageSize: 6,
      orderBy: 'sales desc',
      params: {}
    }).then(result => {
      const pageInfo = result.objData;
      this.setData({
        products: (pageInfo && pageInfo.list) ? pageInfo.list : [],
        loading: false
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/shop/product-detail/index?id=' + id });
  },

  toCategory(e) {
    wx.switchTab({ url: '/pages/tabs/shop/index' });
  },

  toShop() {
    wx.switchTab({ url: '/pages/tabs/shop/index' });
  },

  async addToCart(e) {
    if (!app.globalData.isLogin) {
      wx.navigateTo({ url: '/pages/mine/login/index' });
      return;
    }
    const productId = e.currentTarget.dataset.id;
    if (!productId) return;

    const cartItem = app.globalData.cart.find(item => item.longProductId == productId);

    try {
      if (!cartItem) {
        await httpClient('/shop-cart/save', { longProductId: productId });
        app.globalData.cart.push({ longProductId: productId, intNum: 1 });
      } else {
        cartItem.intNum++;
        await httpClient('/shop-cart/edit', { longProductId: cartItem.longProductId, intNum: cartItem.intNum });
      }
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (e) {
      // httpClient already shows toast
    }
  }
});
