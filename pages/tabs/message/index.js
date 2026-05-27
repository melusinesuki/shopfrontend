const { httpClient, formatTime } = require("../../../utils/util.js")

Page({
  data: {
    messageList: []
  },

  onLoad() {
    this.listMessage();
  },

  async listMessage() {
    const requestBean = {
      pageNum: 1,
      pageSize: 10,
      orderBy: "created_time desc",
      params: {}
    }
    if (this.data.messageList.length === 0) {
      requestBean.params.longLastCreatedTime = new Date().getTime();
    } else {
      requestBean.params.longLastCreatedTime = this.data.messageList[this.data.messageList.length - 1].longCreatedTime;
    }
    const resultBean = await httpClient("/system-message/list", requestBean);
    const list = resultBean.objData;
    if (list && list.length > 0) {
      for (const item of list) {
        item.createdTimeStr = formatTime(new Date(item.longCreatedTime));
        item.bizTypeName = item.intBizType === 1 ? '订单' : item.intBizType === 2 ? '物流' : '系统';
      }
      this.data.messageList.push(...list);
    }
    this.setData({ messageList: this.data.messageList });
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.listMessage();
  },

  onPullDownRefresh() {
    this.setData({ messageList: [] });
    this.listMessage();
  },

  async read(e) {
    const id = e.currentTarget.dataset.id;
    await httpClient("/system-message/change-status", { longId: id });
    const messageBean = this.data.messageList.find(item => item.longId === id);
    if (messageBean) {
      messageBean.intStatus = 1;
      this.setData({ messageList: this.data.messageList });
    }
  }
})
