<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    if(!wx.getStorageSync('user')) {
        wx.navigateTo({url: '/pages/login/main'});
    } else {
        this.$store.replaceState(Object.assign({}, this.$store.state,wx.getStorageSync("store")));
//      this.$store.state = wx.getStorageSync('store');
    }
  }
}
</script>

<style>
  html,body {
    width: 750rpx;
    height: 100%;
    position: relative;
    margin: 0 auto;
    background: #F3F4F6;
    font-family: PingFang SC, san Francisco;
  }
  #app {
    width: 100%;
    height: 100%;
    position: relative;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .app-content {
    width: 100%;
    height: 100%;
  }
  .pad-top {
    padding-top: 100rpx;
  }
  .pad-10 {
    padding: 10rpx;
  }
  img {
    max-width: 100%;
  }
  .col-img,
  .col-content {
    height: 240rpx;
  }
  .block-img {
    height: 260rpx;
  }
  .col-content {
    font-size: 32rpx;
    padding-left: 20rpx;
    display: flex;
    flex-direction:column;
    justify-content: center;
  }
  .play-item-name {
    font-size: 26rpx;
  }
  .ivu-tabs {
    text-align: center;
  }
  .ivu-tabs-bar {
    margin: 0 auto;
    display: inline-block;
    border-bottom: none;
  }
  .ivu-tabs-nav-container {
    line-height: 2;
  }
  .ivu-tabs-ink-bar {
    background-color: #d6413d;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #d6413d;
  }
  .nav-text.ivu-tabs-nav  {
    font-size: 1.4rem;
    font-weight: 600;
  }
  ul,li {
    list-style: none;
  }
  .header-title {
    font-size: 30rpx;
    text-align: center;
  }
  .header-title > span {
    float: left;
    /*padding-left: 1rem;*/
    line-height: 80rpx;
    cursor: pointer;
  }
  .search-box {
    width: 90%;
    height: 60rpx;
    margin: 0 auto;
    position: relative;
    top: 10rpx;
    border-radius: 40rpx;
    background: #fff;
  }
  .search-box input {
    width: 100%;
    height: 100%;
    padding: 0 20rpx;
    position: relative;
    border: none;
    background: transparent;
    outline: none;
  }
  .search-box input::placeholder {
    color: #999;
  }
  .search-box > i {
    position: absolute;
    right: 3%;
    top: 10%;
  }
  .music-detail-icon {
    display: inline-block;
    width: 80rpx;
    height: 80rpx;
    position: relative;
  }
  .collect-icon {
    background: url("../static/img/music/collect-icon.png") center no-repeat;
  }
  .comment-icon {
    background: url("../static/img/music/comment-icon.png") center no-repeat;
  }
  .share-icon {
    background: url("../static/img/music/share-icon.png") center no-repeat;
  }
  .download-icon {
    background: url("../static/img/music/down-load-icon.png") center no-repeat;
  }
  .list-video-icon {
    display: inline-block;
    width: 52rpx;
    height: 36rpx;
    position: relative;
    top: 10rpx;
    margin-right: 10rpx;
    background: url("../static/img/music/list-video-icon.png") center no-repeat;
  }

  .right-content-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-info-box {
    padding-left: 10rpx;
    font-size: 28rpx;
    line-height: 2;
  }
  .music-play-count {
    position: absolute;
    top: 0;
    right: 10rpx;
    padding: 2px 5px;
    font-size: 24rpx;
    color: #fff;
    background: linear-gradient(left,rgba(9,9,9,0.2),rgba(3,3,3,0.8));
  }
  .creator {
    position: absolute;
    bottom: 10%;
    left: 5%;
    padding: 2px 5px;
    font-size: 24rpx;
    color: #fff;
    background: linear-gradient(left,rgba(9,9,9,0.2),rgba(3,3,3,0.8));
  }
  .play-name {
    font-size: 26rpx;
  }
  .float-right {
    float: right;
    padding-right: 10rpx;
  }
  .ivu-slider-button,
  .ivu-slider-button-dragging,
  .ivu-slider-button:focus,
  .ivu-slider-button:hover {
    border: 2px solid #d6413d;
  }
  .ivu-slider-bar {
    background: #d6413d;
  }
  @keyframes rotate {
    0%{
      transform: rotate(0);}
    100%  {
      transform: rotate(360deg);
    }
  }
</style>
