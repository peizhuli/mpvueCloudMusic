<template>
  <div class="app-content">
    <div class="mv-info-box">
      <i-row class="mv-info-content">
        <i-col :span="8">
        <img class="col-img" :src="mvInfo.cover" />
        </i-col>
        <i-col :span="16" class="mv-detail-box">
        <div class="artist-name">{{ mvInfo.artists ? mvInfo.artists["0"].name : '' }} - {{ mvInfo.name }}</div>
        <div>{{ mvInfo.briefDesc }}</div>
        <!--<div>{{ mvInfo.desc.length > 70 ? mvInfo.desc.substr(0,69) + '...' : mvInfo.desc }}</div>-->
        </i-col>
      </i-row>
    </div>
    <video class="video" :src="videoUrl" controls></video>
    <div class="similar-mv-box">
      <div class="similar-title">相似MV</div>
      <div class="similar-mv-list">
        <div class="similar-mv-item" v-for="item in similarMVs" :key="item.id" @click="refreshVideo(item.id)">
          <i-row class="mv-info-content">
            <i-col :span="6">
            <img class="col-img" :src="item.cover" />
            <div class="duration">{{ formatterDuration(parseInt(item.duration) / 1000) }}</div>
            </i-col>
            <i-col :span="18" class="mv-detail-box">
            <div class="artist-name">{{ item.artists["0"].name }} - {{ item.name }}</div>
            <div>{{ item.briefDesc }}</div>
            </i-col>
          </i-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  import util from '../../utils/index';
  export default {
    mounted() {
      this.videoId = this.$root.$mp.query.id;
      this.initVideo();
    },
    data() {
      return {
        mvInfo: {},
        videoUrl: '',
        similarMVs: [],
        videoId: ''
      }
    },
    methods: {
      initVideo: function () {
        this.playMV(this.videoId);
        this.getMVInfo(this.videoId);
        this.getSimilarMV(this.videoId);
      },
      getMVInfo: function (mvId) {
        let vm = this;
        service.getMVDetail(mvId).then(function (res) {
          if(res.code == 200) {
            vm.mvInfo = res.data;
          }
        })
      },
      playMV: function(id) {
        let vm = this;
        if(id) {
          service.getMVUrl(id).then(function(res) {
            vm.videoUrl = res.data.url;
          })
        }
      },
      getSimilarMV: function (id) {
        let vm = this;
        service.getSimilarMV(id).then(function (res) {
          if(res.code == 200) {
            vm.similarMVs = res.mvs;
          }
        })
      },
      formatterDuration: function (duration) {
        return util.formatterDuration(duration);
      },
      refreshVideo: function(id) {
          this.videoId = id;
          this.initVideo();
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
          })
      }
    }
  }
</script>

<style scoped>
  video {
    max-width: 100%;
  }
  .mv-info-box {
    padding: 20rpx;
  }
  .mv-info-content {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #999;
  }
  .mv-detail-box {
    padding-left: 20rpx;
  }
  .mv-info-content .artist-name {
    color: #333;
    font-size: 26rpx;
    margin-bottom: 20rpx;
  }
  .similar-mv-box {
    font-size: 30rpx;
    margin: 20rpx 0;
  }
  .duration {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px 5px;
    color: #fff;
    background: linear-gradient(left,rgba(9,9,9,0.2),rgba(3,3,3,0.8));
  }
  .video {
    width: 100%;
    height: 400rpx;
  }
</style>
