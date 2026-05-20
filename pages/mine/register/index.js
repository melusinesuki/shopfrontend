const { httpClient } = require('../../../utils/util.js');

Page({

  data: {
    username: '',
    password: '',
    repassword: ''
  },

  changeUsername(e) {
    this.setData({ username: e.detail.value });
  },
  changePassword(e) {
    this.setData({ password: e.detail.value });
  },
  changeRepassword(e) {
    this.setData({ repassword: e.detail.value });
  },

  async register() {
    if (!this.data.username?.trim()) {
      wx.showToast({ icon: 'error', title: '用户名不能为空' });
      return;
    }
    if (!this.data.password?.trim()) {
      wx.showToast({ icon: 'error', title: '密码不能为空' });
      return;
    }
    if (this.data.password != this.data.repassword) {
      wx.showToast({ icon: 'error', title: '两次密码不一致' });
      return;
    }

    try {
      await httpClient('/member-account/register', {
        strUsername: this.data.username,
        strPasswordHash: this.data.password,
        strRePasswordHash: this.data.repassword
      });
      wx.showToast({ title: '注册成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1500);
    } catch (e) {
      // httpClient 已弹 toast
    }
  },

  toLogin() {
    wx.navigateBack();
  }
});
