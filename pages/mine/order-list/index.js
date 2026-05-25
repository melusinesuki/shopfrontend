const { httpClient } = require('../../../utils/util.js')

Page({
  data: {
    orderList: []
  },

  onShow() {
    this.listAll();
  },

  async listAll() {
    const resultBean = await httpClient("/shop-order/list-all", {});
    const list = resultBean.objData || [];
    this.setData({
      orderList: list.map(item => this.formatOrder(item))
    });
  },

  formatOrder(order) {
    const productList = this.parseJson(order.strProductListJson);
    return {
      ...order,
      statusText: this.formatStatus(order.intStatus),
      createdTimeText: this.formatTime(order.longCreatedTime),
      productList: Array.isArray(productList) ? productList : [],
      productCount: Array.isArray(productList) ? productList.length : 0
    };
  },

  parseJson(value) {
    if (!value) return [];
    try {
      const first = JSON.parse(value);
      if (typeof first === 'string') {
        return JSON.parse(first);
      }
      return first;
    } catch (e) {
      return [];
    }
  },

  formatStatus(status) {
    const statusMap = {
      0: '待支付',
      1: '已支付',
      2: '已完成',
      3: '已取消',
      4: '退款中',
      5: '已退款'
    };
    return statusMap[status] || '未知状态';
  },

  formatTime(time) {
    if (!time) return '';
    const date = new Date(time);
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
})
