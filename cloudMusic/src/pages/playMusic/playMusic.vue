<template>
  <div class="app-content">
    <div class="playing-audio-box">
      <div class="audio-pic-box" @click="showLrc()">
        <img ref="albumImg" id="albumImg" :src="musicInfo.al ? musicInfo.al.picUrl : ''" />
      </div>
    </div>
    <!--<p>{{ lyric }}</p>-->
    <i-row class="song-action-box">
      <i-col span="6">
      <i-icon :type="IsLike ? 'like_fill' : 'like'" :color="IsLike ? '#d6413d' : ''" size="30" @click="toggleLikeMusic()" />
      </i-col>
      <i-col span="6">
      <i-icon type="ios-download-outline" size="30" />
      </i-col>
      <i-col span="6">
      <i-badge :count="comments.length">
        <Icon type="message" size="30" @click="$router.push({path: '/Comments', query: { type: 0, id: $route.query.id }})" />
      </i-badge>
      </i-col>
      <i-col span="6">
      <Icon type="share" size="30" />
      </i-col>
    </i-row>
    <i-row i-class="slide-box">
      <i-col span="5">
      <span>{{ playTime }}</span>
      </i-col>
      <i-col span="14">
      <!--<i-slide i-class="slider" :value="currentTime" :min="0" :max="maxTime" :tip-format="hideFormat" @on-change="slideMusicTime"></i-slide>-->
        <slider :value="currentTime" :min="0" :max="maxTime" @change="slideMusicTime"></slider>
      </i-col>
      <i-col span="5">
      <span>{{ duration }}</span>
      </i-col>
    </i-row>
    <audio id="audio" :src="playUrl" @play="startPlay" @pause="stopPlay" @timeupdate="timeUpdate" @ended="endPlay"></audio>

    <div class="play-action-box">
      <i-icon type="tasklist" size="40" color="#d6413d" />
      <i-icon type="return" size="40" color="#d6413d" @click.stop="preMusic()" />
      <i-icon :type="IsPlay ? 'suspend' : 'play'" size="40" color="#d6413d" @click="IsPlay ? stopPlay() : startPlay()" />
      <i-icon type="enter" size="40" color="#d6413d" @click.stop="nextMusic()" />
      <!--<Icon type="md-more" size="40" @click="getUserPlayLists" />-->
      <i-icon type="other" size="40" @click="getUserPlayLists" />
    </div>
    <div class="play-list-box" ref="playListBox">
      <div class="list-padding" @click="hidePlayList()"></div>
      <div class="play-list">
        <div class="play-item" v-for="item in allPlayList" :key="item.song.id">
          <i-row class="">
            <i-col span="22">
            <div class="">{{ item.song.name }} - {{ item.song.ar["0"].name }}</div>
            <div v-if="item.song.alia.length" style="color: #999; font-size: 1rem;">{{ item.song.alia["0"] }}</div>
            </i-col>
            <i-col span="2">
            <i-icon type="ios-trash-outline" size="30" color="#d6413d" @click="delPlayMusic(item.song.al.id, item.song.id)" />
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
        allPlayList: [],
        IsLike: false,
        imgRotateAngle: 0,
        audio: ''
      }
    },
    components: {
      lrc
    },
    computed: {
      ...mapState(['likeMusicList', 'playRecords'])
    },
    mounted() {
      this.musicId = this.$root.$mp.query.id || this.$store.state.currentMusicId;
      this.allPlayList = this.playRecords.allData;
      this.initPlay();
    },
    methods: {
      ...mapMutations(['SET_CURRENT_MUSIC_ID', 'SET_LIKE_MUSIC_LIST']),
      initPlay: function() {
        let vm = this;
        vm.getMusicDetail(vm.musicId);
        vm.getMusicUrl(vm.musicId);
        vm.getMusicLyric(vm.musicId);
        vm.getMusicComment(vm.musicId);
        vm.imgRotateAngle = 0;
        setTimeout(function() {
          vm.getMusicDuration();
        },1000);
      },
      getMusicDetail: function (id) {
        let vm = this;
        service.getSongDetail(id).then(function (res) {
          vm.musicInfo = res.songs[0];
        })
      },
      getMusicUrl: function(id) {
        let vm = this;
        if(id) {
          service.getPlayUrl(id).then(function(res) {
            vm.playUrl = res.data["0"].url;
            vm.$nextTick(function () {
              vm.audio = wx.createInnerAudioContext();
              vm.audio.src = vm.playUrl;
              vm.audio.play();
            })
          });
          vm.SET_CURRENT_MUSIC_ID(id);
          vm.likeMusicList.map(function (item) {
            if(item == id) {
              vm.IsLike = true;
            }
          })
        }
      },
      getMusicLyric: function(id) {
        let vm = this;
        if(id) {
          service.getIcy(id).then(function(res) {
            if(res.code == 200) {
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
          console.log(this.audio);
          this.maxTime = parseInt(duration);
          duration = util.formatterDuration(duration);
          this.duration = duration;
      },
      startPlay: function() {
        this.IsPlay = true;
      },
      stopPlay: function() {
        this.IsPlay = false;
      },
      timeUpdate: function() {
        this.currentTime = this.audio.currentTime;
        this.playTime = util.formatterDuration(this.audio.currentTime);
      },
      endPlay: function() {
        this.IsPlay = false;
        this.audio.pause();
        this.currentTime = 0;
        this.playTime = '00:00';
      },
      slideMusicTime: function(value) {
        this.audio.currentTime = this.currentTime = value;
      },
      toggleLikeMusic: function () {
        let vm = this;
        service.likeMusic(!vm.IsLike, vm.musicId).then(function (res) {
          //更新state
          if(res.code == 200) {
            alert(vm.IsLike ? '取消喜欢' : '已喜欢');
            let currentLikeMusicList = vm.likeMusicList;
            vm.IsLike ? currentLikeMusicList.splice(currentLikeMusicList.indexOf(vm.musicId), 1) : currentLikeMusicList.push(vm.musicId);
            vm.SET_LIKE_MUSIC_LIST(currentLikeMusicList);
            vm.IsLike = !vm.IsLike;
          }

        })
      },
      showLrc: function () {
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
      hideFormat () {
        return null;
      },
      getUserPlayLists: function () {
        let vm = this;
        service.getUserPlayLists(vm.$store.state.user.profile.userId, 0).then(function (res) {
//          console.log('最近播放',res);
          if(res.code == 200) {
            vm.allPlayList = res.allData;
            vm.$refs.playListBox.style.bottom = '4rem';
          }
        })
      },
      hidePlayList: function() {
        this.$refs.playListBox.style.bottom = '-100%';
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
            playIndex = playIndex == vm.allPlayList.length - 1 ? 0 : index + 1;
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
            playIndex = playIndex == 0 ? vm.allPlayList.length - 1 : index - 1;
          }
        });
        vm.musicId = vm.allPlayList[playIndex].song.id;
        vm.initPlay();
      }
    },
    watch: {

    }
  }
</script>

<style scoped>
  .playing-audio-box {
    width: 100%;
    height: 60%;
  }
  .song-action-box {
    text-align: center;
  }
  .play-action-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 100rpx;
    /*text-align: center;*/
  }
  .audio-pic-box {
    width: 70%;
    margin: 5% auto;
    border-radius: 50%;
    overflow: hidden;
  }
  .play-action-box i {
    cursor: pointer;
  }
  .audio-pic-box > img {
    max-width: 100%;
  }
  .play-list-box {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 99;
    bottom: -100%;
    transition: all 0.7s;
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
    font-size: 24rpx;
  }
</style>
