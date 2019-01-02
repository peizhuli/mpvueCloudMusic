<template>
  <div class="login-box">
    <div class="logo-box">
      <img class="logo" src="../../../static/img/logo.jpeg" />
      <span class="logo-name">网易云音乐</span>
    </div>
    <div class="login-form">
      <label>用户名</label>
      <div class="login-item">
        <input class="login-input" v-model="userName" placeholder="userName" />
        <!--<i-input i-class="login-input" :value="userName" placeholder="userName"/>-->
      </div>
      <label>密码</label>
      <div class="login-item">
        <!--<i-input i-class="login-input" type="password" v-model="password" placeholder="password" />-->
        <input class="login-input" type="password" v-model="password" placeholder="password" />
      </div>
      <div class="button-group">
        <button class="login-btn active" inline @click="login()">登录</button>
        <button class="login-btn" inline type="ghost" @click="login()">注册</button>
      </div>
    </div>
    <div class="other-login-type-box">
      <!--<p>第三方登录</p>-->
      <i-divider content="第三方登录" color="#333" lineColor="#ccc"></i-divider>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
      data() {
          return {
              userName: '',
              password: ''
          }
      },
    mounted() {
      wx.setNavigationBarTitle({
        title: '登录'
      });
    },
    methods: {
        ...mapMutations(['SET_PROFILE']),
      ...mapActions(['getLikeMusicList', 'getUserSubcount', 'getPlayRecords']),
          login: function() {
              var vm = this;
              service.loginWidthEmail(vm.userName, vm.password).then(function(res) {
                  if(res.code == 200) {
//                    wx.setStorageSync('cookie', res.bindings["0"].tokenJsonStr);
                    vm.SET_PROFILE(res);
                    wx.setStorageSync('user', res);
                    vm.getLikeMusicList();
                    vm.getUserSubcount();
                    vm.getPlayRecords();
                    wx.setStorageSync('store', vm.$store.state);
                    wx.showToast({
                      title: '登录成功！',
                      icon: 'success',
                      duration: 2000
                    });
                    wx.switchTab({
                      url: '/pages/index/main'
                    })
                  }
              })
          }
    }
  }
</script>

<style scoped>
  .login-box {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    padding: 5%;
    background: #fff;
    overflow: hidden;
  }
  .logo-box {
    width: 100%;
    height: 15%;
    text-align: left;
  }
  .logo {
    width: 300rpx;
    height: 200rpx;
    display: inline-block;
  }
  .logo-name {
    color: #d6413d;
    font-size: 50rpx;
  }
  .login-form {
    text-align: left;
    padding: 60rpx 0;
  }
  .login-form label {
    color: #ccc;
    font-size: 26rpx;
  }
  .button-group {
    padding: 30rpx 0;
    text-align: center;
  }
  .login-btn {
    width: 34%;
    display: inline-block;
    padding: 10rpx 30rpx;
    margin: 0 20rpx;
    border: 1px solid #d6413d;
    border-radius: 10rpx;
    font-size: 30rpx;
    color: #d6413d;
  }
  .login-btn.active {
    color: #fff;
    background: #d6413d!important;
  }
  .login-form input.ivu-input,
  .login-form input.ivu-input:focus,
  .login-form input.ivu-input:active {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
    outline: none;
    box-shadow: none;
  }
  .login-input {
    width: 90%;
    height: 50rpx;
    font-size: 24rpx;
    border-bottom: 1rpx solid #d6413d;
  }
  .other-login-type-box {
    text-align: center;
  }
</style>
