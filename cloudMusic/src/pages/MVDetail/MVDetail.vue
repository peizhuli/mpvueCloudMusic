<template>
  <div class="app-content">
    <div class="mv-cover" @click="goUrl('/pages/playVideo/main?id=' + videoId)">
      <img :src="MVDetailInfo.cover" />
    </div>
    <div class="mv-info-box">
      <div>
        <span>歌手：{{ MVDetailInfo.artistName }}</span>
        <span>播放次数：{{ MVDetailInfo.playCount}}</span>
      </div>
      <i-row class="mv-action-box">
        <i-col span="6" class="mv-action-box">
        <i-icon type="ios-briefcase" />
        <p>{{ MVDetailInfo.likeCount }}</p>
        </i-col>
        <i-col span="6" class="mv-action-box">
        <i-icon type="ios-chatboxes-outline" />
        <p>{{ MVDetailInfo.commentCount }}</p>
        </i-col>
        <i-col span="6" class="mv-action-box">
        <i-icon type="share" />
        <p>{{ MVDetailInfo.shareCount }}</p>
        </i-col>
        <i-col span="6" class="mv-action-box">
        <i-icon type="ios-cloud-download-outline" />
        <p>下载</p>
        </i-col>
      </i-row>
    </div>
    <div class="relative-recommend-box">
      <div>相关推荐</div>
      <div class="relative-item" v-for="item in relativeRecommendMV" :key="item.id">
        <i-row type="flex" align="middle" justify="start" class="relative-item-content">
          <i-col span="8">
            <img class="col-img" :src="item.cover" />
          </i-col>
          <i-col span="16" class="relative-item-info">
            <div class="col-content">
              <div class="mv-name">{{ item.name }}</div>
              <div class="artist-name">{{ item.artistName }}</div>
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
      this.videoId = this.$root.$mp.query.id;
      this.getMVDetail(this.videoId);
      this.getSimilarMV(this.videoId);
    },
    data() {
      return {
        MVDetailInfo: {},
        relativeRecommendMV: [],
        videoId: ''
      }
    },
    methods: {
      getMVDetail: function (id) {
        let vm = this;
        if(id) {
          service.getMVDetail(id).then(function (res) {
            vm.MVDetailInfo = res.data;
          });
        }
      },
      getSimilarMV: function(id) {
        let vm = this;
        if(id) {
          service.getSimilarMV(id).then(function (res) {
            vm.relativeRecommendMV = res.mvs;
          })
        }
      },
      goUrl: function (url) {
        wx.goUrl({
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
  .mv-cover {

  }
  .mv-cover img,
  .relative-item img {
    max-width: 100%;
  }
  .mv-action-box {
    text-align: center;
  }
  .relative-item-info {
    padding: 10px;
  }
  .mv-name {
    font-size: 28rpx;
  }
</style>
