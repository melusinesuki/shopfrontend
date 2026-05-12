Page({
  data: {
    name: "melusine",
    products:[]
  },

  onLoad(option){
    const no =options.no;
    data:{no:no};
    wx.request({
      url:"http://localhost:8080/product/detail",
      success:(resp)=>{
        const productDetail=resp.data;
        this.setData({productDetail:productDetail})
      }
    })
  },
  
})
