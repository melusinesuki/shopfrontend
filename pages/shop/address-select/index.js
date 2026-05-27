const { httpClient } = require("../../../utils/util.js")

Page({

  data: {
    addressList: []
  },

  async onShow() {
    const resultBean = await httpClient("/member-address/list-all", {})
    const list = resultBean.objData;
    this.setData({ addressList: list });
  },

  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    const addressBean = this.data.addressList.find(item => item.longId == id);

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptAddress', addressBean);
    wx.navigateBack();
  }
})
