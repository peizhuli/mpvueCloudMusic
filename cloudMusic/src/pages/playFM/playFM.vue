<template>
  <div class="app-content">
    <div class="playing-audio-box">
      <div class="playing-bg-box">
        <!--<img :src="fmInfo.al ? fmInfo.al.picUrl : ''" />-->
      </div>
      <div :class="{'audio-pic-box': true, 'playing': IsPlay, 'pause': !IsPlay }">
        <img ref="albumImg" id="albumImg" :src="fmInfo.picUrl" />
      </div>
    </div>
    <i-row class="song-action-box">
      <i-col span="6">
        <i-icon :type="IsLike ? 'like_fill' : 'like'" :color="IsLike ? '#d6413d' : ''" size="30" @click="toggleLikeMusic()" />
      </i-col>
      <i-col span="6">
        <i-icon type="ios-download-outline" size="30" />
      </i-col>
      <i-col span="6">
        <i-icon type="message" size="30" @click="goUrl('/pages/comment/main?id=' + fmId + '&type=0')" />
      </i-col>
      <i-col span="6">
        <i-icon type="share" size="30" />
      </i-col>
    </i-row>
    <i-row i-class="slide-box">
      <i-col span="5">
        <span>{{ playTime }}</span>
      </i-col>
      <i-col span="14">
        <slider :value="currentTime" :min="0" :max="maxTime" backgroundColor="#999" activeColor="#d6413d" block-color="#d6413d" block-size="18" @change="slideMusicTime"></slider>
      </i-col>
      <i-col span="5">
        <span>{{ duration }}</span>
      </i-col>
    </i-row>
    <div class="play-action-box">
      <i :class="{playOrderIcon: true, randomIcon: playOrderType == 0, sequenceIcon: playOrderType == 1, singleCircle: playOrderType == 2}" @click.stop="changePlayOrder()"></i>
      <i class="musicActionIcon prevIcon" @click.stop="preMusic()" ></i>
      <i :class="{musicActionIcon: true, playIcon: IsPlay, pauseIcon: !IsPlay}" @click="togglePlay()"></i>
      <i class="musicActionIcon nextIcon" @click.stop="nextMusic()"></i>
      <i class="musicActionIcon listIcon" @click="getUserPlayLists"></i>
    </div>
    <div class="dj-info-box">
      <i-row>
        <i-col span="4">
          <i-avatar :src="fmInfo.avatarUrl"></i-avatar>
        </i-col>
        <i-col span="18">
          <span>{{ fmInfo.nickname }} - {{ fmInfo.signature }}</span>
        </i-col>
      </i-row>
    </div>
  </div>
</template>

<script>
  import util from '../../utils/index';
  import {mapState, mapMutations} from 'vuex'
  import service from '../../service/service'
  export default {
    data() {
      return {
        playUrl: '',
        hotComments: [],
        comments: [],
        fmId: '',
        RadioId: '',
        album: '',
        currentTime: 0,
        maxTime: 0,
        duration: 0,
        playTime: '00:00',
        IsPlay: false,
        fmInfo: {},
        audio: '',
        animation: '',
        playOrderType: 0
      }
    },
    computed: {
      ...mapState(['currentMusicId'])
    },
    mounted() {
      let vm = this;
      vm.fmId = vm.$root.$mp.query.id;
      vm.RadioId = vm.$root.$mp.query.RadioId;
      vm.initPlay();
    },
    methods: {
      ...mapMutations(['SET_CURRENT_MUSIC_ID', 'SET_LIKE_MUSIC_LIST', 'SET_PLAY_LIST']),
      initPlay: function() {
        let vm = this;
        vm.IsPlay = false;
        vm.getFMDetail(vm.RadioId);
        vm.getFMUrl(vm.fmId);
//        if(vm.currentMusicId != '' && vm.currentMusicId != vm.fmId) {
          if(vm.audio != '' && vm.audio != null) {
            vm.audio.destroy();
          }
          vm.audio = wx.createInnerAudioContext();
          vm.audio.src = vm.playUrl;
          let durationInterval = setInterval(function () {
            vm.getMusicDuration();
            if(vm.audio.duration) {
              clearInterval(durationInterval);
            }
          },50);
          vm.audio.onCanplay(function() {
            vm.audio.play();
            vm.IsPlay = true;
          });
          vm.audio.onTimeUpdate(function() {
            vm.currentTime = vm.audio.currentTime;
            vm.playTime = util.formatterDuration(vm.currentTime);
          });
          vm.audio.onEnded(function() {
            vm.nextMusic();
          });
//        }
      },
      getFMDetail: function (id) {
        let vm = this;
        service.getDJDetail(id).then(function (res) {
          vm.fmInfo = res.djRadio;
          wx.setNavigationBarTitle({
            title: vm.fmInfo.name
          });
        })
      },
      getFMUrl: function(id) {
        let vm = this;
        if(id) {
          service.getDJUrl(id).then(function(res) {
              console.log(res);
            vm.playUrl = res.data["0"].url;
          });
        }
      },
      getMusicDuration: function() {
        let duration = this.audio.duration;
        this.maxTime = parseInt(duration);
        duration = util.formatterDuration(duration);
        this.duration = duration;
      },
      togglePlay: function() {
        this.IsPlay = !this.IsPlay;
        this.IsPlay ? this.audio.play() : this.audio.pause();
      },
      slideMusicTime: function(obj) {
        this.playTime = util.formatterDuration(obj.mp.detail.value);
        this.currentTime = obj.mp.detail.value;
        this.audio.seek(obj.mp.detail.value);
        if(this.audio.paused) {
          this.audio.play();
        }
      },
      getMusicComment: function (id) {
        let vm = this;
        service.getComment('dj', id).then(function (res) {
          if(res.code == 200) {
            vm.hotComments = res.hotComments;
            vm.comments = res.comments;
          }
        })
      },
      nextMusic: function () {
        let vm = this;
        let playIndex = 0;
        vm.IsPlay = false;
//        vm.allPlayList.map(function(item, index) {
//          if(vm.musicId == item.song.id) {
//            playIndex = index == vm.allPlayList.length - 1 ? 0 : index + 1;
//          }
//        });
//        vm.musicId = vm.allPlayList[playIndex].song.id;
        vm.initPlay();
      },
      preMusic: function () {
        let vm = this;
        let playIndex = 0;
        vm.IsPlay = false;
//        vm.allPlayList.map(function(item, index) {
//          if(vm.musicId == item.song.id) {
//            playIndex = index == 0 ? vm.allPlayList.length - 1 : index - 1;
//          }
//        });
//        vm.musicId = vm.allPlayList[playIndex].song.id;
        vm.initPlay();
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
  .playing-audio-box {
    width: 100%;
    height: 60%;
    /*position: relative;*/
    /*overflow: hidden;*/
  }
  .song-action-box {
    text-align: center;
  }
  .play-action-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 100rpx;
  }
  .playing-bg-box {
    position: absolute;
    width: 300%;
    height: 300%;
    top: -50%;
    left: -50%;
    z-index: -1;
    filter: blur(30px);
    -webkit-filter: blur(30px);
  }
  .playing-bg-box img {
    width: 100%;
    height: 100%;
  }
  .audio-pic-box {
    width: 60%;
    margin: 5% auto;
    /*background: url("../../../static/img/music/play-radio-bg.png") center no-repeat;*/
  }
  .audio-pic-box.playing {
    animation: rotate 30s linear infinite;
  }
  .audio-pic-box.pause {
    animation-play-state: paused;
  }
  .play-action-box i {
    cursor: pointer;
  }
  .audio-pic-box > img {
    position: relative;
    border-radius: 50%;
  }
  .playListBox {
    width: 94%;
    height: 100%;
    position: absolute;
    z-index: 99;
    top: 100%;
    transition: all 0.7s;
  }
  .playListBox.show {
    top: 0;
  }
  .list-padding {
    width: 100%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .play-list {
    width: 100%;
    height: 60%;
    padding: 30rpx;
    font-size: 26rpx;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
  }
  .play-item {
    margin-bottom: 20rpx;
  }
  #albumImg {
    transition: all 0.1s;
  }
  .slide-box {
    margin: 40rpx auto;
  }
  .musicActionIcon,
  .playOrderIcon {
    display: inline-block;
    width: 88rpx;
    height: 88rpx;
    position: relative;
  }
  .randomIcon {
    background: url("../../../static/img/music/random-play-icon.png") center no-repeat;
  }
  .sequenceIcon {
    background: url("../../../static/img/music/sequense-play-icon.png") center no-repeat;
  }
  .listCircleIcon {
    background: url("../../../static/img/music/list-circle-play-icon.png") center no-repeat;
  }
  .singleCircle {
    background: url("../../../static/img/music/single-circle-play-icon.png") center no-repeat;
  }
  .prevIcon {
    background: url("../../../static/img/music/preIcon.png") center no-repeat;
  }
  .nextIcon {
    background: url("../../../static/img/music/nextIcon.png") center no-repeat;
  }
  .playIcon {
    background: url("../../../static/img/music/playIcon.png") center no-repeat;
  }
  .pauseIcon {
    background: url("../../../static/img/music/pauseIcon.png") center no-repeat;
  }
  .listIcon {
    background: url("../../../static/img/music/list-icon.png") center no-repeat;
  }
</style>
