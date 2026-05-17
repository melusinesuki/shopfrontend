
Page({

  data: {
    username: '',
    password:'',
    repassword:''
  },
  changeUsername(e){
    this.setData({ username: e.detail.value });
  },
  changePassword(e){
    this.setData({ password: e.detail.value });
  },
  changeRepassword(e){
    this.setData({ repassword: e.detail.value });
  },
  register(){
    if(!this.data.username?.trim()){
      wx.showToast({icon:"error",title:"用户名不能为空"})
      return;
    }
    if(!this.data.password?.trim()){
      wx.showToast({icon:"error",title:"密码不能为空"})
      return;
    }
    if(this.data.password !=this.data.repassword){
      wx.showToast({icon:"error",title:"两次密码不一致"})
      return;
    }
    wx.request({
      url: 'http://localhost:8080/member-account/register',
      method: 'POST',
      data: {
        strUsername: this.data.username,
        strPasswordHash: this.data.password,
        strRePasswordHash: this.data.repassword
      },
      success: (resp) => {
        const resultBean = resp.data;
        if (resultBean.intCode === 200) {
          wx.showToast({ title: '注册成功', icon: 'success' });
          setTimeout(() => { wx.navigateBack(); }, 1500);
        } else {
          wx.showToast({ title: resultBean.strMessage, icon: 'error' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'error' });
      }
    });
  }
})
