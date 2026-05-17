let pageNum=1;
let orderBy ="created_at asc"
Page({
  data: {
    products: [],
    title:"",
    loading: true,
    banners: [
      { title: '新品首发', desc: '限时特惠 全场低至5折', bg: '#ff6b81' },
      { title: '每日精选', desc: '品质好物 天天低价', bg: '#ffa502' },
      { title: '会员专享', desc: '开通会员享更多优惠', bg: '#3742fa' }
    ],
    categories: [
      { name: '食品饮料', icon: '🍜' },
      { name: '日用百货', icon: '🧴' },
      { name: '新鲜水果', icon: '🍎' },
      { name: '酒水饮品', icon: '🍷' },
      { name: '休闲零食', icon: '🍪' }
    ]
  },
  onLoad() {
    this.listProduct()
  },

  onShow() {
    // 每次显示时刷新
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.listProduct()
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
        this.setData({products:this.data.products})
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
    this.listProduct();                                    
  },    
  changeTitle(e){
    this.data.title=e.detail.value;
  },
  search(){
    pageNum=1
    this.data.products=[] 
    this.setData({products:[]})
    this.listProduct()

  },
  addToCart(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})
