<template>
  <div class="app-content">
    <div class="category-detail-box">
      <div class="category-describe-box">
        <i-row>
          <i-col span="8">
            <img class="col-img" :src="categoryDetail.coverImgUrl" />
          </i-col>
          <i-col span="16" class="category-info-content">
            <div class="category-info-box col-content">
              <div>
                <i-avatar :src="categoryDetail.creator ? categoryDetail.creator.avatarUrl : ''"></i-avatar>
                {{ categoryDetail.creator ? categoryDetail.creator.nickname : '' }}
              </div>
              <div>{{ categoryDetail.name }}</div>
            </div>
          </i-col>
        </i-row>
        <i-row class="category-count-box">
          <i-col class="category-count-item" span="6">
            <i class="music-detail-icon collect-icon" />
            <div>{{ categoryDetail.subscribedCount }}</div>
          </i-col>
          <i-col class="category-count-item" span="6">
            <i class="music-detail-icon comment-icon" />
            <div>{{ categoryDetail.commentCount }}</div>
          </i-col>
          <i-col class="category-count-item" span="6">
            <i class="music-detail-icon share-icon" />
            <div>{{ categoryDetail.shareCount }}</div>
          </i-col>
          <i-col class="category-count-item" span="6">
            <i class="music-detail-icon download-icon" />
            <div>下载</div>
          </i-col>
        </i-row>
      </div>
      <div class="play-all-box">
        <span>播放全部</span>
        <i-icon class="play-all-action-icon" type="other" size="20" />
      </div>
      <ul class="category-detail-list padBtm">
        <li v-for="(item, index) in categoryDetail.tracks" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.id)">
          <div class="category-item">
            <i-row>
              <i-col span="2">
                <div>{{ index + 1 }}.</div>
              </i-col>
              <i-col span="22">
                <div class="category-item-name">
                  <span>{{ item.name }}</span>
                  <span v-if="item.alia.length"> - {{ item.alia["0"] }}</span>
                  <span class="more-icon-box">
                    <i class="list-video-icon" v-if="item.mv != 0" @click="goUrl('/pages/playVideo.main?id=' + item.mv)"></i>
                    <i-icon type="more" size="20" @click.stop="showCurrentSongOptions(item.al.id, item.mv, item.id)" />
                  </span>
                </div>
                <div class="artist-name">
                  {{ item.ar[0].name }}
                  <span> - {{ item.al.name }}</span>
                </div>
              </i-col>
            </i-row>
          </div>
        </li>
      </ul>
    </div>
    <div class="music-option-box" v-show="showOptionsBox">
      <div class="music-option-item" :disable="currentMVId == 0" @click.stop="goUrl('/pages/playVideo/main?id=' + currentMVId)">
        <i-icon type="live" size="30" color="#d6413d" />
        <span>查看视频</span>
      </div>
      <div class="music-option-item" :disable="currentMVId == 0" @click.stop="goUrl('/pages/album/main?id=' + currentAlbumId)">
        <i-icon type="tasklist" size="30" color="#d6413d" />
        <span>查看专辑</span>
      </div>
      <div class="music-option-item" :disable="currentMVId == 0" @click.stop="delSongFromPlayList(currentSongId)">
        <i-icon type="trash" size="30" color="#d6413d" />
        <span>删除歌曲</span>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      let id = this.$root.$mp.query.id;
      this.getCategoryDetail(id);
    },
    data() {
      return {
        categoryDetail: {},
        currentAlbumId: '',
        currentMVId: '',
        currentSongId: '',
        showOptionsBox: false
      }
    },
    methods: {
      getCategoryDetail: function(id) {
        let vm = this;
        service.getPlayDetailInfo(id).then(function(res) {
          if(res.code == 200) {
            vm.categoryDetail = res.playlist;
          }
        })
      },
      showCurrentSongOptions: function (albumId, mvId, currentSongId) {
        this.currentAlbumId = albumId;
        this.currentMVId = mvId;
        this.currentSongId = currentSongId;
        this.showOptionsBox = true;
      },
      delSongFromPlayList: function ( songId) {
        let vm = this;
        let playListId = vm.categoryDetail.id;
        service.playListOparation('del', playListId, songId).then(function (res) {
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
  .category-detail-box {
    width: 100%;
    height: 100%;
  }

  .category-describe-box {
    height: 20%;
    padding: 2% 5%;
  }

  .category-info-box {
    padding: 0 5%;
  }
  .category-count-box {
    clear: both;
    text-align: center;
  }
  .category-info-box {
    font-size: 26rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .more-icon-box {
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .category-detail-list {
    padding: 0 5% 200rpx 5%;
  }
  .category-item {
    margin-bottom: 20rpx;
    white-space: nowrap;
    font-size: 28rpx;
    line-height: 1.2;
    color: #999;
  }
  .category-item-name {
    display: inline-block;
    color: #333;
    width: 96%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .artist-name {
    font-size: 24rpx;
  }
  .play-all-box {
    padding: 10rpx;
    clear: both;
    font-size: 30rpx;
  }
  .play-all-action-icon {
    float: right;
  }
  .music-option-box {
    position: absolute;
    width: 100%;
    height: 60%;
    bottom: 0;
    background: #fff;
    z-index: 9;
  }
</style>
