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
        <i-button i-class="login-btn active" inline @click="login()">登录</i-button>
        <i-button class="login-btn" inline type="ghost" @click="login()">注册</i-button>
      </div>
    </div>
    <div class="other-login-type-box">
      <p>第三方登录</p>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
//  import util from '../../utils/index';
  import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
      data() {
          return {
              userName: '',
              password: ''
          }
      },
    methods: {
        ...mapMutations(['SET_PROFILE']),
      ...mapActions(['getLikeMusicList', 'getUserSubcount', 'getPlayRecords']),
          login: function() {
              var vm = this;
              service.loginWidthEmail(vm.userName, vm.password).then(function(res) {
                  if(res.code == 200) {
                    wx.setStorageSync('cookie', res.bindings["0"].tokenJsonStr);
                    vm.SET_PROFILE(res);
                    wx.setStorageSync('user', res);
                    wx.setStorageSync('store', vm.$store.state);
                    vm.getLikeMusicList();
                    vm.getUserSubcount();
                    vm.getPlayRecords();
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
    height: 240rpx;
    display: inline-block;
  }
  .logo-name {
    color: #d6413d;
    font-size: 40rpx;
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
</style>
<style>
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
    border-bottom: 1rpx solid #d6413d;
  }
  button.i-btn.login-btn {
    width: 34%;
    padding: 10rpx 30rpx;
    border: 1px solid #d6413d;
    border-radius: 20rpx;
    font-size: 30rpx;
    color: #d6413d;
  }
  button.i-btn.login-btn {
    color: #fff;
    background: #d6413d;
  }
</style>
