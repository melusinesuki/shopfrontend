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
      // 检查未读消息
      this.checkUnreadMessages()
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

  checkUnreadMessages() {
    wx.request({
      url: 'http://localhost:8080/system-message/list-all',
      method: 'POST',
      header: { token: this.globalData.token },
      data: {},
      success: (resp) => {
        const result = resp.data
        if (result.intCode === 200 && result.objData && result.objData.length > 0) {
          wx.showTabBarRedDot({ index: 3 })
        } else {
          wx.hideTabBarRedDot({ index: 3 })
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
