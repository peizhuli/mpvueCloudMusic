<template>
  <div class="app-content">
    <div class="account-manage-box">
      <ul class="account-list">
        <li class="account-item">
          <i-con type="ios-musical-notes-outline" size="50" color="#d6413d" />
          <span>
              本地音乐<span class="manage-count"> (5)</span>
          </span>
        </li>
        <li class="account-item" @click="$router.push('/playRecord')">
          <i-con type="ios-stats-outline" size="50" color="#d6413d" />
          <span>
              最近播放<span class="manage-count"> ({{ recentPlayListCount }})</span>
              <i-con type="customerservice" size="30" color="#d6413d"></i-con>
          </span>
        </li>
        <li class="account-item">
          <i-con type="ios-radio" size="50" color="#d6413d" />
          <span>
              我的电台<span class="manage-count"> ({{ djCount }})</span>
          </span>
        </li>
        <li class="account-item" @click="$router.push({path: '/collection', query: { id: user.profile.userId }})">
          <i-con type="ios-person-add-outline" size="50" color="#d6413d" />
          <span>
              我的收藏<span class="manage-count"> ({{ collectionCount }}) </span>
          </span>
        </li>
      </ul>
    </div>
    <div class="created-play-box">
      <div class="created-play-header">
        <i-con type="ios-arrow-down" size="30" color="#999" />
        <span>创建的歌单({{ createPlayListCount }})</span>
        <i-con type="ios-settings-outline" size="30" color="#999" />
      </div>
      <div class="play-list">
        <div class="play-list-item" v-for="item in playList" :key="item.id" @click="goUrl('/pages/playListCategoryDetail/main?id=' + item.id)">
          <i-row>
            <i-col span="10">
              <img class="col-img" :src="item.coverImgUrl" />
            </i-col>
            <i-col span="14">
              <div class="col-content">
                <div class="play-list-name">{{ item.name }}</div>
                <div>更新时间：{{ formatterTime(item.trackUpdateTime) }}</div>
              </div>
            </i-col>
          </i-row>
        </div>
      </div>
      <div class="created-play-header">
        <i-con type="ios-arrow-down" size="30" color="#999" />
        <span>喜欢的歌单({{ subPlaylistCount }})</span>
        <i-con type="ios-settings-outline" size="30" color="#999" />
      </div>
      <div class="play-list">
        <div class="play-list-item" v-for="item in likePlayList" :key="item.id" @click="goUrl('/pages/playListCategoryDetail/main?id=' + item.id)">
          <i-row>
            <i-col span="10">
              <img class="col-img" :src="item.coverImgUrl" />
            </i-col>
            <i-col span="14">
              <div class="col-content">
                <div class="play-list-name">{{ item.name }}</div>
                <div>更新时间：{{ formatterTime(item.trackUpdateTime) }}</div>
              </div>
            </i-col>
          </i-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import util from '../../utils/index';
  import service from '../../service/service';
  export default {
      mounted() {
          this.getUserSubcount();
          this.getUserPlayLists();
          this.getUserPlayList();
          this.getLocalMusic();
      },
      data() {
          return {
            recentPlayListCount: 0,
            collectionCount: 0,
            djCount: 0,
            createPlayListCount: 0,
            subPlaylistCount: 0,
            playList: [],
            likePlayList: []
          }
      },
      computed: {
        ...mapState(['user'])
      },
    methods: {
      getUserPlayLists: function () {
        let vm = this;
        service.getUserPlayLists(vm.user.profile.userId).then(function (res) {
          vm.recentPlayListCount = res.weekData.length;
        })
      },
      getUserSubcount: function () {
        let vm = this;
        service.getUserSubcount().then(function (res) {
            vm.createPlayListCount = res.createdPlaylistCount;
            vm.djCount = res.djRadioCount;
            vm.collectionCount = res.subPlaylistCount;
            vm.subPlaylistCount = res.subPlaylistCount;
        })
      },
      getUserPlayList: function () {
        let vm = this;
        service.getUserSongs(vm.user.profile.userId).then(function (res) {
          res.playlist.map(function(item) {
              if(item.creator.userId == vm.user.profile.userId) {
                vm.playList.push(item);
              } else {
                vm.likePlayList.push(item);
              }
          });
        })
      },
      toggleCollectMusic: function(id) {
          let vm = this;
          let t= 2;
          service.toggleCollectMusic(t, id).then(function (res) {
            console.log(res);
          })
      },
      formatterTime: function (time) {
        return util.formatterTime(time);
      },
      getLocalMusic: function () {

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
  .account-manage-box {
    width: 100%;
    padding: 2%;
    text-align: left;
    font-size: 30rpx;
    line-height: 60rpx;
    color: #000;
    background: #f3f4f8;
  }
  .account-item {
    padding-left: 30rpx;
    position: relative;
  }
  .account-item > i.ivu-icon {
    position: absolute;
    left: 0;
    top: 20rpx;
  }
  .account-item > span {
    width: 100%;
    display: inline-block;
    border-bottom: 1px solid #ccc;
  }
  .account-item > span > i {
    float: right;
    line-height: 60rpx
  }
  .manage-count {
    font-size: 24rpx;
    color: #999;
  }
  .created-play-box {
    padding: 20rpx 30rpx;
    font-size: 24rpx;
    background: #E8EAE9;
  }
  .play-list-name {
    font-size: 30rpx;
    color: #333;
    line-height: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
