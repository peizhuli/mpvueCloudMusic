<template>
  <div class="app-content">
    <div class="cloud-hot-music-list">
      <div class="cloud-hot-music-item" v-for="item in cloudHotMusic" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.id)">
        <i-row class="cloud-hot-music-content">
          <i-col span="8">
          <img class="col-img" :src="item.al.picUrl" />
          </i-col>
          <i-col span="16" class="hot-music-info">
            <div class="col-content">
              <div>{{ item.name }}</div>
              <div v-if="item.alia.length">{{ item.alia[0] }}</div>
              <div>{{ item.ar[0].name }}</div>
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
      wx.setNavigationBarTitle({
        title: '云音乐热歌榜'
      });
      this.getCloudHotMusic();
    },
    data() {
      return {
        cloudHotMusic: []
      }
    },
    methods: {
      getCloudHotMusic: function () {
        let vm = this;
        service.getCloudHotMusic().then(function (res) {
          vm.cloudHotMusic = res.playlist.tracks;
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
  .cloud-hot-music-list {
    padding: 20rpx;
  }
  .cloud-hot-music-content {
    font-size: 30rpx;
  }
  .hot-music-info {
    padding-left: 20rpx;
  }
  .hot-music-info > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
