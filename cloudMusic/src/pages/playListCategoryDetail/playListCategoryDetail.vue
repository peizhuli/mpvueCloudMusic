<template>
  <div class="app-content">
    <div class="category-detail-box">
      <div class="category-describe-box">
        <card :hasAvatar="true" :avatartUrl="categoryDetail.creator ? categoryDetail.creator.avatarUrl : ''" :picUrl="categoryDetail.coverImgUrl" :title="categoryDetail.creator ? categoryDetail.creator.nickname : ''" :subTitle="categoryDetail.name"></card>
      </div>
      <div class="category-count-box">
        <i-row>
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
        <i-icon i-class="play-all-action-icon" type="other" size="20" />
      </div>
      <ul class="category-detail-list">
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
                    <i class="list-video-icon" v-if="item.mv != 0" @click="goUrl('/pages/playVideo/main?id=' + item.mv)"></i>
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
    <div :class="{musicOptionBox: true, show: showOptionsBox}">
      <div style="width: 100%; height: 50%; background: transparent;" @click="showOptionsBox=false"></div>
      <div style="width: 100%; height: 44%; padding: 3% 5%; background: #fff;">
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
  </div>
</template>

<script>
  import service from '../../service/service';
  import Card from '../../components/card.vue';
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
    components: {
      Card
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
  .app-content {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .category-detail-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .category-describe-box {
    height: 20%;
    padding: 2% 5%;
    background: #ddd;
  }

  .category-info-box {
    padding: 0 5%;
  }
  .category-count-box {
    clear: both;
    text-align: center;
    background: #ddd;
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
    padding: 0 5%;
  }
  .category-item {
    position: relative;
    margin-bottom: 20rpx;
    white-space: nowrap;
    font-size: 28rpx;
    line-height: 1.2;
    color: #999;
  }
  .category-item-name {
    display: inline-block;
    color: #333;
    width: 80%;
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
  .musicOptionBox {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 100%;
    line-height: 2;
    background: rgba(255,255,255,0.3);
    z-index: 9;
    transition: all 0.7s;
  }
  .musicOptionBox.show {
    top: 0;
  }
</style>
