import { httpClient } from "@/utils/util.js"

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
        acceptAddress: (res) => {
          if (res) {
            this.setData({ addressBean: res });
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
    const shopCartIdList = this.data.productList.map(item => item.longId);
    let resultBean = await httpClient("/shop-order/save", {
      longAddressId: this.data.addressBean.longId,
      shopCartIdList: shopCartIdList
    })
    const shopOrderBean = resultBean.objData;

    wx.showLoading({ title: "检查支付结果..." })
    setTimeout(async () => {
      wx.hideLoading();
      resultBean = await httpClient("/shop-order/check-pay-status", { longId: shopOrderBean.longId });
      if (resultBean.intCode == 500) {
        wx.showToast({ icon: "error", title: "支付失败" });
      } else {
        wx.showToast({ icon: "success", title: "支付成功" });
        wx.navigateBack();
      }
    }, 2000)
  }
})
