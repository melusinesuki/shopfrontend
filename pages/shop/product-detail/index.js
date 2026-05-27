const { httpClient } = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    productDetail: {},
    loading: true
  },

  onLoad(option) {
    const id = option.id
    wx.request({
      url: "http://localhost:8080/product/detail",
      method: "POST",
      data: { longId: id },
      success: (resp) => {
        const resultBean = resp.data
        if (resultBean.intCode == 200) {
          this.setData({ productDetail: resultBean.objData, loading: false })
        } else if (resultBean.intCode == 500) {
          wx.showToast({ title: resultBean.strMessage, icon: 'error' })
          this.setData({ loading: false })
        }
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'error' })
        this.setData({ loading: false })
      }
    })
  },

  async addToCart() {
    if (!app.globalData.isLogin) {
      wx.navigateTo({ url: '/pages/mine/login/index' });
      return;
    }
    const productId = this.data.productDetail.longId;
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
      // httpClient 已弹 toast
    }
  },

  buyNow() {
    if (!app.globalData.isLogin) {
      wx.navigateTo({ url: '/pages/mine/login/index' });
      return;
    }
    const product = this.data.productDetail
    if (!product.longId) return;

    const shopCartBean = {
      longProductId: product.longId,
      intNum: 1,
      productBean: product
    }
    wx.navigateTo({
      url: "/pages/shop/checkout/index",
      success: (res) => {
        res.eventChannel.emit('acceptShopcart', [shopCartBean]);
      }
    })
  },

  goToCart() {
    wx.switchTab({ url: '/pages/tabs/shop-cart/index' });
  }
})
