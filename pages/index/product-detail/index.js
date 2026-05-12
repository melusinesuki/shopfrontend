Page({
  data: {
    productDetail:{}
  },

  onLoad(option){
    const no = option.no;
    wx.request({
      url:"http://localhost:8080/product/detail",
      method:"POST",
      data:{strNo: no},
      success:(resp)=>{
        const productDetail=resp.data;
        this.setData({productDetail:productDetail})
      }
    })
  },
  
})
