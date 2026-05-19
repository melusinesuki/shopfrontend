// app.js
App({
  onLaunch() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 从本地恢复登录态
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      this.globalData.isLogin = true
      // 恢复登录态后拉取购物车
      this.fetchCart()
    }

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  fetchCart() {
    wx.request({
      url: 'http://localhost:8080/shop-cart/list-all',
      method: 'POST',
      header: { token: this.globalData.token },
      success: (resp) => {
        const result = resp.data
        if (result.intCode === 200) {
          this.globalData.cart = result.objData || []
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    token: '',
    isLogin: false,
    cart: []
  }
})
