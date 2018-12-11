<template>
  <div class="app-content">
    <div class="recommend-list">
      <div v-for="item in recommends" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.id)">
        <i-row class="right-content-box">
          <i-col span="6">
          <img class="col-img" :src="item.album.picUrl" />
          </i-col>
          <i-col span="18" class="right-info-box">
            <div class="col-content">
              <div>{{ item.name }}</div>
              <div class="recommend-reason">{{ item.reason }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      this.getDailyRecommendSongs();
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
  .recommend-reason {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
