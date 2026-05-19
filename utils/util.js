const app = getApp();

const httpClient = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://localhost:8080' + url,
      method: 'POST',
      header: { token: app.globalData.token },
      data,
      success: (res) => {
        const result = res.data;
        if (result.intCode === 200) {
          resolve(result);
        } else {
          wx.showToast({ title: result.strMessage || '请求失败', icon: 'none' });
          reject(result);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'error' });
        reject(err);
      }
    });
  });
};

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  httpClient
}
