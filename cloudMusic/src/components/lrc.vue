<template>
  <div class="lrc-box">
    <div class="app-content lrc-list" v-if="lrcList.length">
      <scroll-view scroll-y scroll-with-animation :scroll-into-view="'line' + currentIndex">
        <div class="lrc-item" :id="'line' + index" v-for="(item, index) in lrcList" :key="index" :data-index="index">
          <span :class="{currentLrc: true, active: item.sec <= currentTime && lrcList[index + 1].sec >= currentTime}">{{ item.content }}</span>
        </div>
      </scroll-view>
    </div>
    <div v-else>
      <span>暂无歌词</span>
    </div>
  </div>
</template>



<script>
  //将歌词按照时间分割成一个obj，存入一个数组中，播放音乐时，监听播放，
  // 当前播放时间 = 数组中的某一个obj['time']时， 改变当前歌词高亮下标，并滚动到对应的播放时间点(transform: -100%)
  export default {
    data() {
        return {
          currentIndex: 0
        }
    },
    props: ['lrcList', 'currentTime'],
    methods: {
      hideLrc: function() {
          this.$emit('hideLrc');
      }
    },
    watch: {
          currentTime(val) {
              let vm = this;
              vm.lrcList.map(function(item, index) {
                  if(item.sec == parseInt(val)) {
                    vm.currentIndex = index;
                  }
              });
          }
    }
  }
</script>

<style scoped>
  .lrc-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    background: rgba(0,0,0,0.9);
    overflow: hidden;
    z-index: 99;
  }
  .lrc-list {
    text-align: center;
    font-size: 24rpx;
  }
  .currentLrc {
    transition: all 0.5s;
  }
  .lrc-item > span.active {
    color: #d6413d;
  }
</style>
