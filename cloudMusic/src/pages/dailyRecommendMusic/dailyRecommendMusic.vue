<template>
  <div class="app-content">
    <div class="recommend-list">
      <div v-for="item in recommends" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.id)">
        <card :picUrl="item.album.picUrl" :title="item.name" :subTitle="item.reason"></card>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      this.getDailyRecommendSongs();
      wx.setNavigationBarTitle({
        title: '每日推荐歌曲'
      });
    },
    data() {
      return {
        recommends: []
      }
    },
    methods: {
      getDailyRecommendSongs: function () {
        let vm = this;
        service.getDailyRecommendSongs().then(function (res) {
          if(res.code == 200) {
            vm.recommends = res.recommend;
          }
        })
      },
      goUrl: function (url) {
        wx.navigateTo({
          url: url
        });
      }
    }
  }
</script>

<style scoped>
  .app-content {
    padding: 20rpx;
  }
  .recommend-reason {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
