<template>
  <div class="app-content">
    <div class="playing-audio-box">
      <div class="playing-bg-box">
        <img :src="musicInfo.al ? musicInfo.al.picUrl : ''" />
      </div>
      <div :class="{'audio-pic-box': true, 'playing': IsPlay, 'pause': !IsPlay }" @click="showLrc()">
        <img ref="albumImg" id="albumImg" :src="musicInfo.al ? musicInfo.al.picUrl : ''" />
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
        <i-icon type="message" size="30" @click="goUrl('/pages/comment/main?id=' + musicId)" />
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
      <i :class="{playOrderIcon: true, randomIcon: playOrderType == 0, sequenceIcon: playOrderType == 1, listCircleIcon: playOrderType == 2, singleCircle: playOrderType == 3}"></i>
      <i class="musicActionIcon prevIcon" @click.stop="preMusic()" ></i>
      <i :class="{musicActionIcon: true, playIcon: IsPlay, pauseIcon: !IsPlay}" @click="togglePlay()"></i>
      <i class="musicActionIcon nextIcon" @click.stop="nextMusic()"></i>
      <i class="musicActionIcon listIcon" @click="getUserPlayLists"></i>
      <!--<i-icon type="return" size="40" color="#d6413d" @click.stop="preMusic()" />-->
      <!--<i-icon :type="IsPlay ? 'suspend' : 'play'" size="40" color="#d6413d" @click="togglePlay()" />-->
      <!--<i-icon type="enter" size="40" color="#d6413d" @click.stop="nextMusic()" />-->
      <!--<i-icon type="other" size="40" @click="getUserPlayLists" />-->
    </div>
    <div :class="{playListBox: true, show: IsShowPlayList}" ref="playListBox">
      <div class="list-padding" @click="hidePlayList()"></div>
      <div class="play-list">
        <div class="play-item" v-for="item in allPlayList" :key="item.song.id">
          <i-row class="">
            <i-col span="22" @click="playSpecificMusic(item.song.id)">
            <div class="">{{ item.song.name }} - {{ item.song.ar["0"].name }}</div>
            <div v-if="item.song.alia.length" style="color: #999; font-size: 24rpx;">{{ item.song.alia["0"] }}</div>
            </i-col>
            <i-col span="2">
              <i-icon type="trash" size="30" color="#d6413d" @click="delPlayMusic(item.song.al.id, item.song.id)" />
            </i-col>
          </i-row>
        </div>
      </div>
    </div>
    <lrc :lrcList="lyric" :currentTime="currentTime" @hideLrc="IsShowLrc = false" v-if="IsShowLrc"></lrc>
  </div>
</template>

<script>
  //在切换其他路由时，保持当前音乐列表播放，页面不显示
  //播放列表获取， 播放类型： 循环，随机等
  import util from '../../utils/index';
  import {mapState, mapMutations} from 'vuex'
  import service from '../../service/service'
  import lrc from '../../components/lrc';
  export default {
    data() {
      return {
        playUrl: '',
        lyric: [],
        hotComments: [],
        comments: [],
        musicId: '',
        currentTime: 0,
        maxTime: 0,
        duration: 0,
        playTime: '00:00',
        IsPlay: false,
        musicInfo: {},
        IsShowLrc: false,
        IsShowPlayList: false,
        allPlayList: [],
        currentPlayList: [],
        IsLike: false,
        imgRotateAngle: 0,
        audio: '',
        audioBg: '',
        animation: '',
        playOrderType: 0
      }
    },
    components: {
      lrc
    },
    computed: {
      ...mapState(['likeMusicList', 'playRecords', 'currentMusicId'])
    },
    mounted() {
//      this.audioBg = "url('../../../static/img/music/play-radio-bg.png') no-repeat center";
      this.IsShowPlayList = false;
      this.musicId = this.$root.$mp.query.id || this.currentMusicId;
      this.allPlayList = this.playRecords;
      this.initPlay();
    },
    methods: {
      ...mapMutations(['SET_CURRENT_MUSIC_ID', 'SET_LIKE_MUSIC_LIST']),
      initPlay: function() {
        let vm = this;
        vm.IsShowLrc = false;
        vm.IsPlay = false;
        vm.getMusicDetail(vm.musicId);
        vm.getMusicUrl(vm.musicId);
        if(vm.currentMusicId != vm.musicId) {
          if(vm.audio != '' && vm.audio != null) {
            vm.audio.destroy();
          }
          vm.audio = wx.createInnerAudioContext();
          vm.audio.src = vm.playUrl;
          let durationInterval = setInterval(function () {
            if(vm.audio.duration) {
              clearInterval(durationInterval);
            }
            vm.getMusicDuration();
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
            vm.IsPlay = false;
            vm.audio.pause();
            vm.currentTime = 0;
            vm.playTime = '00:00';
          });
          vm.audio.onSeeked(function() {
            console.log(vm.audio);
          });
        }
        vm.SET_CURRENT_MUSIC_ID(vm.musicId);
      },
      getMusicDetail: function (id) {
        let vm = this;
        service.getSongDetail(id).then(function (res) {
          vm.musicInfo = res.songs[0];
          wx.setNavigationBarTitle({
            title: vm.musicInfo.name
          });
        })
      },
      getMusicUrl: function(id) {
        let vm = this;
        if(id) {
          service.getPlayUrl(id).then(function(res) {
            vm.playUrl = res.data["0"].url;
          });
          vm.likeMusicList.map(function (item) {
            if(item == id) {
              vm.IsLike = true;
            }
          });
        }
      },
      getMusicLyric: function(id) {
        let vm = this;
        if(id) {
          service.getIcy(id).then(function(res) {
            if(res.code == 200) {
              vm.lyric = [];
              if(!res.nolyric) {
                let lrc = res.lrc.lyric.split('\n');
                lrc.map(function (item) {
                  let sec = item.substr(1, item.indexOf(']') - 1);
                  let content = item.substr(item.indexOf(']') + 1);
                  let obj = {
                    sec: util.timeToSec(sec),
                    content: content,
                    time: sec.substr(0,5)
                  };
                  vm.lyric.push(obj);
                });
              }
            }
          })
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
      toggleLikeMusic: function () {
        let vm = this;
        service.likeMusic(!vm.IsLike, vm.musicId).then(function (res) {
          //更新state
          if(res.code == 200) {
//            alert(vm.IsLike ? '取消喜欢' : '已喜欢');
            let currentLikeMusicList = vm.likeMusicList;
            vm.IsLike ? currentLikeMusicList.splice(currentLikeMusicList.indexOf(vm.musicId), 1) : currentLikeMusicList.push(vm.musicId);
            vm.SET_LIKE_MUSIC_LIST(currentLikeMusicList);
            vm.IsLike = !vm.IsLike;
          }

        })
      },
      showLrc: function () {
        if(!this.lyric.length) {
          this.getMusicLyric(this.musicId);
        }
        this.IsShowLrc = true;
      },
      getMusicComment: function (id) {
        let vm = this;
        service.getMusicComment(id).then(function (res) {
          if(res.code == 200) {
            vm.hotComments = res.hotComments;
            vm.comments = res.comments;
          }
        })
      },
      getUserPlayLists: function () {
        let vm = this;
        service.getUserPlayLists(vm.$store.state.user.profile.userId, 0).then(function (res) {
          if(res.code == 200) {
            vm.allPlayList = res.allData;
            vm.IsShowPlayList = true;
          }
        })
      },
      hidePlayList: function() {
          this.IsShowPlayList = false;
      },
      playSpecificMusic: function(id) {
        this.musicId = id;
        this.IsShowPlayList = false;
        this.initPlay();
      },
      delPlayMusic: function (id, str) {
        let vm = this;
        service.playListOparation('del', id, str).then(function (res) {
          console.log(res);
        })
      },
      nextMusic: function () {
        let vm = this;
        let playIndex = 0;
        vm.IsPlay = false;
        vm.allPlayList.map(function(item, index) {
          if(vm.musicId == item.song.id) {
            playIndex = index == vm.allPlayList.length - 1 ? 0 : index + 1;
          }
        });
        vm.musicId = vm.allPlayList[playIndex].song.id;
        vm.initPlay();
      },
      preMusic: function () {
        let vm = this;
        let playIndex = 0;
        vm.IsPlay = false;
        vm.allPlayList.map(function(item, index) {
          if(vm.musicId == item.song.id) {
            playIndex = index == 0 ? vm.allPlayList.length - 1 : index - 1;
          }
        });
        vm.musicId = vm.allPlayList[playIndex].song.id;
        vm.initPlay();
      },
      changePlayOrder: function() {
          this.playOrderType = this.playOrderType == 3 ? 0 : this.playOrderType++;
          switch(this.playOrderType) {
            case 0: {
                //随机
                break;
            }
            case 1: {
                //顺序播放
                break;
            }
            case 2: {
                //列表循环
                break;
            }
            case 3: {
                //单曲循环
                break;
            }
          }
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
