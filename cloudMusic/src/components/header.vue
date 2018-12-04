<template>
  <div class="header-bar">
      <div class="search-box">
        <input placeholder="音乐、视频、歌词、电台" v-model="keyword" @click="navigatorTo" />
      </div>
  </div>
</template>

<script>
  export default {
      name: 'header-bar',
    mounted() {},
      data() {
          return {
              title: '',
              keyword: ''
          }
      },
    methods: {
      navigatorTo() {
        wx.navigateTo({
          url: '/pages/search/search',
          success: function(res){
            console.log(res)
          },
        })
      }
    }
  }
</script>

<style scope>
  .header-bar {
    position: fixed;
    width: 750rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    color: #fff;
    background: #d6413d;
    z-index: 99;
  }
  .header-bar input {
    line-height: 80rpx;
  }
  .play-music-icon {
    margin-right: 5%;
    line-height: 80rpx;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
