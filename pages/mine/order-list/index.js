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

  async onCancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    const status = Number(e.currentTarget.dataset.status);

    const confirmResult = await new Promise(resolve => {
      wx.showModal({
        title: '提示',
        content: status === 0 ? '确定取消该订单吗？' : '确定申请退款吗？',
        confirmText: status === 0 ? '取消订单' : '申请退款',
        cancelText: '再想想',
        success: res => resolve(res.confirm)
      });
    });

    if (!confirmResult) return;

    try {
      await httpClient('/shop-order/cancel', { longId: id });
      wx.showToast({ title: status === 0 ? '已取消' : '退款申请已提交', icon: 'success' });
      this.listAll();
    } catch (e) {
      // httpClient 内部已 toast 错误信息
    }
  },

  async onDeleteOrder(e) {
    const id = e.currentTarget.dataset.id;

    const confirmResult = await new Promise(resolve => {
      wx.showModal({
        title: '提示',
        content: '确定删除该订单吗？删除后不可恢复。',
        confirmText: '删除',
        cancelText: '再想想',
        success: res => resolve(res.confirm)
      });
    });

    if (!confirmResult) return;

    try {
      await httpClient('/shop-order/delete', { longId: id });
      wx.showToast({ title: '已删除', icon: 'success' });
      this.listAll();
    } catch (e) {
      // httpClient 内部已 toast 错误信息
    }
  },

  async onPayOrder(e) {
    const { id } = e.currentTarget.dataset;

    const confirmResult = await new Promise(resolve => {
      wx.showModal({
        title: '提示',
        content: '确认支付该订单吗？',
        confirmText: '确认支付',
        cancelText: '再想想',
        success: res => resolve(res.confirm)
      });
    });

    if (!confirmResult) return;

    wx.showLoading({ title: '支付中...' });
    try {
      await httpClient('/shop-order/check-pay-status', { longId: id });
      wx.hideLoading();
      wx.showToast({ icon: 'success', title: '支付成功' });
      this.listAll();
    } catch (e) {
      wx.hideLoading();
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
