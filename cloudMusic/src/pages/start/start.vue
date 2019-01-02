<template>
  <div class="app-bg" style="background: url('../../../static/img/start-bg.jpg') bottom no-repeat;">

  </div>
</template>

<script>
  export default {
      data() {
          return {
              userInfo: ''
          }
      },
      mounted() {
          let vm = this;
          vm.userInfo = wx.getStorageSync('user');
          vm.getUserInfo(function (userInfo) {
            vm.userInfo = userInfo;
              setTimeout(function() {
                  wx.switchTab({
                    url: '/pages/index/main'
                  });
              });
          },3000);
      },
    methods: {
          getUserInfo: function(calback) {
            var vm = this;
            if (vm.userInfo) {
              typeof calback == "function" && calback(vm.userInfo);
            } else {
              //调用登陆接口
              wx.login({
                success: function () {
                  wx.getUserInfo({
                    success: function (res) {
                      vm.userInfo = res.userInfo;
                      typeof calback == "function" && calback(vm.userInfo);
                    }
                  })
                }
              })
            }
          }
    }
  }
</script>
<style scoped>
  .app-bg {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    /*background: url("../../../static/img/start-bg.jpg") center no-repeat;*/
  }
</style>
