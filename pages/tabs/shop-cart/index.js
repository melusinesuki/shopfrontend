const { httpClient } = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    cart: [],
    allSelected: true,
    totalPrice: '0.00'
  },

  onShow() {
    this.loadCart();
  },

  async loadCart() {
    try {
      const result = await httpClient('/shop-cart/list-all', {});
      const list = result.objData || [];
      this.setData({ cart: list });
      app.globalData.cart = list;
      this.calcTotal();
    } catch (e) {
      // httpClient 已弹 toast
    }
  },

  async plus(e) {
    const productId = e.currentTarget.dataset.id;
    const item = this.data.cart.find(i => i.longProductId == productId);
    if (!item) return;

    item.intNum++;
    this.setData({ cart: this.data.cart });
    this.calcTotal();
    try {
      await httpClient('/shop-cart/edit', {
        longProductId: item.longProductId,
        intNum: item.intNum
      });
    } catch (e) {
      item.intNum--;
      this.setData({ cart: this.data.cart });
      this.calcTotal();
    }
  },

  minus(e) {
    const productId = e.currentTarget.dataset.id;
    const item = this.data.cart.find(i => i.longProductId == productId);
    if (!item) return;

    if (item.intNum <= 1) {
      wx.showModal({
        title: '删除提示',
        content: '确定要移除此商品吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.removeItem(productId);
          }
        }
      });
      return;
    }

    item.intNum--;
    this.setData({ cart: this.data.cart });
    this.calcTotal();
    httpClient('/shop-cart/edit', {
      longProductId: item.longProductId,
      intNum: item.intNum
    }).catch(() => {
      item.intNum++;
      this.setData({ cart: this.data.cart });
      this.calcTotal();
    });
  },

  async removeItem(productId) {
    try {
      await httpClient('/shop-cart/remove', { longProductId: productId });
      const list = this.data.cart.filter(i => i.longProductId != productId);
      this.setData({ cart: list });
      app.globalData.cart = list;
      this.calcTotal();
    } catch (e) {
      // httpClient 已弹 toast
    }
  },

  toggleSelectAll() {
    this.setData({ allSelected: !this.data.allSelected });
    this.calcTotal();
  },

  calcTotal() {
    let total = 0;
    if (this.data.allSelected) {
      this.data.cart.forEach(item => {
        const price = item.productBean ? item.productBean.intPrice : 0;
        total += price * item.intNum;
      });
    }
    this.setData({ totalPrice: (total / 100).toFixed(2) });
  },

  checkout() {
    if (!app.globalData.isLogin) {
      wx.navigateTo({ url: '/pages/mine/login/index' });
      return;
    }
    if (this.data.cart.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }
    const list = this.data.cart;
    wx.navigateTo({
      url: '/pages/shop/checkout/index',
      success: (res) => {
        res.eventChannel.emit('acceptShopcart', list);
      }
    });
  }
});
