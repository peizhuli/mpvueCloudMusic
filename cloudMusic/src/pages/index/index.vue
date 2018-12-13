<template>
  <div class="app-content">
    <header-bar></header-bar>
    <i-tabs i-class="pad-top tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
      <i-tab key="homeSpecialRecommend" title="个性推荐"></i-tab>
      <i-tab key="homePlayList" title="歌单"></i-tab>
      <i-tab key="homeDJ" title="主播电台"></i-tab>
      <i-tab key="homeTopMusicList" title="排行榜"></i-tab>
    </i-tabs>
    <div class="tab-content" v-if="currentTab == 'homeSpecialRecommend'">
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
            <i class="home-recommend-icon home-fm-icon" />
          </div>
          <p>私人FM</p>
        </i-col>
        <i-col span="8">
          <div class="circle-border daily-recommend-music-count" @click="goUrl('/pages/dailyRecommendMusic/main')">

          </div>
          <p>每日歌曲推荐</p>
        </i-col>
        <i-col span="8">
          <div class="circle-border" @click="goUrl('/pages/cloudHotMusic/main')">
            <i class="home-recommend-icon top-music-icon" />
          </div>
          <p>云音乐热歌榜</p>
        </i-col>
      </i-row>
      <div class="recommend-item">
        <div class="recommend-title"><i class="recommend-title-icon" />推荐歌单<span class="check-more">更多&gt;</span></div>
        <i-row class="recommend-play-list" :gutter="24">
          <i-col :span="12" i-class="recommend-play-item" v-for="item in recommendMusic" :key="item.id" @click="goUrl('/pages/playListCategoryDetail/main?id=' + item.id)">
            <div class="play-pic-box">
              <img class="col-img" :src="item.picUrl" />
              <!--<div class="music-play-count"><i-icon type="ios-headset-outline" />{{ item.playCount > 10000 ? (item.playCount / 10000).toFixed(0) + '万' : (item.playCount.toFixed(0) + '人') }}</div>-->
              <p class="play-name">{{ item.name }}</p>
            </div>
          </i-col>
        </i-row>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i class="recommend-title-icon" />推荐MV<span class="check-more" @click="$router.push('/MV')">更多&gt;</span></div>
        <ul class="recommend-play-list">
          <li class="recommend-play-item" v-for="item in recommendMVs" :key="item.id" @click="goUrl('/pages/playMV/main?id=' + item.id)">
            <img class="block-img" :src="item.picUrl" />
            <p>{{ item.name }}</p>
            <p>{{ item.copywriter }}</p>
            <p>播放次数：{{ item.playCount }}</p>
          </li>
        </ul>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i class="recommend-title-icon" />独家放送<span class="check-more">更多&gt;</span></div>
        <ul class="recommend-play-list">
          <li class="recommend-play-item" v-for="item in privateContents" :key="item.id" @click="">
            <img class="block-img" :src="item.picUrl" />
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
      <div class="recommend-item">
        <div class="recommend-title"><i class="recommend-title-icon" />推荐电台<span class="check-more">更多&gt;</span></div>
        <i-row class="right-content-box" v-for="item in recommendDJs" :key="item.id" @click="goUrl('/pages/DJRadioTypeDetail/main?id=' + item.id)">
          <i-col span="8" i-class="play-pic-box">
            <img class="col-img" :src="item.picUrl" />
          </i-col>
          <i-col span="16" class="right-info-box">
            <p>{{ item.name }}</p>
            <p>{{ item.copywriter }}</p>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="tab-content" v-if="currentTab == 'homePlayList'">
      <div class="songs-type-box">
        <span @click="goUrl('/pages/playListCategory/main')">全部歌单</span>
        <div class="hot-songs-type">
            <span v-for="item in hotPlayType" :key="item.id" @click="goUrl('/pages/playListCategory/main?category=' + item.category + '&name=' + item.name)">
              {{ item.name }}
            </span>
        </div>
      </div>
      <div class="well-chosen-play-box" v-if="currentTab == 'homePlayList'">
        <i-row>
          <i-col i-class="pad-10" span="8" v-for="item in wellChosenPlay" :key="item.id">
          <div class="play-item" @click="goUrl('/pages/playListCategoryDetail/main?id=' + item.id)">
            <img class="col-img" :src="item.coverImgUrl" />
            <div class="music-play-count"><i-icon type="ios-headset-outline" />{{ formatPlayCount(item.playCount) }}</div>
            <div class="creator"><i-icon type="ios-headset-outline" />{{ item.creator.nickname }}</div>
          </div>
          <div class="play-item-name">{{ subStrCount(item.name, 15) }}</div>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="tab-content" v-if="currentTab == 'homeDJ'">
      <div class="category-title">
        <span>付费精选</span>
      </div>
      <div class="dj-box">
        <swiper class="banner-box" autoplay="true" interval="3000" duration="600" display-multiple-items="3">
          <block v-for="item in wellChosenDJs" :key="item.id" @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">
            <swiper-item>
              <img class="col-img" :src="item.picUrl" />
              <p>{{ item.name }}</p>
            </swiper-item>
          </block>
        </swiper>
        <!--<i-row class="dj-list">-->
          <!--<i-col span="6" class="dj-item" v-for="item in wellChosenDJs" :key="item.id" @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">-->
          <!--<img class="col-img" :src="item.picUrl" />-->
          <!--<p>{{ item.name }}</p>-->
          <!--</i-col>-->
        <!--</i-row>-->
        <div class="more-info">
          <i-button type="error" ghost>更多付费节目</i-button>
        </div>
      </div>
      <div class="" v-for="(djItem, djIndex) in djLists" :key="djIndex">
        <div class="category-title" @click="goUrl('/pages/DJRadioTypeDetail/main?id=' + djItem[0].categoryId)">
          <span>{{ djItem[0].category }}</span>
          <i-ccon type="enter" size="30" />
        </div>
        <div class="" v-for="item in djLists[djIndex]" :key="item.id" @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">
          <i-row class="enter">
            <i-col span="6">
            <img class="col-img" :src="item.picUrl" />
            </i-col>
            <i-col span="18">
              <div class="col-content">
                <div>{{ item.name }}</div>
                <div>{{ item.rcmdtext }}</div>
                <div>{{ item.lastUpdateProgramName }}</div>
              </div>
            </i-col>
          </i-row>
        </div>
      </div>
      <div class="category-title">
        <span>分类</span>
      </div>
      <div class="dj-box">
        <i-row class="dj-list">
          <i-col span="6" class="dj-item" v-for="item in DJCategories" :key="item.id"  @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">
          <img class="dj-type-icon" :src="item.pic56x56Url" />
          <p>{{ item.name }}</p>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="tab-content" v-if="currentTab == 'homeTopMusicList'">
      <div class="top-list-box">
        <div class="top-music-item" v-for="item in topMusicList" :key="item.id" @click="$router.push({path: '/topList', query: { name: item.name }})">
          <i-row>
            <i-col span="8">
              <img class="col-img" :src="item.coverImgUrl" />
              <span class="update-frequency">{{ item.updateFrequency }}</span>
            </i-col>
            <i-col span="16" class="music-top-content">
              <div class="music-top-list">
                <div class="music-top-name play-item-name" v-for="(track, idx) in item.tracks" :key="idx">
                  {{ idx + 1 }}. {{ track.first }} - {{ track.second }}
                </div>
              </div>
            </i-col>
          </i-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../utils/index';
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
      hotPlayType: [],
      wellChosenPlay: [],
      topMusicList: [],
      DJCategories: [],
      DJPrograms: [],
      wellChosenDJs: [],
      TypeIndex: 0,
      djLists: []
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
          wx.navigateTo({
            url: '/pages/album/main?id=' + id
          });
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
        switch(this.currentTab) {
          case 'homeSpecialRecommend': {
            this.getBanners();
            this.getDailyRecomments();
            this.getRecommendMVs();
            this.getPrivateContents();
            this.getRecommendDJs();
            break;
          }
          case 'homePlayList': {
              this.getHotPlayType();
              this.getWellChosenPlay();
              break;
          }
          case 'homeDJ': {
              this.getDJTypes();
              this.getDJPayLists();
              this.getDJCategoryRecommend();
              break;
          }
          case 'homeTopMusicList': {
              this.getTopMusicList();
              break;
          }
        }
    },
    getHotPlayType: function () {
      let vm = this;
      service.getHotPlayList().then(function (res) {
        vm.hotPlayType = res.tags;
      })
    },

    getWellChosenPlay: function () {
      let vm = this;
      service.getWellChosenList().then(function (res) {;
        vm.wellChosenPlay = res.playlists;
      })
    },
    getTopMusicList: function () {
      let vm = this;
      service.getMusicTopBrief().then(function (res) {
        vm.topMusicList = res.list;
      })
    },
    getDJTypes: function() {
      let vm = this;
      service.getDJType().then(function (res) {
        if(res.code == 200) {
          vm.DJCategories = res.categories;
          vm.$nextTick(function () {
            vm.getDJCategoryRecommend();
          })
        }
      })
    },
    getDJPayLists: function () {
      let vm = this;
      service.getDJPayList().then(function (res) {
//          console.log(res);
        if(res.code == 200) {
          vm.wellChosenDJs = res.data.list;
          vm.wellChosenDJs.length = 3;
        }
      })
    },
    getDJCategoryRecommend: function () {
      let vm = this;
      vm.djLists = [];
      let currentIndex = '';
      for(let i=0;i<6;i++) {
        currentIndex =  vm.DJCategories[i].id;
        service.getDJCategoryRecommend(currentIndex).then(function (res) {
          if(res.code == 200) {
            vm.djLists.push(res.djRadios.splice(0,3));
          }
        })
      }
    },
    formatPlayCount: function (count) {
      return util.formatPlayCount(count);
    },
    subStrCount: function (str, maxCount) {
      return util.subStrCount(str, maxCount);
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
    height: 150rpx;
    width: 150rpx;
    margin: 0 auto;
    line-height: 150rpx;
    text-align: center;
    border: 2px solid #d6413d;
    border-radius: 50%;
    font-size: 50rpx;
  }
  .circle-border.daily-recommend-music-count {
    line-height: 100rpx;
    color: #d6413d;
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
    width: 100%;
    height: 80rpx;
    display: inline-flex;
    align-items: center;
    font-size: 30rpx;
  }
  .banner-box {
    padding: 20rpx 0 20rpx 0;
  }
  .songs-type-box {
    font-size: 28rpx;
  }
  .hot-songs-type {
    font-size: 24rpx;
  }
  .top-music-item {
    position: relative;
  }
  .music-top-list {
    height: 240rpx;
    padding-left: 20rpx;
    line-height: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .update-frequency {
    position: absolute;
    bottom: 5%;
    left: 5%;
    font-size: 30rpx;
    color: #fff;
  }
  .music-top-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dj-item {
    font-size: 24rpx;
  }
  .home-recommend-icon {
    display: inline-block;
    width: 110rpx;
    height: 110rpx;
    position: relative;
    top: 20rpx
  }
  .home-fm-icon {
    background: url("../../../static/img/home/fm-icon.png") center no-repeat;
  }
  .top-music-icon {
    background: url("../../../static/img/home/top-music-icon.png") center no-repeat;
  }
  .recommend-title-icon {
    display: inline-block;
    width: 72rpx;
    height: 72rpx;
    position: relative;
    /*top: 30rpx;*/
    background: url("../../../static/img/home/recommend-title-icon.png") center no-repeat;
  }
</style>
<style>
  .play-pic-box {
    height: 320rpx;
  }
  .recommend-play-item {
    padding: 0 10rpx;
    text-align:center;
    font-size: 26rpx;
  }
  .tab-bar {
    padding-bottom: 40rpx;
    text-align: center;
  }
  img.dj-type-icon {
    width: 120rpx;
    height: 120rpx;
  }
  .check-more {
    position: absolute;
    right: 0;
    padding-right: 20rpx;
  }
</style>
