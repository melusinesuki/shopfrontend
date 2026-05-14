Page({
  data: {
    productDetail: {},
    priceText: '',
    statusText: '',
    createdTimeText: '',
    updatedTimeText: '',
    deletedTimeText: '',
    loading: false
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

  addToCart() {
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  buyNow() {
    const product = this.data.productDetail
    wx.showModal({
      title: '确认购买',
      content: '确定要购买「' + product.strTitle + '」吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '下单成功', icon: 'success' })
        }
      }
    })
  }
})
