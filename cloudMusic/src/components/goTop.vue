<template>
  <div class="go-top-box" @click="goTop" v-if="showTop">
    <i-icon type="packup" size="34" color="#fff" />
  </div>
</template>

<script>
  export default {
      data() {
          return {
            windowHeight: 0,
            showTop: false
          }
      },
      mounted() {
          this.windowHeight = wx.getSystemInfoSync().windowHeight;
      },
      methods: {
          goTop: function () {
            wx.pageScrollTo({
              scrollTop: 0,
              duration: 300
            })
          }
      },
    onPageScroll(val) {
          if(parseInt(val.scrollTop) > this.windowHeight) {
              this.showTop = true;
          }

    }
  }
</script>

<style scoped>
  .go-top-box {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    bottom: 40rpx;
    right: 40rpx;
    text-align: center;
    line-height: 90rpx;
    border-radius: 50%;
    background: #999;
    transition: all 0.5s;
  }
</style>
