/**
 * Created by Y on 2018/10/19.
 */
const Fly=require("flyio/dist/npm/wx.js");
const request = new Fly();
request.config.timeout = 5000;
request.config.headers["X-Tag"]="flyio";
request.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
request.config.withCredentials = true;
// request.config.headers['cookie'] = wx.getStorageSync('cookie');
request.interceptors.request.use( req => {
  // request.lock();
  if(req.url.indexOf('login') < 0) {
    req.headers.cookie = wx.getStorageSync('cookie');
    // req.headers.Authorization = wx.getStorageSync('cookie');
  }
 // req.withCredentials = true;
 // req.params.cookie = wx.getStorageSync('cookie') || 'cookie';
 return req;
});

request.interceptors.response.use( (response, promise) => {
  if(response.request.url.indexOf('login') > 0) {
    wx.setStorageSync('cookie', response.headers["set-cookie"]["0"]);
  }
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
