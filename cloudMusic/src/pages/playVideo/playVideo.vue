<template>
  <div class="app-content">
    <!--<div class="mv-info-box">-->
      <!--<i-row class="mv-info-content">-->
        <!--<i-col :span="8">-->
        <!--<img class="col-img" :src="mvInfo.cover" />-->
        <!--</i-col>-->
        <!--<i-col :span="16" class="mv-detail-box">-->
        <!--<div class="artist-name">{{ mvInfo.artists ? mvInfo.artists["0"].name : '' }} - {{ mvInfo.name }}</div>-->
        <!--<div>{{ mvInfo.briefDesc }}</div>-->
        <!--</i-col>-->
      <!--</i-row>-->
    <!--</div>-->
    <video class="video" :src="videoUrl" controls></video>
    <div class="similar-mv-box">
      <i-tabs i-class="tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
        <i-tab key="MVDetail" title="详情"></i-tab>
        <i-tab key="MVComment" title="评论"></i-tab>
        <i-tab key="MVRelative" title="相关MV"></i-tab>
      </i-tabs>
      <div class="mv-detail-box" v-if="currentTab == 'MVDetail'">
        <div class="mv-info-list">
          <div class="mv-info-item">
            <div>{{ mvInfo.name }}</div>
            <div>{{ mvInfo.artists ? mvInfo.artists["0"].name : '' }}</div>
          </div>
          <div class="mv-info-item">
            <div>收藏数：{{ mvInfo.likeCount }}</div>
          </div>
        </div>
        <div class="mv-info-list">
          <div class="mv-info-item">
            <div>播放数：{{ mvInfo.playCount }}</div>
            <div>发行时间：{{ mvInfo.publishTime }}</div>
          </div>
        </div>
      </div>
      <div class="mv-comment-box" v-if="currentTab == 'MVComment'">
        <div v-if="hotComments.length" class="comment-item" v-for="item in hotComments" :key="item.commentId">
          <i-row>
            <i-col span="4" class="avatar-box">
              <i-avatar :src="item.user ? item.user.avatarUrl : ''"></i-avatar>
            </i-col>
            <i-col span="20" class="comment-content">
              <div class="nickname">{{ item.user ? item.user.nickname : '' }}
                <span class="float-right">
                <i-icon type="praise" :color="item.liked ? '#ff0000' : '#999'" size="24" @click="toggleLikeComment(item.liked, item.commentId)"/>
                {{ item.likedCount > 99 ? '99+' : item.likedCount }}
              </span>
              </div>
              <div>{{ item.time | formatTime }}</div>
              <div>{{ item.content }}</div>
            </i-col>
          </i-row>
        </div>
        <div v-if="!hotComments.length">
          <p>暂无评论</p>
        </div>
      </div>
      <div class="similar-mv-list" v-if="currentTab == 'MVRelative'">
        <div class="similar-mv-item" v-for="item in similarMVs" :key="item.id" @click="refreshVideo(item.id)">
          <i-row class="mv-info-content">
            <i-col :span="8">
            <img class="col-img" :src="item.cover" />
            <div class="duration">{{ formatterDuration(parseInt(item.duration) / 1000) }}</div>
            </i-col>
            <i-col :span="16" class="mv-detail-box">
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
        hotComments: [],
        comments: [],
        videoId: '',
        currentTab: 'MVDetail',
        currentOffset: 0
      }
    },
    methods: {
      initVideo: function () {
        this.playMV(this.videoId);
        this.getMVInfo(this.videoId);
      },
      getMVInfo: function (mvId) {
        let vm = this;
        service.getMVDetail(mvId).then(function (res) {
            console.log(res);
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
      },
      getMusicComment: function (id, offset) {
        let vm = this;
        service.getComment('video', id, offset).then(function (res) {
          if(res.code == 200) {
            vm.hasMore = res.more;
            vm.hotComments = vm.hotComments.concat(res.hotComments);
            vm.comments = vm.comments.concat(res.comments);
          }
        })
      },
      toggleLikeComment: function (t,commentId) {
        t = t ? 0 : 1;
        let type = this.commentType;
        let id= this.id;
        service.likeComment(t, type, id, commentId).then(function (res) {
          console.log(res);
        })
      },
      handleChange (detail) {
        this.currentTab =  detail.target.key;
        switch(this.currentTab) {
          case 'MVDetail': {
            this.getMVInfo(this.videoId);
            break;
          }
          case 'MVComment': {
            this.getMusicComment(this.videoId, this.currentOffset);
            break;
          }
          case 'MVRelative': {
            this.getSimilarMV(this.videoId);
            break;
          }
        }
      }
    },
    onReachBottom() {
      let vm = this;
      if(vm.currentTab == 'MVComment') {
        vm.currentOffset++;
        vm.getMusicComment(vm.videoId, vm.currentOffset);
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
  .mv-info-list {
    padding: 20rpx 0;
    border-bottom: 1px solid #999;
  }
  .mv-info-item {
    float: left;
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
