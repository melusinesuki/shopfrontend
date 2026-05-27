const { httpClient } = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    isLogin: false,
    memberInfo: {}
  },

  onShow() {
    this.setData({ isLogin: app.globalData.isLogin });
    if (this.data.isLogin) {
      this.loadUserInfo();
    }
  },

  async loadUserInfo() {
    try {
      const result = await httpClient('/member-account/me', {});
      this.setData({ memberInfo: result.objData });
    } catch (e) {
      // httpClient 已弹 toast，登录失效则清除状态
      this.setData({ isLogin: false });
      app.globalData.isLogin = false;
      app.globalData.token = '';
      wx.removeStorageSync('token');
    }
  },

  toLogin() {
    wx.navigateTo({ url: '/pages/mine/login/index' });
  },

  toAddressList() {
    wx.navigateTo({ url: '/pages/mine/address-list/index' })
  },

  toOrderList() {
    wx.navigateTo({ url: '/pages/mine/order-list/index' })
  },

  toFavorites() {
    wx.showToast({ title: '收藏功能开发中', icon: 'none' });
  },

  toSettings() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.isLogin = false;
          app.globalData.token = '';
          wx.removeStorageSync('token');
          this.setData({ isLogin: false, memberInfo: {} });
          wx.showToast({ title: '已退出', icon: 'none' });
        }
      }
    });
  }
});
