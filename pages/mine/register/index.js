
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password:'',
    repassword:''
  },
  changeUsername(e){
    this.data.username=e.detail.value;
  },
  changePassword(e){
    this.data.password=e.detail.value;
  },
  changeRepassword(e){
    this.data.repassword=e.detail.value;
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
  }
})