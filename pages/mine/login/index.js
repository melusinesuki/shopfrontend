const { httpClient } = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    strEmail: '',
    strCode: '',
    codeBtnText: '获取验证码',
    counting: false
  },

  changeEmail(e) {
    this.setData({ strEmail: e.detail.value });
  },

  changeCode(e) {
    this.setData({ strCode: e.detail.value });
  },

  async sendCode() {
    const email = this.data.strEmail.trim();
    if (!email) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    if (this.data.counting) return;

    try {
      await httpClient('/member-account/send-email', { strUsername: email });
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.startCountdown();
    } catch (e) {
      // httpClient 已经弹了 toast，这里不需要再弹
    }
  },

  startCountdown() {
    let sec = 60;
    this.setData({ counting: true, codeBtnText: sec + 's后重发' });
    const timer = setInterval(() => {
      sec--;
      if (sec <= 0) {
        clearInterval(timer);
        this.setData({ counting: false, codeBtnText: '获取验证码' });
      } else {
        this.setData({ codeBtnText: sec + 's后重发' });
      }
    }, 1000);
  },

  async toLogin() {
    const { strEmail, strCode } = this.data;
    if (!strEmail.trim()) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    if (!strCode.trim()) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    try {
      const result = await httpClient('/member-account/login', {
        strUsername: strEmail,
        strCode: strCode
      });
      const token = result.objData;
      // 同步 token 到 storage 和 globalData
      wx.setStorageSync('token', token);
      app.globalData.token = token;
      app.globalData.isLogin = true;
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1500);
    } catch (e) {
      // httpClient 已经弹了 toast
    }
  },

});
