<template>
  <div class="app-content">
    <div class="album-info-box">
      <i-row class="album-info-content">
        <i-col :span="6">
        <img class="col-img" :src="album.blurPicUrl" />
        </i-col>
        <i-col :span="18" class="album-detail-box">
          <div class="col-content">
            <div class="artist-name">{{ album.artist ? album.artist.name : '' }} - {{ album.name }}</div>
            <div>{{ album.description ? (album.description.length > 100 ? album.description.substr(0,99) : album.description) : '' }}</div>
          </div>
        </i-col>
      </i-row>
    </div>
    <div class="song-list-box">
      <ul class="song-list">
        <li class="song-item" v-for="(item, index) in songs" :key="item.id">
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
                    <i-icon type="playon" size="20" v-if="item.mv != 0" @click.stop="goUrl('/pages/playVideo/main?id=' + item.mv)" />
                    <i-icon type="more" size="20" @click.stop="showCurrentSongOptions(item.al.id, item.mv, item.id)" />
                  </span>
              </div>
              <div class="artist-name">
                {{ item.ar ? item.ar[0].name : '' }}
                <span> - {{ item.al ? item.al.name : '' }}</span>
              </div>
              </i-col>
            </i-row>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      this.albumId = this.$root.$mp.query.id;
      if(this.albumId != '') {
        this.getAlbumInfo(this.albumId);
      }
    },
    data() {
      return {
        albumId: '',
        album: {},
        songs: [],
        currentMVId: '',
        currentSongId: '',
        showOptionsBox: false
      }
    },
    methods: {
      getAlbumInfo: function(albumId) {
        let vm = this;
        service.getAlbum(albumId).then(function(res) {
          vm.album = res.album;
          vm.songs = res.songs;
        })
      },
      showCurrentSongOptions: function (albumId, mvId, currentSongId) {
        this.currentAlbumId = albumId;
        this.currentMVId = mvId;
        this.currentSongId = currentSongId;
        this.showOptionsBox = true;
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
  .album-info-box {
    padding: 10rpx;
  }
  .album-info-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #999;
  }
  .album-info-content .artist-name {
    color: #333;
    font-size: 26rpx;
    margin-bottom: 10rpx;
  }
  .album-detail-box {
    padding-left: 20rpx;
  }
  .more-icon-box {
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .song-list {
    padding: 0 5% 20rpx 5%;
  }
  .category-item {
    white-space: nowrap;
    font-size: 26rpx;
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
</style>
