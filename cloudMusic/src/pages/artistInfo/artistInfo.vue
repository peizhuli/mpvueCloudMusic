<template>
  <div class="app-content">
    <div class="singer-brief" :style="{background: artistBgUrl}">
      <!--<img :src="artistInfo.picUrl" />-->
      <p>{{ artistInfo.name }}</p>
    </div>
    <div>
      <i-tabs i-class="tab-bar" :current="currentTabName" color="#f759ab" @change="handleChange">
        <i-tab key="hot" title="热门"></i-tab>
        <i-tab key="album" title="专辑"></i-tab>
        <i-tab key="mv" title="MV"></i-tab>
        <i-tab key="info" title="歌手信息"></i-tab>
      </i-tabs>


        <div class="tab-content" v-if="currentTabName == 'hot'">
          <ul class="hot-songs-list">
            <li v-for="item in artistHotSongs" :key="item.id" @click="goPlayMusic(item.id)">
              <i-icon type="ios-heart-outline" @click.stop="likeMusic(!IsLike, item.id)" />
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <div class="tab-content" v-if="currentTabName == 'album'">
          <div class="album-item" v-for="item in artistAlbums" :key="item.id">
            <i-row>
              <i-col span="8">
              <img class="col-img" :src="item.picUrl" />
              </i-col>
              <i-col span="16">
                <div class="col-content">
                  <div>{{ item.name }}</div>
                  <div>{{ item.publishTime }}</div>
                </div>
              </i-col>
            </i-row>
          </div>
        </div>
        <div class="tab-content" v-if="currentTabName == 'mv'">
          <div class="album-item" v-for="item in artistMVs" :key="item.id">
            <i-row>
              <i-col span="8">
              <img class="col-img" :src="item.imgurl" />
              </i-col>
              <i-col span="16">
                <div class="col-content">
                  <div>{{ item.name }}</div>
                  <div>{{ item.publishTime }}</div>
                </div>
              </i-col>
            </i-row>
          </div>
        </div>
        <div class="tab-content" v-if="currentTabName == 'info'">
          <div class="info-item">
            <div class="info-title"><span>歌手简介</span></div>
            <div class="info-describe">{{ artistInfo.briefDesc }}</div>
          </div>
          <div class="info-item" v-for="item in artistInfo.introduction">
            <div class="info-title"><span>{{ item.ti }}</span></div>
            <div class="info-describe">{{ item.txt }}</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import service from '../../service/service';
  export default {
    mounted() {
      this.artistUID = this.$root.$mp.query.id;
      this.getArtistPlays(this.artistUID);
      wx.setNavigationBarTitle({
        title: this.artistName
      });
    },
    data() {
      return {
        artistUID: '',
        artistName: '',
        artistBgUrl: '',
        artistInfo: {},
        artistHotSongs: [],
        artistMVs: [],
        artistAlbums: [],
        IsLike: false,
        currentTabName: 'hot'
      }
    },
    computed: {
      ...mapState(['likeMusicList'])
    },
    methods: {
      getArtistPlays: function(uid) {
        let vm = this;
        service.getArtistSongs(uid).then(function (res) {
          console.log(res);
//        vm.artistInfo = res.artist;
          vm.artistBgUrl = 'url(' + res.artist.picUrl + ') center no-repeat';
          vm.artistName = res.artist.name;
          vm.artistHotSongs = res.hotSongs;
        });
      },
      handleChange: function(detail) {
        this.currentTabName =  detail.target.key;
        switch(this.currentTabName) {
          case 'hot': {
            this.getArtistPlays(this.artistUID);
            break;
          }
          case 'album': {
            this.getArtistAlbum(this.artistUID);
            break;
          }
          case 'mv': {
            this.getArtistMV(this.artistUID);
            break;
          }
          case 'info': {
            this.getArtistInfo(this.artistUID);
            break;
          }
        }
      },
      getIsLike: function(id) {
        this.IsLike = false;
        this.artistHotSongs.each();
        this.likeMusicList.map(function(item) {
          if(item == id) {
            this.IsLike = true;
          }
        })
      },
      getArtistAlbum: function(uid) {
        let vm = this;
        service.getArtistAlbum(uid).then(function (res) {
          vm.artistAlbums = res.hotAlbums;
        })
      },
      getArtistMV: function (uid) {
        let vm = this;
        service.getArtistMV(uid).then(function (res) {
          vm.artistMVs = res.mvs;
        })
      },
      getArtistInfo: function (uid) {
        let vm = this;
        service.getArtistInfo(uid).then(function (res) {
          vm.artistInfo = res;
        })
      },
      goPlayMusic: function(id) {
        this.$router.push({path: '/playMusic', query: { id: id }});
      },
      likeMusic: function (IsLike, id) {
        service.likeMusic(IsLike, id).then(function (res) {})
      }
    }
  }
</script>

<style scoped>
  .tab-bar {
    padding-bottom: 40rpx;
    text-align: center;
  }
  .singer-brief {
    width: 100%;
    height: 300rpx;
  }
  .album-item {
    margin-top: 30rpx;
    padding: 20rpx;
    background: #fff;
  }
  .album-item img {
    max-width: 100%;
  }
  .info-item {
    margin-top: 30rpx;
    padding: 20rpx;
    background: #fff;
  }
  .info-title {
    margin-bottom: 20rpx;
    border-left: 5px solid #d6413d;
  }
  .info-title > span {
    display: inline-block;
    padding-left: 20rpx;
  }
  .hot-songs-list {
    padding: 20rpx 30rpx;
    text-align: left;
    font-size: 26rpx;
    line-height: 2;
  }
</style>
