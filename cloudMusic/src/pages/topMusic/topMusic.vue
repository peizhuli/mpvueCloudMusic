<template>
  <div class="app-content">
    <div class="top-list-box">
      <div class="top-list-info-box">
        <i-row class="top-list-info">
          <i-col span="6">
          <img class="col-img" :src="topList.coverImgUrl" />
          </i-col>
          <i-col span="18">
            <div class="col-content">
              <div>{{ topList.name }}</div>
              <div>{{ topList.description }}</div>
              <div>播放次数：{{ topList.playCount }}  分享次数：{{ topList.shareCount }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
      <ul class="top-list">
        <li v-for="item in topList.tracks" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.id)">
          <i-icon type="md-arrow-dropright-circle"size="20" />
          <span class="top-item-name">
            {{ item.name }}
            <span v-if="item.alia.length"> - {{ item.alia[0] }}</span>
          </span>
          <i-icon class="more-info" type="more" size="20" @click.stop="showCurrentSongOptions(item.al.id, item.mv, item.id)" />
        </li>
      </ul>
    </div>
    <div :class="{musicOptionBox: true, show: showOptionsBox}">
      <div style="width: 100%; height: 40%; background: transparent;"></div>
      <div style="width: 100%; height: 60%; background: #fff;">
        <div class="music-option-item" :disable="currentMVId == 0" @click.stop="goUrl('/pages/playVideo/main?id=' + currentMVId)">
          <i-icon type="live" size="30" color="#d6413d" />
          <span>查看视频</span>
        </div>
        <div class="music-option-item" :disable="currentMVId == 0" @click.stop="goUrl('/pages/album/main?id=' + currentAlbumId)">
          <i-icon type="tasklist" size="30" color="#d6413d" />
          <span>查看专辑</span>
        </div>
        <!--<div class="music-option-item" :disable="currentMVId == 0" @click.stop="delSongFromPlayList(currentSongId)">-->
          <!--<i-icon type="trash" size="30" color="#d6413d" />-->
          <!--<span>删除歌曲</span>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service'
  export default {
    mounted() {
      let name = this.$root.$mp.query.name;
      this.getTopList(name);
      wx.setNavigationBarTitle({
        title: name
      });
    },
    data() {
      return {
        topTypes: [
          {
            value: 0,
            name: '云音乐新歌榜'
          },
          {
            value: 1,
            name: '云音乐热歌榜'
          },
          {
            value: 2,
            name: '网易原创歌曲榜'
          },
          {
            value: 3,
            name: '云音乐飙升榜'
          },
          {
            value: 4,
            name: '云音乐电音榜'
          },
          {
            value: 5,
            name: 'UK排行榜周榜'
          },
          {
            value: 6,
            name: '美国Billboard周榜'
          },
          {
            value: 7,
            name: 'KTV嗨榜'
          },
          {
            value: 8,
            name: 'iTunes榜'
          },
          {
            value: 9,
            name: 'Hit FM Top榜'
          },
          {
            value: 10,
            name: '日本Oricon周榜'
          },
          {
            value: 11,
            name: '韩国Melon排行榜周榜'
          },
          {
            value: 12,
            name: '韩国Mnet排行榜周榜'
          },
          {
            value: 13,
            name: '韩国Melon原声周榜'
          },
          {
            value: 14,
            name: '中国TOP排行榜(港台榜)'
          },
          {
            value: 15,
            name: '中国TOP排行榜(内地榜)'
          },
          {
            value: 16,
            name: '香港电台中文歌曲龙虎榜'
          },
          {
            value: 17,
            name: '华语金曲榜'
          },
          {
            value: 18,
            name: '中国嘻哈榜'
          },
          {
            value: 19,
            name: '法国 NRJ EuroHot 30周榜'
          },
          {
            value: 20,
            name: '台湾Hito排行榜'
          },
          {
            value: 21,
            name: 'Beatport全球电子舞曲榜'
          },
          {
            value: 22,
            name: '云音乐ACG音乐榜'
          },
          {
            value: 23,
            name: '云音乐嘻哈榜'
          }
        ],
        topList: {},
        currentAlbumId: '',
        currentMVId: '',
        currentSongId: '',
        showOptionsBox: false
      }
    },
    methods: {
      getTopList: function (name) {
        let vm = this;
        let id = '';
        vm.topTypes.map(function(item) {
          if(item.name == name) {
            id = item.value;
          }
        });
        service.getTop(id).then(function (res) {
          vm.topList = res.playlist;
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
    overflow: hidden;
  }
  .top-list-box {
    padding: 20rpx;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .top-list-info {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
  }
  .top-item-name {
    display: inline-block;
    width: 90%;
    font-size: 24rpx;
    line-height: 1.6;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .more-info {
    float: right;
    padding-right: 20rpx;
  }
  .musicOptionBox {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 100%;
    z-index: 9;
    transition: all 0.7s;
  }
  .musicOptionBox.show {
    top: 0;
  }
</style>
