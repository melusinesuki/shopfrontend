Page({
  data: {
    name: "melusine",
    products:[]
  },
  onLoad(option){
    this.listProduct()
  },
  onShow(){
  },
  listProduct(){
    wx.request({
      url:"http://localhost:8080/product/list",
      success:(resp)=>{
        this.setData({products:resp.data})
      }
    })
  },
  toDetail(e){
    const productName=e.currentTarget.dataset.name;
    console.assert.log(productName)
    wx.navigateTo({
        url:'/pages/index/product-detail/index?name='+productName
      })
  }
})