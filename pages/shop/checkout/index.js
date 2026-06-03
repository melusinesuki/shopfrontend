const { httpClient } = require("../../../utils/util.js")

Page({

  data: {
    productList: [],
    addressBean: {},
    totalPrice: 0
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptShopcart', (data) => {
      this.setData({ productList: data });
      this.sumTotalPrice();
    })
    this.getDefaultAddress();
  },

  async getDefaultAddress() {
    const resultBean = await httpClient("/member-address/detail", { intIsDefault: 1 });
    this.setData({ addressBean: resultBean.objData ?? {} })
  },

  toAddressSelect() {
    wx.navigateTo({
      url: "/pages/shop/address-select/index",
      events: {
        acceptAddress: (data) => {
          if (data && data.longId) {
            this.setData({ addressBean: data });
          }
        }
      }
    })
  },

  sumTotalPrice() {
    let totalPrice = 0;
    for (const item of this.data.productList) {
      totalPrice += item.intNum * item.productBean.intPrice;
    }
    this.setData({ totalPrice: totalPrice })
  },

  async saveOrder() {
    if (!this.data.addressBean.longId) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }

    const params = { longAddressId: this.data.addressBean.longId }
    if (this.data.productList?.[0]?.longId) {
      const shopCartIdList = this.data.productList.map(item => item.longId);
      params.shopCartIdList = shopCartIdList;
    } else {
      const productIdList = this.data.productList.map(item => item.longProductId);
      params.productIdList = productIdList;
    }

    wx.showLoading({ title: "下单中..." });
    let resultBean;
    try {
      resultBean = await httpClient("/shop-order/save", params);
    } catch (e) {
      wx.hideLoading();
      return;
    }
    wx.hideLoading();
    wx.showToast({ icon: "success", title: "下单成功" });
    wx.navigateBack();
  },
})
