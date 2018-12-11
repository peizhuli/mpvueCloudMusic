/**
 * Created by Y on 2018/10/19.
 */
const Fly=require("flyio/dist/npm/wx.js");
const request = new Fly();
request.config.timeout = 5000;
request.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
request.config.headers['cookie'] = wx.getStorageSync('cookie');
request.interceptors.request.use( req => {
 req.withCredentials = true;
 return req;
});

request.interceptors.response.use( (response, promise) => {
  return promise.resolve(response.data);
}, (err, promise) => {
  console.log(err);
  if(err.response.data.code == 301) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
  } else {
    wx.showToast({
      title: '请求出错',
      icon: 'none',
      duration: 2000
    });
  }
  return promise.reject();
});

export default request;
