const { httpClient } = require('../../../utils/util.js');
const app = getApp();

let pageNum=1;
let orderBy ="created_at asc"
Page({
  data: {
    products: [],
    title:"",
    loading: true
  },
  onLoad() {
    this.listProduct()
  },

  onShow() {
  },

  // 下拉刷新
  onPullDownRefresh() {
    pageNum = 1;
    this.data.products = [];
    this.setData({ products: [] });
    this.listProduct();
    wx.stopPullDownRefresh();
  },
  listProduct() {
    const dataQ={pageNum:1,pageSize:5,orderBy:orderBy,params:{strTitle:this.data.title}};

    if(orderBy=="created_at asc"){
      let startCreatedTime =0;
      if(this.data.products.length>0){
        startCreatedTime=this.data.products[this.data.products.length-1].longCreatedTime;
      }
      dataQ.params.startCreatedTime=startCreatedTime;
    }

    if(orderBy=="created_at desc"){
      let lastCreatedTime = new Date().getTime();
      if(this.data.products.length>0){
        lastCreatedTime=this.data.products[this.data.products.length-1].longCreatedTime;
      }
      dataQ.params.lastCreatedTime=lastCreatedTime;
    }

    if(orderBy=="int_price asc"){
      let startPrice =0;
      if(this.data.products.length>0){
        startPrice=this.data.products[this.data.products.length-1].intPrice;
      }
      dataQ.params.startPrice=startPrice;
    }

    if(orderBy=="sales desc"){
      let lastSales =2000000000;
      if(this.data.products.length>0){
        lastSales=this.data.products[this.data.products.length-1].intSales;
      }
      dataQ.params.lastSales=lastSales;
    }
    wx.request({
      url: "http://localhost:8080/product/list",
      method:"POST",
      data:dataQ,
      success: (resp) => {
        const resultBean = resp.data
        const pageInfo =resultBean.objData;
        if(pageInfo && pageInfo.list &&pageInfo.list.length>0){
          pageNum++;
          this.data.products.push(...pageInfo.list);
        }
        this.setData({products:this.data.products, loading: false})
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'error' })
        this.setData({ loading: false })
      }
    })
  },
  onReachBottom(){
    this.listProduct();
    console.log("触底了")
  },
  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shop/product-detail/index?id=' + id
    })
  },
  changesort(e) {
    const orderb = e.currentTarget.dataset.orderby;
    orderBy=orderb;
    pageNum = 1
    this.data.products=[]
    this.setData({ products: [] });
    this.listProduct();
  },
  changeTitle(e){
    this.setData({ title: e.detail.value });
  },
  search(){
    pageNum=1
    this.data.products=[]
    this.setData({products:[]})
    this.listProduct()

  },
  async addToCart(e) {
    if (!app.globalData.isLogin) {
      wx.navigateTo({ url: '/pages/mine/login/index' });
      return;
    }
    const productId = e.currentTarget.dataset.id;
    if (!productId) return;

    const cartItem = app.globalData.cart.find(item => item.longProductId == productId);

    try {
      if (!cartItem) {
        await httpClient('/shop-cart/save', { longProductId: productId });
        app.globalData.cart.push({ longProductId: productId, intNum: 1 });
      } else {
        cartItem.intNum++;
        await httpClient('/shop-cart/edit', { longProductId: cartItem.longProductId, intNum: cartItem.intNum });
      }
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (e) {
      // httpClient 已弹 toast
    }
  }
})
