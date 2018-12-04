<template>
  <div class="app-content">
    <header-bar></header-bar>
    <i-tabs i-class="pad-top tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
      <i-tab key="homeSpecialRecommend" title="个性推荐"></i-tab>
      <i-tab key="homePlayList" title="歌单"></i-tab>
      <i-tab key="homeDJ" title="主播电台"></i-tab>
      <i-tab key="homeTopMusicList" title="排行榜"></i-tab>
    </i-tabs>
    <div class="tab-content">
      <swiper class="banner-box" indicator-dots="true" autoplay="true" interval="3000" duration="600">
        <block v-for="item in banners" :key="item.targetId" @click="goTarget(item.url, item.targetId)">
          <swiper-item>
            <image :src="item.picUrl" class="slide-image"/>
          </swiper-item>
        </block>
      </swiper>
      <i-row class="special-list">
        <i-col span="8">
          <div class="circle-border" @click="$router.push('/privateFM')">
            <i-icon type="md-radio" color="#d6413d" />
          </div>
          <p>私人FM</p>
        </i-col>
        <i-col span="8">
          <div class="circle-border daily-recommend-music-count" @click="$router.push('/dailyRecommendSongs')">
            20
          </div>
          <p>每日歌曲推荐</p>
        </i-col>
        <i-col span="8">
          <div class="circle-border" @click="$router.push('/cloudHotMusic')">
            <i-ccon type="ios-podium-outline" color="#d6413d" />
          </div>
          <p>云音乐热歌榜</p>
        </i-col>
      </i-row>
      <div class="recommend-item">
        <div class="recommend-title"><i-icon type="md-calendar" size="30" color="#d6413d" />推荐歌单<span class="check-more">更多&gt;</span></div>
        <i-row class="recommend-play-list" :gutter="24">
          <i-col :span="12" i-class="recommend-play-item" v-for="item in recommendMusic" :key="item.id">
            <div class="play-pic-box">
              <img :src="item.picUrl" />
              <!--<div class="music-play-count"><i-icon type="ios-headset-outline" />{{ item.playCount > 10000 ? (item.playCount / 10000).toFixed(0) + '万' : (item.playCount.toFixed(0) + '人') }}</div>-->
            </div>
            <p class="play-name">{{ item.name }}</p>
          </i-col>
        </i-row>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i-icon type="md-calendar" size="30" color="#d6413d" />推荐MV<span class="check-more" @click="$router.push('/MV')">更多&gt;</span></div>
        <ul class="recommend-play-list">
          <li class="recommend-play-item" v-for="item in recommendMVs" :key="item.id" @click="$router.push({path: '/playMV', query: { id: item.id }})">
            <img :src="item.picUrl" />
            <p>{{ item.name }}</p>
            <p>{{ item.copywriter }}</p>
            <p>播放次数：{{ item.playCount }}</p>
          </li>
        </ul>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i-icon type="md-calendar" size="30" color="#d6413d" />独家放送<span class="check-more">更多&gt;</span></div>
        <ul class="recommend-play-list">
          <li class="recommend-play-item" v-for="item in privateContents" :key="item.id" @click="">
            <img :src="item.picUrl" />
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i-icon type="md-calendar" size="30" color="#d6413d" />推荐电台<span class="check-more">更多&gt;</span></div>
        <i-row class="right-content-box" v-for="item in recommendDJs" :key="item.id" @click="$router.push({path: '/DJDetail', query: { id: item.id }})">
          <i-col span="8" i-class="play-pic-box">
            <img :src="item.picUrl" />
          </i-col>
          <i-col span="16" class="right-info-box">
            <p>{{ item.name }}</p>
            <p>{{ item.copywriter }}</p>
          </i-col>
        </i-row>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../../service/service';
import headerBar from '../../components/header';
export default {
  mounted() {
    this.getBanners();
    this.getDailyRecomments();
    this.getRecommendMVs();
    this.getPrivateContents();
    this.getRecommendDJs();
  },
  data () {
    return {
      currentTab: 'homeSpecialRecommend',
      currentIndex: 0,
      banners: [],
      recommendMusic: [],
      recommendMVs: [],
      recommendDJs: [],
      privateContents: [],
    }
  },
  components: {
    headerBar
  },
  methods: {
    getBanners: function() {
      var vm = this;
      service.getBanner().then(function(res) {
        if(res.code == 200) {
          vm.banners = res.banners;
        }
      });
    },
    goTarget: function(url, id) {
      if(url.length) {
        if(url.startsWith('http')) {
          window.location.href = url;
        } else {
          this.$router.push({ path: '/album/albumDetail', query: { id : id} });
        }
      }
    },
    getDailyRecomments: function() {
      var vm = this;
      service.getRecommendMusic().then(function(res) {
        if(res.code == 200) {
          vm.recommendMusic = res.result.splice(0,6);
        }
      });
    },
    getRecommendMVs: function() {
      let vm = this;
      service.getRecommendMV().then(function (res) {
        if(res.code == 200) {
          vm.recommendMVs = res.result;
        }
      })
    },
    getPrivateContents: function () {
      let vm = this;
      service.getPrivateContent().then(function(res) {
        if(res.code == 200) {
          vm.privateContents = res.result;
        }
      })
    },
    getRecommendDJs: function() {
      let vm = this;
      service.getRecommendDJ().then(function (res) {
        if(res.code == 200) {
          vm.recommendDJs = res.result.splice(0,3);
        }
      });
    },
    handleChange (detail) {
        this.currentTab =  detail.target.key;
    }
  }
}
</script>

<style scoped>
  .banner-box {
    width: 100%;
    height: 400rpx;
    text-align: center;
  }
  .special-list {
    font-size: 28rpx;
    line-height: 2;
    text-align: center;
  }
  .circle-border {
    height: 100rpx;
    width: 100rpx;
    margin: 0 auto;
    line-height: 100rpx;
    text-align: center;
    border: 2px solid #d6413d;
    border-radius: 50%;
    font-size: 32rpx;
  }
  .circle-border.daily-recommend-music-count {
    line-height: 100rpx;
    color: #d6413d;
  }
  .tab-bar {
    padding-top: 10rpx;
    text-align: center;
  }
  .tabBarItem {
    margin: 0 20rpx;
    display: inline-block;
    font-size: 18rpx;
    cursor: pointer;
  }
  .tabBarItem.active {
    border-bottom: 4px solid #d6413d;
  }
  .recommend-title {
    font-size: 30rpx;
  }
  .play-pic-box img {
    max-height: 100%;
  }
  .banner-box {
    padding: 60rpx 0 20rpx 0;
  }
</style>
<style>
  .play-pic-box {
    height: 260rpx;
  }
  .recommend-play-item {
    padding: 0 10rpx;
    text-align:center;
    font-size:26rpx;
  }
</style>
