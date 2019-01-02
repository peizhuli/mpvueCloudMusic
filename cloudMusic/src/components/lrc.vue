<template>
  <div style="width: 100%; height: 100%;">
    <div style="width: 100%; height: 20%;" @click="hideLrc"></div>
    <div class="lrc-box">
      <div class="lrc-list" v-if="lrcList.length">
        <scroll-view scroll-y="true" scroll-with-animation="true" :scroll-into-view="'line' + currentIndex" style="width: 100%;height:  100%;">
          <div class="lrc-item" :id="'line' + index" v-for="(item, index) in lrcList" :key="index" :data-index="index">
            <span :class="{currentLrc: true, active: item.sec < currentTime && lrcList[index + 1].sec >= currentTime}">{{ item.content }}</span>
          </div>
        </scroll-view>
      </div>
      <div v-else>
        <span>暂无歌词</span>
      </div>
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
    height: 40%;
    overflow: hidden;
  }
  .lrc-list {
    height: 100%;
    text-align: center;
    font-size:30rpx;
    line-height: 1.8;

  }
  .currentLrc {
    transition: all 0.5s;
  }
  .lrc-item > span.active {
    color: #d6413d;
  }
</style>
