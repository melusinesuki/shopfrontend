// pages/mine/login/index.js
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

  sendCode() {
    const email = this.data.strEmail.trim();
    if (!email) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    if (this.data.counting) return;

    wx.request({
      url: 'http://localhost:8080/member-account/send-email',
      method: 'POST',
      data: { strUsername: email },
      success: (resp) => {
        const result = resp.data;
        if (result.intCode === 200) {
          wx.showToast({ title: '验证码已发送', icon: 'success' });
          this.startCountdown();
        } else {
          wx.showToast({ title: result.strMessage || '发送失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'error' });
      }
    });
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

  toLogin() {
    const { strEmail, strCode } = this.data;
    if (!strEmail.trim()) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    if (!strCode.trim()) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    // TODO: 调后端登录接口验证邮箱+验证码
    wx.request({
      url: 'http://localhost:8080/member-account/login',
      method: 'POST',
      data: { strUsername: strEmail, strCode: strCode },
      success: (resp) => {
        const result = resp.data;
        if (result.intCode === 200) {
          wx.setStorageSync('token', result.objData);
          wx.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(() => { wx.navigateBack(); }, 1500);
        } else {
          wx.showToast({ title: result.strMessage || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'error' });
      }
    });
  },

  toRegister() {
    wx.navigateTo({ url: '/pages/mine/register/index' });
  }

});
