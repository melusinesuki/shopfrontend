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
    const productNo=e.currentTarget.dataset.no;
    console.log(productNo)
    wx.navigateTo({
        url:'/pages/index/product-detail/index?no='+productNo
      })
  }
})