const { httpClient } = require('../../../utils/util.js')

Page({

  data: {
    addressList: []
  },

  async onShow() {
    const result = await httpClient("/member-address/list-all", {})
    const list = result.objData
    this.setData({ addressList: list })
  },

  async setDefault(e) {
    const longId = e.currentTarget.dataset.longid
    wx.showModal({
      title: '默认地址设置',
      content: '您是否确定将当前地址设置为默认值',
      success: async (res) => {
        if (res.confirm) {
          await httpClient("/member-address/change-status", { longId: longId, intIsDefault: 1 })
          this.data.addressList.forEach(item => item.intIsDefault = 0)
          const addressItem = this.data.addressList.find(item => item.longId == longId)
          addressItem.intIsDefault = 1
          this.setData({ addressList: this.data.addressList })
        }
      }
    })
  },

  async remove(e) {
    const longId = e.currentTarget.dataset.longid
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该地址吗？',
      success: async (res) => {
        if (res.confirm) {
          await httpClient("/member-address/remove", { longId: longId })
          this.data.addressList = this.data.addressList.filter(item => item.longId != longId)
          this.setData({ addressList: this.data.addressList })
        }
      }
    })
  },

  toEdit(e) {
    const longId = e.currentTarget.dataset.longid
    wx.navigateTo({
      url: "/pages/mine/address-edit/index?longId=" + longId
    })
  }
})
